import { Component, Input } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, ChartType, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables);
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-chart',
  imports: [NgChartsModule],
  templateUrl: './chart.html',
  styleUrl: './chart.scss'
})
export class ChartComponent {
  @Input() chartType: ChartType = 'doughnut';
  @Input() chartData!: ChartData<ChartType>;
  @Input() chartOptions?: ChartOptions<ChartType>;
}
