import { Component } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { SharedImports } from '../../../shared/shared-imports';
import { ChartComponent } from '../../../shared/components/chart/chart';

@Component({
  selector: 'app-total-evolution',
  imports: [SharedImports, ChartComponent],
  templateUrl: './total-evolution.html',
  styleUrl: './total-evolution.scss'
})
export class TotalEvolution {
  labels = Array.from({ length: 100 }, (_, i) => (i + 1).toString());
  data = this.labels.reduce((acc, _, i) => {
    const prev = acc[i - 1] ?? 50;
    acc.push(Math.min(prev + Math.random() * (0.5 + (80 - prev) / (this.labels.length - i)), 80));
    return acc;
  }, [] as number[]);

  mapData: ChartData<ChartType> = {
    labels: this.labels,
    datasets: [{
      data: this.data,
    }]
  };

  sharedOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: 'white' }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        titleColor: 'white',
        bodyColor: 'white'
      },
      datalabels: {
        display: false
      }
    },
    elements: {
      point: {
        radius: 0
      },
      line: {
        borderWidth: 2,
        tension: 0.3
      }
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.2)' }
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.2)' }
      }
    },
    layout: { padding: 10 }
  };
}
