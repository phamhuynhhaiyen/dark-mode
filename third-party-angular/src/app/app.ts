import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { SimpleChartComponent } from './simple-chart/simple-chart.component';
import { ThemeMode, ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    SimpleChartComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly themeService = inject(ThemeService);

  protected setTheme(mode: ThemeMode): void {
    this.themeService.setTheme(mode);
  }

  protected toggleTheme(): void {
    this.themeService.toggleManualTheme();
  }
}
