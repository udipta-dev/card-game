// Picking up a new build without making the player ask for it twice.
//
// THE PROBLEM. `registerType: 'autoUpdate'` plus `registerSW({ immediate: true })`
// installs the new service worker and hands it control straight away, but it
// does NOT reload the page that is already open. The document keeps the HTML and
// the asset hashes it booted with, so the first visit after a deploy always
// shows the PREVIOUS build and the one after it shows the new one. Verified on
// the live site: index-BewGXzY8.css on the first load, index-B3x7s3WF.css on the
// second, from the same deployment.
//
// That is the whole of "I pushed it, why can I not see it". Nobody reloads twice
// to check whether a page is stale.
//
// THE CATCH, and why this is not just location.reload(). A battle lives entirely
// in a useReducer and is not persisted anywhere; a run is saved to localStorage
// after every change, but the fight in progress is not. Reloading mid-match
// would throw away the match. So the reload waits for a moment when it costs
// nothing.

/** True while a battle is on screen. Set by MatchView, read here. */
let inBattle = false;

export function setInBattle(on: boolean) {
  inBattle = on;
  if (!on) flush();
}

let pending = false;
let done = false;

function flush() {
  if (!pending || done || inBattle) return;
  done = true;
  window.location.reload();
}

export function watchForNewBuild() {
  const sw = navigator.serviceWorker;
  if (!sw) return;
  // Only when there was ALREADY a worker in charge. On a first-ever visit the
  // controller arrives for the first time and there is nothing stale to escape;
  // reloading then would just be a wasted round trip on someone's first look at
  // the game.
  const hadController = !!sw.controller;
  sw.addEventListener('controllerchange', () => {
    if (!hadController) return;
    pending = true;
    flush();
  });
}
