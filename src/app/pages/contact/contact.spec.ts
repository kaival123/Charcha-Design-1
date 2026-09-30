import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Contact } from './contact';

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });

describe('Contact', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  async function setup() {
    const fixture = TestBed.createComponent(Contact);
    const el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
    const fill = () => {
      const type = (selector: string, value: string) => {
        const input = el.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)!;
        input.value = value;
        input.dispatchEvent(new Event('input'));
      };
      type('input[formControlName=name]', 'Asha Rao');
      type('input[formControlName=email]', 'asha@example.com');
      type('textarea[formControlName=message]', 'I would love to contribute a story.');
    };
    const submit = async () => {
      el.querySelector<HTMLFormElement>('form')!.dispatchEvent(new Event('submit'));
      await new Promise((r) => setTimeout(r));
      await fixture.whenStable();
    };
    return { el, fill, submit };
  }

  it('sends every field directly and shows a thank-you', async () => {
    fetchSpy.mockResolvedValue(json({ success: true, message: 'Message sent.' }, 200));
    const { el, fill, submit } = await setup();

    fill();
    await submit();

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('api/contact.php');
    const payload = JSON.parse(init.body as string);
    expect(payload).toEqual({
      name: 'Asha Rao',
      email: 'asha@example.com',
      topic: 'General enquiry',
      message: 'I would love to contribute a story.',
    });
    expect(el.querySelector('.success')?.textContent).toContain('Your message has been sent');
  });

  it('shows an error and keeps the message when sending fails', async () => {
    fetchSpy.mockResolvedValue(json({ success: false, message: 'The mail server could not send the message.' }, 500));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { el, fill, submit } = await setup();

    fill();
    await submit();

    expect(el.querySelector('.success')).toBeNull();
    expect(el.querySelector('.form-error')?.textContent).toContain('couldn’t be sent');
    expect(el.querySelector<HTMLTextAreaElement>('textarea')!.value).toBe('I would love to contribute a story.');
  });

  it('explains when the PHP handler is not running', async () => {
    // e.g. under `ng serve`, which answers with the app's HTML instead of running PHP.
    fetchSpy.mockResolvedValue(new Response('<!doctype html>', { status: 200, headers: { 'Content-Type': 'text/html' } }));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { el, fill, submit } = await setup();

    fill();
    await submit();

    expect(el.querySelector('.form-error')?.textContent).toContain('needs a PHP web server');
  });

  it('does not send when the form is invalid', async () => {
    const { el, submit } = await setup();

    await submit();

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(el.querySelectorAll('label small').length).toBe(3);
  });
});
