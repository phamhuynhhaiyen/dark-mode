import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

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

  ngAfterViewInit(): void {
    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
          {
            label: 'Visitors',
            data: [32, 48, 44, 61, 74, 88],
            // borderColor: '#f472b6',
            // backgroundColor: 'rgba(244, 114, 182, 0.18)',
            // borderWidth: 3,
            // fill: true,
            // pointBackgroundColor: '#080a12',
            // pointBorderColor: '#f472b6',
            // pointBorderWidth: 2,
            // pointRadius: 4,
            // tension: 0.38,
          },
        ],
      },
      // options: {
      //   responsive: true,
      //   maintainAspectRatio: false,
      //   plugins: {
      //     legend: {
      //       display: false,
      //     },
      //     tooltip: {
      //       backgroundColor: '#111827',
      //       borderColor: 'rgba(255, 255, 255, 0.12)',
      //       borderWidth: 1,
      //       padding: 12,
      //       titleColor: '#ffffff',
      //       bodyColor: '#dbeafe',
      //     },
      //   },
      //   scales: {
      //     x: {
      //       border: {
      //         color: 'rgba(255, 255, 255, 0.1)',
      //       },
      //       grid: {
      //         color: 'rgba(255, 255, 255, 0.06)',
      //       },
      //       ticks: {
      //         color: '#9aa4bd',
      //       },
      //     },
      //     y: {
      //       beginAtZero: true,
      //       border: {
      //         color: 'rgba(255, 255, 255, 0.1)',
      //       },
      //       grid: {
      //         color: 'rgba(255, 255, 255, 0.06)',
      //       },
      //       ticks: {
      //         color: '#9aa4bd',
      //       },
      //     },
      //   },
      // },
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, config);
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
