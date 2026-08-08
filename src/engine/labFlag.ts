// Switches the balance lab can flip that the browser must never trip over.
//
// Bisecting a regression means running the same code with one behaviour changed
// at a time, and an environment variable is the cheapest way to do that without
// editing and reverting source between runs.
//
// The trap: `process` does not exist in a browser. Reading `process.env.X`
// directly inside engine code compiles fine, passes typecheck, passes every
// test (vitest runs under Node), and then throws ReferenceError on load and
//白 the whole app. Which is exactly what happened: a white screen, and the
// only clue was one console line.
//
// So every lab switch goes through here, and here guards the global first.
export function labFlag(name: string): string | undefined {
  if (typeof process === 'undefined' || !process.env) return undefined;
  return process.env[name];
}
