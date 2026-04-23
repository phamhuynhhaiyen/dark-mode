import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartConfiguration,
} from 'chart.js';

import {
  ThemeMode,
  ThemeService,
  type ResolvedTheme,
} from './theme.service';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
);

type ChartTheme = {
  backgroundColor: string;
  textColor: string;
  gridColor: string;
  lineColor: string;
  fillColor: string;
  borderColor: string;
};

@Component({
  selector: 'app-root',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas')
  private chartCanvas?: ElementRef<HTMLCanvasElement>;

  protected selectedMode: ThemeMode = 'system';
  protected resolvedTheme: ResolvedTheme = 'light';

  private chart?: Chart;
  private readonly destroyRef = inject(DestroyRef);
  private readonly themeService = inject(ThemeService);

  ngOnInit(): void {
    this.selectedMode = this.themeService.getThemeMode();

    this.themeService.themeMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode) => {
        this.selectedMode = mode;
      });

    this.themeService.resolvedTheme$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((theme) => {
        this.resolvedTheme = theme;
        this.updateChartTheme();
      });
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  protected setTheme(mode: ThemeMode): void {
    this.themeService.setTheme(mode);
  }

  protected toggleTheme(): void {
    this.themeService.toggleManualTheme();
  }

  private createChart(): void {
    const canvas = this.chartCanvas?.nativeElement;

    if (!canvas) {
      return;
    }

    const theme = this.getChartTheme();
    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Revenue',
            data: [52, 64, 58, 76, 88, 82, 96],
            borderColor: theme.lineColor,
            backgroundColor: theme.fillColor,
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 5,
            pointBackgroundColor: theme.lineColor,
            pointBorderColor: theme.backgroundColor,
            pointBorderWidth: 3,
            borderWidth: 3,
          },
        ],
      },
      options: {
        animation: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: theme.textColor,
              usePointStyle: true,
              boxWidth: 10,
              boxHeight: 10,
            },
          },
          tooltip: {
            backgroundColor: theme.backgroundColor,
            titleColor: theme.textColor,
            bodyColor: theme.textColor,
            borderColor: theme.borderColor,
            borderWidth: 1,
            displayColors: false,
          },
        },
        scales: {
          x: {
            grid: {
              color: theme.gridColor,
            },
            ticks: {
              color: theme.textColor,
            },
            border: {
              color: theme.gridColor,
            },
          },
          y: {
            grid: {
              color: theme.gridColor,
            },
            ticks: {
              color: theme.textColor,
            },
            border: {
              color: theme.gridColor,
            },
          },
        },
      },
    };

    this.chart = new Chart(canvas, config);
  }

  private updateChartTheme(): void {
    if (!this.chart) {
      return;
    }

    const theme = this.getChartTheme();
    const dataset = this.chart.data.datasets[0] as any;
    const scales = this.chart.options.scales as any;

    dataset.borderColor = theme.lineColor;
    dataset.backgroundColor = theme.fillColor;
    dataset.pointBackgroundColor = theme.lineColor;
    dataset.pointBorderColor = theme.backgroundColor;

    this.chart.options.plugins = {
      ...this.chart.options.plugins,
      legend: {
        ...this.chart.options.plugins?.legend,
        labels: {
          ...this.chart.options.plugins?.legend?.labels,
          color: theme.textColor,
          usePointStyle: true,
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      tooltip: {
        ...this.chart.options.plugins?.tooltip,
        backgroundColor: theme.backgroundColor,
        titleColor: theme.textColor,
        bodyColor: theme.textColor,
        borderColor: theme.borderColor,
        borderWidth: 1,
        displayColors: false,
      },
    };

    if (scales?.x) {
      scales.x.grid = {
        ...scales.x.grid,
        color: theme.gridColor,
      };
      scales.x.ticks = {
        ...scales.x.ticks,
        color: theme.textColor,
      };
      scales.x.border = {
        ...scales.x.border,
        color: theme.gridColor,
      };
    }

    if (scales?.y) {
      scales.y.grid = {
        ...scales.y.grid,
        color: theme.gridColor,
      };
      scales.y.ticks = {
        ...scales.y.ticks,
        color: theme.textColor,
      };
      scales.y.border = {
        ...scales.y.border,
        color: theme.gridColor,
      };
    }

    this.chart.update();
  }

  private getChartTheme(): ChartTheme {
    const styles = getComputedStyle(document.documentElement);

    return {
      backgroundColor: styles.getPropertyValue('--color-surface').trim(),
      textColor: styles.getPropertyValue('--color-text').trim(),
      gridColor: styles.getPropertyValue('--chart-grid').trim(),
      lineColor: styles.getPropertyValue('--chart-line').trim(),
      fillColor: styles.getPropertyValue('--chart-fill').trim(),
      borderColor: styles.getPropertyValue('--color-border').trim(),
    };
  }
}
