import { Component, inject, isDevMode, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMAGES } from '../../data/images';
import { SITE } from '../../data/site';
import { Reveal } from '../../reveal';

type Status = 'idle' | 'sending' | 'sent' | 'error';

// Our own Vercel Serverless Function (api/contact.ts), deployed with the site. It emails the message to
// the inbox configured on the server, so the recipient is never taken from the browser.
const CONTACT_ENDPOINT = '/api/contact';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, Reveal],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly hero = IMAGES.contactHero;
  protected readonly site = SITE;
  protected readonly status = signal<Status>('idle');
  /** Technical reason for the last failure; shown only in development builds. */
  protected readonly errorDetail = signal('');
  protected readonly devMode = isDevMode();

  protected readonly topics = ['General enquiry', 'Aapki Awaaz submission', 'Charcha podcast', 'Partnerships', 'Feedback'];

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    topic: [this.topics[0]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    // Honeypot: hidden from people, so anything typed here comes from a bot.
    botcheck: [''],
  });

  protected invalid(field: 'name' | 'email' | 'message'): boolean {
    const c = this.form.controls[field];
    return c.invalid && (c.touched || c.dirty);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.status() === 'sending') return;

    const { name, email, topic, message, botcheck } = this.form.getRawValue();
    if (botcheck) {
      this.status.set('sent');
      return;
    }

    this.status.set('sending');
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, topic, message }),
      });
      const isJson = res.headers.get('content-type')?.includes('application/json');
      if (!isJson) {
        throw new Error(
          `${CONTACT_ENDPOINT} did not run (HTTP ${res.status}). It runs on Vercel (or locally with "vercel dev") — not under "ng serve".`,
        );
      }
      const result = (await res.json()) as { success?: boolean; message?: string; code?: string; hint?: string };
      if (!res.ok || result.success !== true) {
        const detail = [result.message, result.code && `[${result.code}]`, result.hint].filter(Boolean).join(' ');
        throw new Error(detail || `Request failed (HTTP ${res.status})`);
      }

      this.status.set('sent');
      this.form.reset();
    } catch (err) {
      console.error('Contact form failed to send:', err);
      this.errorDetail.set(err instanceof Error ? err.message : String(err));
      this.status.set('error');
    }
  }
}
