import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { ThemeService } from '../theme.service';

Chart.register(...registerables);

@Component({
  selector: 'app-simple-chart',
  imports: [],
  templateUrl: './simple-chart.component.html',
  styleUrl: './simple-chart.component.scss',
})
export class SimpleChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true })
  private readonly chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  private readonly destroyRef = inject(DestroyRef);
  private readonly themeService = inject(ThemeService);

  ngAfterViewInit(): void {
    const theme = this.getChartTheme();

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
          {
            label: 'Visitors',
            data: [32, 48, 44, 61, 74, 88],
            borderColor: theme.lineColor,
            backgroundColor: theme.fillColor,
            borderWidth: 3,
            fill: true,
            pointBackgroundColor: theme.lineColor,
            pointBorderColor: theme.surfaceColor,
            pointBorderWidth: 2,
            pointRadius: 4,
            tension: 0.38,
          },
        ],
      },
      options: {
        responsive: true,
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
            backgroundColor: theme.surfaceColor,
            borderColor: theme.borderColor,
            borderWidth: 1,
            padding: 12,
            titleColor: theme.textColor,
            bodyColor: theme.textColor,
            displayColors: false,
          },
        },
        scales: {
          x: {
            border: {
              color: theme.gridColor,
            },
            grid: {
              color: theme.gridColor,
            },
            ticks: {
              color: theme.textColor,
            },
          },
          y: {
            beginAtZero: true,
            border: {
              color: theme.gridColor,
            },
            grid: {
              color: theme.gridColor,
            },
            ticks: {
              color: theme.textColor,
            },
          },
        },
      },
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, config);

    this.themeService.themeMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateChartTheme());
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
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
    dataset.pointBorderColor = theme.surfaceColor;

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
        backgroundColor: theme.surfaceColor,
        borderColor: theme.borderColor,
        titleColor: theme.textColor,
        bodyColor: theme.textColor,
        displayColors: false,
      },
    };

    if (scales?.x) {
      scales.x.grid = { ...scales.x.grid, color: theme.gridColor };
      scales.x.ticks = { ...scales.x.ticks, color: theme.textColor };
      scales.x.border = { ...scales.x.border, color: theme.gridColor };
    }

    if (scales?.y) {
      scales.y.grid = { ...scales.y.grid, color: theme.gridColor };
      scales.y.ticks = { ...scales.y.ticks, color: theme.textColor };
      scales.y.border = { ...scales.y.border, color: theme.gridColor };
    }

    this.chart.update();
  }

  private getChartTheme() {
    const styles = getComputedStyle(document.documentElement);

    return {
      surfaceColor: styles.getPropertyValue('--color-surface').trim(),
      textColor: styles.getPropertyValue('--color-text').trim(),
      borderColor: styles.getPropertyValue('--color-border').trim(),
      gridColor: styles.getPropertyValue('--chart-grid').trim(),
      lineColor: styles.getPropertyValue('--chart-line').trim(),
      fillColor: styles.getPropertyValue('--chart-fill').trim(),
    };
  }
}
