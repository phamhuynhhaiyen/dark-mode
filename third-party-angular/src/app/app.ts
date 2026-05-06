import { Component } from '@angular/core';
import { SimpleChartComponent } from './simple-chart/simple-chart.component';

@Component({
  selector: 'app-root',
  imports: [SimpleChartComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
