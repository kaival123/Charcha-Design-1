import { describe, expect, it } from 'vitest';
import { BrandColours, PALETTES, brandVars, contrast } from './theme';

/** Every text colour derived for a background must stay readable on both the page and on cards. */
function expectReadable(c: BrandColours) {
  const v = brandVars(c);
  for (const surface of [c.background, v['--brand-surface']]) {
    expect(contrast(v['--brand-ink'], surface)).toBeGreaterThanOrEqual(7);
    expect(contrast(v['--brand-ink-soft'], surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(v['--brand-muted'], surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(v['--brand-primary-text'], surface)).toBeGreaterThanOrEqual(4.5);
  }
  expect(contrast(v['--brand-on-primary'], v['--brand-primary-text'])).toBeGreaterThanOrEqual(4.5);
  return v;
}

describe('brandVars', () => {
  for (const p of PALETTES) {
    it(`keeps text readable for the ${p.label} palette`, () => {
      const v = expectReadable(p);
      expect(v['--brand-bg']).toBe(p.background);
      expect(v['--brand-ink']).toBe('#1b1a17');
    });
  }

  it('switches to light text on a dark custom background', () => {
    const v = expectReadable({ primary: '#c03426', accent: '#b2db00', ring: '#f2e21b', background: '#1d2433' });
    expect(v['--brand-ink']).toBe('#f1ece3');
  });

  it('adjusts a too-light primary so links stay readable', () => {
    const v = expectReadable({ primary: '#ffd400', accent: '#b2db00', ring: '#f2e21b', background: '#faf7f2' });
    expect(v['--brand-primary-text']).not.toBe('#ffd400');
  });
});
