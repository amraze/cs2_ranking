import { Component } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { SharedImports } from '../../../shared/shared-imports';
import { ChartComponent } from '../../../shared/components/chart/chart';

@Component({
  selector: 'app-global-stats',
  imports: [SharedImports, ChartComponent],
  templateUrl: './global-stats.html',
  styleUrl: './global-stats.scss'
})
export class GlobalStats {
  winRateData: ChartData<ChartType> = {
    labels: ['Win', 'Loss', 'Draw'],
    datasets: [{
      data: [88, 81, 4],
      backgroundColor: ['#58b64bff', '#FF6384', '#FFCE56']
    }]
  };

  winRateOptions: ChartOptions<ChartType> = {
    responsive: true,
    color: 'white',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
          boxWidth: 10,
          boxHeight: 10,
        }
      },
      datalabels: {
        color: 'white',
        font: { weight: 'bold', size: 12 },
        formatter: value => value,
        anchor: 'center',
        align: 'center'
      }
    }
  };

  mapData: ChartData<ChartType> = {
    labels: ['Mirage', 'Dust 2', 'Inferno', 'Nuke', 'Ancient', 'Anubis', 'Overpass', 'Train'],
    datasets: [{
      data: [31, 21, 8, 10, 10, 8, 4, 8],
    }]
  };

  mapOptions: ChartOptions<'radar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      r: {
        grid: {
          color: 'rgba(255, 255, 255, 0.2)'
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.2)'
        },
        pointLabels: {
          color: 'white'
        },
        ticks: {
          display: false
        }
      }
    },
    layout: {
      padding: 10
    }

  };

}
