// Every text colour must be readable on every ground it can sit on.
//
// Reported from play: "the text colour is poor, very washed out. It has to be
// high contrast." It measured that way. --ink-faint was 4.13 / 3.92 / 3.59
// against the three grounds and --gold-dim was 4.31 / 4.10 / 3.75, all below
// WCAG AA's 4.5:1 for normal text, and both are used at 7.5 to 13px where the
// threshold matters most. --muted was referenced fifteen times in app.css and
// defined nowhere, so those rules ran on an inline fallback.
//
// This reads the real token file rather than a copy, so editing a hex in
// tokens.css is what this test is checking.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = readFileSync(resolve(__dirname, '../../src/styles/tokens.css'), 'utf8');

function token(name: string): string {
  // The first definition in :root wins for our purposes; theme overrides would
  // need their own pass, and there are none today.
  const m = new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`).exec(css);
  if (!m) throw new Error(`--${name} is not defined in tokens.css`);
  return m[1];
}

const channel = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => channel(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** Every surface a piece of text can land on. bg-2 is the lightest, so it is the worst case. */
const GROUNDS = ['bg-0', 'bg-1', 'bg-2'];
/** Colours used for text at normal size, which is the 4.5:1 bar. */
const TEXT = ['ink', 'ink-dim', 'ink-faint', 'gold-dim', 'muted'];

describe('text colours meet WCAG AA on every ground', () => {
  for (const t of TEXT) {
    for (const g of GROUNDS) {
      it(`--${t} on --${g}`, () => {
        const ratio = contrast(token(t), token(g));
        expect(
          ratio,
          `--${t} (${token(t)}) on --${g} (${token(g)}) is ${ratio.toFixed(2)}:1, AA needs 4.5`,
        ).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it('--muted is defined rather than left to a fallback', () => {
    expect(() => token('muted')).not.toThrow();
  });

  it('--gold stays bright enough to be a highlight, not just legible', () => {
    // It carries headings and the brass furniture; if it ever sinks to merely
    // passing, the whole page loses its accent.
    expect(contrast(token('gold'), token('bg-0'))).toBeGreaterThan(6);
  });
});
