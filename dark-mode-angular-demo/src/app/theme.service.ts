import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'demo-theme-mode';
  private readonly mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private readonly modeSubject = new BehaviorSubject<ThemeMode>(this.getInitialMode());
  private readonly resolvedSubject = new BehaviorSubject<ResolvedTheme>('light');

  readonly themeMode$ = this.modeSubject.asObservable();
  readonly resolvedTheme$ = this.resolvedSubject.asObservable();

  constructor() {
    this.applyTheme(this.modeSubject.value);

    if (typeof this.mediaQuery.addEventListener === 'function') {
      this.mediaQuery.addEventListener('change', () => {
        if (this.modeSubject.value === 'system') {
          this.applyTheme('system');
        }
      });
    } else if (typeof this.mediaQuery.addListener === 'function') {
      this.mediaQuery.addListener(() => {
        if (this.modeSubject.value === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  getThemeMode(): ThemeMode {
    return this.modeSubject.value;
  }

  setTheme(mode: ThemeMode): void {
    localStorage.setItem(this.storageKey, mode);
    this.modeSubject.next(mode);
    this.applyTheme(mode);
  }

  toggleManualTheme(): void {
    const nextMode =
      this.modeSubject.value === 'system'
        ? this.resolveTheme('system') === 'dark'
          ? 'light'
          : 'dark'
        : this.modeSubject.value === 'dark'
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
    const resolvedTheme = this.resolveTheme(mode);
    const root = this.document.documentElement;

    root.dataset['theme'] = resolvedTheme;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    this.resolvedSubject.next(resolvedTheme);
  }
}
