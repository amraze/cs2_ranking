import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { SharedImports } from '../../../shared/shared-imports';
import { ChartComponent } from '../../../shared/components/chart/chart';
import { MatchService } from '../../../services/match.service';
import { Season } from '../../../shared/models/season.interface';
import { EvolutionResponseDto } from '../../../shared/models/evolution-response-dto';

@Component({
  selector: 'app-evolution',
  imports: [SharedImports, ChartComponent],
  templateUrl: './evolution.html',
  styleUrl: './evolution.scss'
})
export class Evolution implements OnInit {
  @Input() season: Season | null = null;
  private statsEvolution: EvolutionResponseDto[] = [];
  constructor(private _matchService: MatchService) { }

  ngOnInit(): void {
    this.getStatsEvolution();
  }

  getStatsEvolution(): void {
    this._matchService.getStatsEvolution(this.season).subscribe(response => {
      this.statsEvolution = response;
    })
  }
  mapData: ChartData<ChartType> = {
    labels: ["W1", "W2", "W3"],
    datasets: [{
      data: [30, 40, 75],
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
