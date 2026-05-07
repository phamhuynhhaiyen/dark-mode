import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'third-party-angular-theme';
  private readonly mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private currentMode: ThemeMode = this.getInitialMode();
  private currentResolvedTheme: ResolvedTheme = 'light';
  private readonly modeSubject = new BehaviorSubject<ThemeMode>(this.currentMode);
  private readonly resolvedSubject = new BehaviorSubject<ResolvedTheme>('light');

  readonly themeMode$ = this.modeSubject.asObservable();
  readonly resolvedTheme$ = this.resolvedSubject.asObservable();

  constructor() {
    this.applyTheme(this.currentMode);

    if (typeof this.mediaQuery.addEventListener === 'function') {
      this.mediaQuery.addEventListener('change', () => {
        if (this.currentMode === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  themeMode(): ThemeMode {
    return this.currentMode;
  }

  resolvedTheme(): ResolvedTheme {
    return this.currentResolvedTheme;
  }

  setTheme(mode: ThemeMode): void {
    localStorage.setItem(this.storageKey, mode);
    this.currentMode = mode;
    this.modeSubject.next(mode);
    this.applyTheme(mode);
  }

  toggleManualTheme(): void {
    const nextMode =
      this.currentMode === 'system'
        ? this.resolveTheme('system') === 'dark'
          ? 'light'
          : 'dark'
        : this.currentMode === 'dark'
          ? 'light'
          : 'dark';

    this.setTheme(nextMode);
  }

  private getInitialMode(): ThemeMode {
    const saved = localStorage.getItem(this.storageKey);

    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }

    return 'system';
  }

  private resolveTheme(mode: ThemeMode): ResolvedTheme {
    if (mode === 'system') {
      return this.mediaQuery.matches ? 'dark' : 'light';
    }

    return mode;
  }

  private applyTheme(mode: ThemeMode): void {
    const resolved = this.resolveTheme(mode);
    const root = this.document.documentElement;

    root.dataset['theme'] = resolved;
    root.classList.toggle('dark', resolved === 'dark');
    root.style.colorScheme = resolved;
    this.currentResolvedTheme = resolved;
    this.resolvedSubject.next(resolved);
  }
}
