import { Component, effect, Input, OnInit, signal } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
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
  seasonsSignal = signal<Season[]>([]);
  selectedSeasonSignal = signal<Season | null>(null);
  statsEvolutionSignal = signal<EvolutionResponseDto[]>([]);
  hiddenSeasons = signal<Set<number>>(new Set());
  @Input() set selectedSeason(value: Season | null) {
    this.selectedSeasonSignal.set(value);
  }

  @Input() set seasons(value: Season[]) {
    this.seasonsSignal.set(value || []);
  }

  ranksData: ChartData<'line', (number | null)[]> = { labels: [], datasets: [] };
  adrData: ChartData<'line', (number | null)[]> = { labels: [], datasets: [] };
  hltvData: ChartData<'line', (number | null)[]> = { labels: [], datasets: [] };
  kdData: ChartData<'line', (number | null)[]> = { labels: [], datasets: [] };

  constructor(private _matchService: MatchService) {
    effect(() => {
      let seasons = this.seasonsSignal();
      const statsEvolution = this.statsEvolutionSignal();
      const hidden = this.hiddenSeasons();
      const selected = this.selectedSeasonSignal();
      if (selected) seasons = [selected];

      if (seasons.length > 0 && statsEvolution.length > 0) {
        this.prepareRanksData(seasons, statsEvolution);
        this.prepareAdrData(seasons, statsEvolution);
        this.prepareKdData(seasons, statsEvolution);
        this.prepareHltvData(seasons, statsEvolution);
      }
    });
  }

  ngOnInit(): void {
    this.getStatsEvolution();
  }

  getStatsEvolution(): void {
    this._matchService.getStatsEvolution().subscribe(response => {
      this.statsEvolutionSignal.set(response);
    })
  }

  //----- Prepare Charts section
  private prepareRanksData(seasons: Season[], statsEvolution: EvolutionResponseDto[]): void {
    const hidden = this.hiddenSeasons();

    const allPeriods = seasons.map((season, index) => ({
      originalIndex: index,
      startDate: new Date(season.startDate),
      endDate: new Date(season.endDate),
      label: `Season ${season.id}`,
      isHidden: hidden.has(index)
    }));

    const visiblePeriods = allPeriods.filter(p => !p.isHidden);

    const visibleStats = statsEvolution.filter(stat => {
      const date = new Date(stat.matchDate);
      return visiblePeriods.some(period =>
        date >= period.startDate && date <= period.endDate
      );
    });

    const labels = visibleStats.map(stat => {
      const date = new Date(stat.matchDate);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const datasets = allPeriods.map(period => {
      let data: (number | null)[];

      if (period.isHidden) {
        data = new Array(visibleStats.length).fill(null);
      } else {
        data = visibleStats.map(stat => {
          const date = new Date(stat.matchDate);
          if (date >= period.startDate && date <= period.endDate) {
            return stat.rank;
          }
          return null;
        });
      }

      return {
        label: period.label,
        data: data,
        fill: true,
        spanGaps: false,
        hidden: period.isHidden
      };
    });

    this.ranksData = {
      labels: labels,
      datasets: datasets
    };
  }

  private prepareAdrData(seasons: Season[], statsEvolution: EvolutionResponseDto[]): void {
    const hidden = this.hiddenSeasons();

    const allPeriods = seasons.map((season, index) => ({
      originalIndex: index,
      startDate: new Date(season.startDate),
      endDate: new Date(season.endDate),
      label: `Season ${season.id}`,
      isHidden: hidden.has(index)
    }));

    const visiblePeriods = allPeriods.filter(p => !p.isHidden);

    const visibleStats = statsEvolution.filter(stat => {
      const date = new Date(stat.matchDate);
      return visiblePeriods.some(period =>
        date >= period.startDate && date <= period.endDate
      );
    });

    let cumulativeAdr = 0;
    let cumulativeTotal = 0;

    const statsWithProgressiveAdr = visibleStats.map(stat => {
      cumulativeAdr += stat.adr;
      cumulativeTotal += stat.total;

      return {
        ...stat,
        progressiveAvgAdr: cumulativeTotal > 0 ? cumulativeAdr / cumulativeTotal : 0
      };
    });

    const labels = statsWithProgressiveAdr.map(stat => {
      const date = new Date(stat.matchDate);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const datasets = allPeriods.map(period => {
      let data: (number | null)[];

      if (period.isHidden) {
        data = new Array(statsWithProgressiveAdr.length).fill(null);
      } else {
        data = statsWithProgressiveAdr.map(stat => {
          const date = new Date(stat.matchDate);
          if (date >= period.startDate && date <= period.endDate) {
            return stat.progressiveAvgAdr;
          }
          return null;
        });
      }

      return {
        label: period.label,
        data: data,
        fill: false,
        spanGaps: false,
        hidden: period.isHidden
      };
    });

    this.adrData = {
      labels: labels,
      datasets: datasets
    };
  }

  private prepareHltvData(seasons: Season[], statsEvolution: EvolutionResponseDto[]): void {
    const hidden = this.hiddenSeasons();

    const allPeriods = seasons.map((season, index) => ({
      originalIndex: index,
      startDate: new Date(season.startDate),
      endDate: new Date(season.endDate),
      label: `Season ${season.id}`,
      isHidden: hidden.has(index)
    }));

    const visiblePeriods = allPeriods.filter(p => !p.isHidden);

    const visibleStats = statsEvolution.filter(stat => {
      const date = new Date(stat.matchDate);
      return visiblePeriods.some(period =>
        date >= period.startDate && date <= period.endDate
      );
    });

    let cumulativeHltv = 0;
    let cumulativeTotal = 0;

    const statsWithProgressiveHltv = visibleStats.map(stat => {
      cumulativeHltv += stat.hltv;
      cumulativeTotal += stat.total;

      return {
        ...stat,
        progressiveAvgHltv: cumulativeTotal > 0 ? cumulativeHltv / cumulativeTotal : 0
      };
    });

    const labels = statsWithProgressiveHltv.map(stat => {
      const date = new Date(stat.matchDate);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const datasets = allPeriods.map(period => {
      let data: (number | null)[];

      if (period.isHidden) {
        data = new Array(statsWithProgressiveHltv.length).fill(null);
      } else {
        data = statsWithProgressiveHltv.map(stat => {
          const date = new Date(stat.matchDate);
          if (date >= period.startDate && date <= period.endDate) {
            return stat.progressiveAvgHltv;
          }
          return null;
        });
      }

      return {
        label: period.label,
        data: data,
        fill: false,
        spanGaps: false,
        hidden: period.isHidden
      };
    });

    this.hltvData = {
      labels: labels,
      datasets: datasets
    };
  }

  private prepareKdData(seasons: Season[], statsEvolution: EvolutionResponseDto[]): void {
    const hidden = this.hiddenSeasons();

    const allPeriods = seasons.map((season, index) => ({
      originalIndex: index,
      startDate: new Date(season.startDate),
      endDate: new Date(season.endDate),
      label: `Season ${season.id}`,
      isHidden: hidden.has(index)
    }));

    const visiblePeriods = allPeriods.filter(p => !p.isHidden);

    const visibleStats = statsEvolution.filter(stat => {
      const date = new Date(stat.matchDate);
      return visiblePeriods.some(period =>
        date >= period.startDate && date <= period.endDate
      );
    });

    let cumulativeKills = 0;
    let cumulativeDeaths = 0;

    const statsWithProgressiveKD = visibleStats.map(stat => {
      cumulativeKills += stat.kills;
      cumulativeDeaths += stat.deaths;

      return {
        ...stat,
        progressiveKD: cumulativeDeaths > 0 ? cumulativeKills / cumulativeDeaths : 0
      };
    });

    const labels = statsWithProgressiveKD.map(stat => {
      const date = new Date(stat.matchDate);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const datasets = allPeriods.map(period => {
      let data: (number | null)[];

      if (period.isHidden) {
        data = new Array(statsWithProgressiveKD.length).fill(null);
      } else {
        data = statsWithProgressiveKD.map(stat => {
          const date = new Date(stat.matchDate);
          if (date >= period.startDate && date <= period.endDate) {
            return stat.progressiveKD;
          }
          return null;
        });
      }

      return {
        label: period.label,
        data: data,
        fill: false,
        spanGaps: false,
        hidden: period.isHidden
      };
    });

    this.kdData = {
      labels: labels,
      datasets: datasets
    };
  }

  private getVisibleStatsForTooltip(): EvolutionResponseDto[] {
    const seasons = this.seasonsSignal();
    const statsEvolution = this.statsEvolutionSignal();
    const hidden = this.hiddenSeasons();

    const visiblePeriods = seasons
      .map((season, index) => ({
        startDate: new Date(season.startDate),
        endDate: new Date(season.endDate),
        isHidden: hidden.has(index)
      }))
      .filter(p => !p.isHidden);

    return statsEvolution.filter(stat => {
      const date = new Date(stat.matchDate);
      return visiblePeriods.some(period =>
        date >= period.startDate && date <= period.endDate
      );
    });
  }

  //----- Chart Options section
  baseOptions: ChartOptions<'line'> = {
    responsive: true,
    aspectRatio: 1.75,
    plugins: {
      legend: {
        labels: {
          color: 'white',
          boxWidth: 10,
          boxHeight: 10,
          padding: 10,
          font: {
            size: 12
          }
        },
        onClick: (e, legendItem, legend) => {
          const clickedLabel = legendItem.text;
          const seasonIndex = parseInt(clickedLabel.split(' ')[1]) - 1;
          const hidden = new Set(this.hiddenSeasons());
          if (hidden.has(seasonIndex)) {
            hidden.delete(seasonIndex);
          } else {
            hidden.add(seasonIndex);
          }

          this.hiddenSeasons.set(hidden);
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const visibleStats = this.getVisibleStatsForTooltip();
            if (visibleStats && visibleStats[index]) {
              const date = new Date(visibleStats[index].matchDate);
              const day = date.getDate();
              const month = date.toLocaleString('en-US', { month: 'long' });
              return `${day} ${month}`;
            }
            return tooltipItems[0].label;
          },
        }
      },
      datalabels: {
        display: false
      }
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10
      },
      line: {
        borderWidth: 2,
        tension: 0.3
      }
    },
    scales: {
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.2)' }
      },
      x: {
        ticks: { color: 'white' },
      }
    }
  };

  rankOptions: ChartOptions<'line'> = {
    ...this.baseOptions,
    plugins: {
      ...this.baseOptions.plugins,
      title: {
        display: true,
        text: 'Rank Evolution',
        color: 'white',
        font: {
          size: 18
        }
      }
    },
  };

  adrOptions: ChartOptions<'line'> = {
    ...this.baseOptions,
    plugins: {
      ...this.baseOptions.plugins,
      title: {
        display: true,
        text: 'ADR Evolution',
        color: 'white',
        font: {
          size: 18
        }
      }
    },
    scales: {
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
        min: 70,
        max: 80
      },
      x: {
        ticks: { color: 'white' },
      }
    }
  };

  kdOptions: ChartOptions<'line'> = {
    ...this.baseOptions,
    plugins: {
      ...this.baseOptions.plugins,
      title: {
        display: true,
        text: 'K/D Evolution',
        color: 'white',
        font: {
          size: 18
        }
      }
    },
    scales: {
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
        min: 0.9,
        max: 1.1
      },
      x: {
        ticks: { color: 'white' },
      }
    }
  };

  hltvOptions: ChartOptions<'line'> = {
    ...this.baseOptions,
    plugins: {
      ...this.baseOptions.plugins,
      title: {
        display: true,
        text: 'HLTV Evolution',
        color: 'white',
        font: {
          size: 18
        }
      }
    },
    scales: {
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
        min: 0.9,
        max: 1.2
      },
      x: {
        ticks: { color: 'white' },
      }
    }
  };
}