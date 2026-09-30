import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Reveal } from './reveal';

@Component({
  imports: [Reveal],
  template: `
    <section id="a" appReveal>Up</section>
    <figure id="b" appReveal="right" [revealDelay]="150">Right</figure>
  `,
})
class Host {}

/** Minimal IntersectionObserver stand-in that lets a test "scroll" an element into view. */
class FakeObserver {
  static instances: FakeObserver[] = [];
  readonly targets: Element[] = [];
  disconnected = false;
  constructor(private readonly callback: IntersectionObserverCallback) {
    FakeObserver.instances.push(this);
  }
  observe(el: Element) {
    this.targets.push(el);
  }
  disconnect() {
    this.disconnected = true;
  }
  enter() {
    const entries = this.targets.map((target) => ({ target, isIntersecting: true }) as IntersectionObserverEntry);
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduce && query.includes('reduce') }) as MediaQueryList);
}

describe('Reveal', () => {
  beforeEach(() => {
    FakeObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', FakeObserver);
  });
  afterEach(() => vi.unstubAllGlobals());

  async function render() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    return { a: el.querySelector<HTMLElement>('#a')!, b: el.querySelector<HTMLElement>('#b')! };
  }

  it('hides elements until they scroll into view, then reveals them once', async () => {
    mockReducedMotion(false);
    const { a, b } = await render();

    expect(a.classList).toContain('reveal-pending');
    expect(a.classList).not.toContain('is-visible');
    expect(a.dataset['reveal']).toBe('up');
    expect(b.dataset['reveal']).toBe('right');
    expect(b.style.getPropertyValue('--reveal-delay')).toBe('150ms');

    const observerForA = FakeObserver.instances.find((o) => o.targets.includes(a))!;
    observerForA.enter();

    expect(a.classList).toContain('is-visible');
    expect(observerForA.disconnected).toBe(true);
    expect(b.classList).not.toContain('is-visible');

    // When its own reveal animation ends, the element drops the animation class.
    a.dispatchEvent(Object.assign(new Event('animationend'), { animationName: 'reveal-up' }));
    expect(a.classList).not.toContain('reveal-pending');
    expect(a.classList).toContain('is-visible');
  });

  it('shows everything immediately when the visitor prefers reduced motion', async () => {
    mockReducedMotion(true);
    const { a, b } = await render();

    expect(a.classList).toContain('is-visible');
    expect(b.classList).toContain('is-visible');
    expect(a.classList).not.toContain('reveal-pending');
    expect(FakeObserver.instances.length).toBe(0);
  });
});
