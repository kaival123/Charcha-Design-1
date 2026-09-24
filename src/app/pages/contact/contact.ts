import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMAGES } from '../../data/images';
import { SITE } from '../../data/site';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly hero = IMAGES.contactHero;
  protected readonly site = SITE;
  protected readonly sent = signal(false);

  protected readonly topics = ['General enquiry', 'Your Corner submission', 'The Talk podcast', 'Partnerships', 'Feedback'];

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    topic: [this.topics[0]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected invalid(field: 'name' | 'email' | 'message'): boolean {
    const c = this.form.controls[field];
    return c.invalid && (c.touched || c.dirty);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // TODO: send this.form.getRawValue() to the backend / email service.
    this.sent.set(true);
    this.form.reset();
  }
}
