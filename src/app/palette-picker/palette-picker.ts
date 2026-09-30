import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { BrandColours, PALETTES, PaletteId, ThemeService } from '../theme';

/** Header button that opens the colour panel: preset palettes plus custom primary/accent/ring colours. */
@Component({
  selector: 'app-palette-picker',
  templateUrl: './palette-picker.html',
  styleUrl: './palette-picker.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'close(true)',
  },
})
export class PalettePicker {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');

  protected readonly themes = inject(ThemeService);
  protected readonly palettes = PALETTES;
  protected readonly open = signal(false);

  protected readonly customRows: { key: keyof BrandColours; label: string; hint: string }[] = [
    { key: 'primary', label: 'Primary', hint: 'Buttons, links, footer' },
    { key: 'accent', label: 'Accent', hint: 'Highlights and chips' },
    { key: 'ring', label: 'Ring', hint: 'Decorative outlines' },
    { key: 'background', label: 'Background', hint: 'Page and cards' },
  ];

  protected label(): string {
    return PALETTES.find((p) => p.id === this.themes.palette())?.label ?? 'Custom';
  }

  protected toggle(): void {
    this.open.update((o) => !o);
  }

  protected choose(id: PaletteId): void {
    this.themes.usePalette(id);
  }

  protected onColour(key: keyof BrandColours, event: Event): void {
    this.themes.setColour(key, (event.target as HTMLInputElement).value);
  }

  protected close(refocus = false): void {
    if (!this.open()) return;
    this.open.set(false);
    if (refocus) this.trigger().nativeElement.focus();
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.close();
  }
}
