import { Component, effect, Input, signal } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { SharedImports } from '../../../shared/shared-imports';
import { ChartComponent } from '../../../shared/components/chart/chart';
import { MapPerformanceResponseDto } from '../../../shared/models/map-performance-response-dto';
import { Map } from '../../../shared/models/map.interface';

@Component({
  selector: 'app-global-stats',
  imports: [SharedImports, ChartComponent],
  templateUrl: './global-stats.html',
  styleUrl: './global-stats.scss'
})
export class GlobalStats {
  mapsSignal = signal<Map[]>([]);
  mapPerformanceSignal = signal<{ [id: string]: MapPerformanceResponseDto }>({});

  @Input() set maps(value: Map[]) {
    this.mapsSignal.set(value || []);
  }

  @Input() set mapPerformance(value: { [id: string]: MapPerformanceResponseDto }) {
    this.mapPerformanceSignal.set(value || {});
  }

  avgKd: number = 0;
  totalDmg: number = 0;
  totalWins: number = 0;
  totalKills: number = 0;
  totalDeaths: number = 0;
  totalAssists: number = 0;
  totalGames: number = 0;
  totalHltv: number = 0;

  mapData: ChartData<'radar', number[]> = { labels: [], datasets: [{ data: [] }] };
  winRateData: ChartData<'pie', number[]> = { labels: [], datasets: [{ data: [], backgroundColor: [] }] };
  mapOptions: ChartOptions<'radar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const value = Math.round(context.parsed.r);
            return `${context.dataset.label || ''}: ${value}%`;
          }
        }
      },
      datalabels: {
        display: false
      }
    },
    scales: {
      r: {
        min: 0,
        max: 60,
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
        angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
        pointLabels: { color: 'white', font: { size: 12 } },
        ticks: { display: false }
      }
    },
    layout: { padding: 10 }
  };
  winRateOptions: ChartOptions<'pie'> = {
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

  constructor() {
    effect(() => {
      this.prepareGlobalStatsData();
      this.prepareMapData();
      this.prepareWinRateData();
    });
  }

  private prepareMapData(): void {
    const maps = this.mapsSignal();
    const performance = this.mapPerformanceSignal();
    const labels = maps
      .filter(m => m.name)
      .map(m => m.name.split('_')[1]);
    const data = maps.map(m => {
      const p = performance[m.id];
      return p && p.matches > 0 ? (p.wins / p.matches) * 100 : 0;
    });

    const maxValue = data.length ? Math.min(Math.max(...data) + 10, 100) : 100;

    this.mapData = {
      labels: labels,
      datasets: [{
        data: data
      }]
    };

    this.mapOptions = {
      ...this.mapOptions,
      scales: {
        ...(this.mapOptions.scales || {}),
        ['r']: {
          ...((this.mapOptions.scales?.['r']) || {}),
          max: maxValue
        }
      }
    };
  }

  private prepareWinRateData(): void {
    const performance = this.mapPerformanceSignal();
    let wins = 0, losses = 0, draws = 0;
    for (const p of Object.values(performance)) {
      wins += p.wins;
      losses += p.losses;
      draws += p.draws;
    }

    this.winRateData = {
      labels: ['Win', 'Loss', 'Draw'],
      datasets: [{
        data: [wins, losses, draws],
        backgroundColor: ['#58b64bff', '#FF6384', '#FFCE56']
      }]
    };
  }

  private initializeGlobalStatsData(): void {
    this.totalKills = 0;
    this.totalDeaths = 0;
    this.totalAssists = 0;
    this.totalHltv = 0;
    this.totalDmg = 0;
    this.totalGames = 0;
    this.totalWins = 0;
  }

  private prepareGlobalStatsData(): void {
    this.initializeGlobalStatsData();
    const performance = this.mapPerformanceSignal();
    for (const p of Object.values(performance)) {
      this.totalKills += p.kills;
      this.totalDeaths += p.deaths;
      this.totalAssists += p.assists;
      this.totalHltv += p.hltv;
      this.totalDmg += p.adr;
      this.totalGames += p.matches;
      this.totalWins += p.wins;
    }
  }
}
