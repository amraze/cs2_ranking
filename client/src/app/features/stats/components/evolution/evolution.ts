import { Component, effect, Input, OnInit, signal } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { SharedImports } from '../../../../shared/shared-imports';
import { ChartComponent } from '../../../../shared/components/chart/chart';
import { MatchService } from '../../../../core/services/match.service';
import { Season } from '../../../../core/models/season.interface';
import { EvolutionResponseDto } from '../../../../core/models/evolution-response-dto';

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

  private getAllDatesBetween(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  private prepareRanksData(seasons: Season[], statsEvolution: EvolutionResponseDto[]): void {
    const allPeriods = seasons.map((season, index) => ({
      originalIndex: index,
      startDate: new Date(season.startDate),
      endDate: new Date(season.endDate),
      label: `Season ${season.id}`,
    }));

    const statsMap = new Map<string, EvolutionResponseDto>();
    statsEvolution.forEach(stat => {
      const dateKey = new Date(stat.matchDate).toDateString();
      statsMap.set(dateKey, stat);
    });

    const datasets = allPeriods.map(period => {

      const periodMatches = statsEvolution.filter(stat => {
        const date = new Date(stat.matchDate);
        return date >= period.startDate && date <= period.endDate;
      });

      if (periodMatches.length === 0) {
        return {
          label: period.label,
          data: [],
          fill: true,
          spanGaps: true,
          hidden: false
        };
      }

      const matchDates = periodMatches.map(m => new Date(m.matchDate));
      const minDate = new Date(Math.min(...matchDates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...matchDates.map(d => d.getTime())));

      const periodDates = this.getAllDatesBetween(minDate, maxDate);

      let lastValue: number | null = null;
      const data = periodDates.map(date => {
        const dateKey = date.toDateString();
        const stat = statsMap.get(dateKey);

        if (stat) {
          lastValue = stat.rank;
          return lastValue;
        } else {
          return lastValue;
        }
      });

      return {
        label: period.label,
        data: data,
        dates: periodDates,
        fill: true,
        spanGaps: true,
        hidden: false
      };
    });

    const allDatesSet = new Set<string>();
    datasets.forEach((dataset: any) => {
      if (!dataset.hidden && dataset.dates) {
        dataset.dates.forEach((date: Date) => allDatesSet.add(date.toDateString()));
      }
    });

    const allDates = Array.from(allDatesSet)
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => a.getTime() - b.getTime());

    const labels = allDates.map(date => {
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'short' });
      return `${day} ${month}`;
    });

    const finalDatasets = datasets.map((dataset: any) => {
      if (dataset.hidden || !dataset.dates) {
        return {
          label: dataset.label,
          data: new Array(allDates.length).fill(null),
          fill: true,
          spanGaps: true,
          hidden: dataset.hidden
        };
      }

      const periodDataMap = new Map<string, number | null>();
      dataset.dates.forEach((date: Date, idx: number) => {
        periodDataMap.set(date.toDateString(), dataset.data[idx]);
      });

      const alignedData = allDates.map(date => {
        return periodDataMap.get(date.toDateString()) ?? null;
      });

      return {
        label: dataset.label,
        data: alignedData,
        fill: true,
        spanGaps: true,
        hidden: false
      };
    });

    this.ranksData = {
      labels: labels,
      datasets: finalDatasets
    };
  }

  private prepareAdrData(seasons: Season[], statsEvolution: EvolutionResponseDto[]): void {
    const allPeriods = seasons.map((season, index) => ({
      originalIndex: index,
      startDate: new Date(season.startDate),
      endDate: new Date(season.endDate),
      label: `Season ${season.id}`,
    }));

    let cumulativeAdr = 0;
    let cumulativeTotal = 0;

    const statsMap = new Map<string, number>();
    statsEvolution.forEach(stat => {
      cumulativeAdr += stat.adr;
      cumulativeTotal += stat.total;
      const progressiveAvgAdr = cumulativeTotal > 0 ? cumulativeAdr / cumulativeTotal : 0;
      const dateKey = new Date(stat.matchDate).toDateString();
      statsMap.set(dateKey, progressiveAvgAdr);
    });

    const datasets = allPeriods.map(period => {

      const periodMatches = statsEvolution.filter(stat => {
        const date = new Date(stat.matchDate);
        return date >= period.startDate && date <= period.endDate;
      });

      if (periodMatches.length === 0) {
        return {
          label: period.label,
          data: [],
          fill: false,
          spanGaps: true,
          hidden: false
        };
      }

      const matchDates = periodMatches.map(m => new Date(m.matchDate));
      const minDate = new Date(Math.min(...matchDates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...matchDates.map(d => d.getTime())));

      const periodDates = this.getAllDatesBetween(minDate, maxDate);

      let lastValue: number | null = null;
      const data = periodDates.map(date => {
        const dateKey = date.toDateString();
        const value = statsMap.get(dateKey);

        if (value !== undefined) {
          lastValue = value;
          return lastValue;
        } else {
          return lastValue;
        }
      });

      return {
        label: period.label,
        data: data,
        dates: periodDates,
        fill: false,
        spanGaps: true,
        hidden: false
      };
    });

    const allDatesSet = new Set<string>();
    datasets.forEach((dataset: any) => {
      if (!dataset.hidden && dataset.dates) {
        dataset.dates.forEach((date: Date) => allDatesSet.add(date.toDateString()));
      }
    });

    const allDates = Array.from(allDatesSet)
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => a.getTime() - b.getTime());

    const labels = allDates.map(date => {
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'short' });
      return `${day} ${month}`;
    });

    const finalDatasets = datasets.map((dataset: any) => {
      if (dataset.hidden || !dataset.dates) {
        return {
          label: dataset.label,
          data: new Array(allDates.length).fill(null),
          fill: false,
          spanGaps: true,
          hidden: dataset.hidden
        };
      }

      const periodDataMap = new Map<string, number | null>();
      dataset.dates.forEach((date: Date, idx: number) => {
        periodDataMap.set(date.toDateString(), dataset.data[idx]);
      });

      const alignedData = allDates.map(date => {
        return periodDataMap.get(date.toDateString()) ?? null;
      });

      return {
        label: dataset.label,
        data: alignedData,
        fill: false,
        spanGaps: true,
        hidden: false
      };
    });

    this.adrData = {
      labels: labels,
      datasets: finalDatasets
    };
  }

  private prepareHltvData(seasons: Season[], statsEvolution: EvolutionResponseDto[]): void {
    const allPeriods = seasons.map((season, index) => ({
      originalIndex: index,
      startDate: new Date(season.startDate),
      endDate: new Date(season.endDate),
      label: `Season ${season.id}`,
    }));

    let cumulativeHltv = 0;
    let cumulativeTotal = 0;

    const statsMap = new Map<string, number>();
    statsEvolution.forEach(stat => {
      cumulativeHltv += stat.hltv;
      cumulativeTotal += stat.total;
      const progressiveAvgHltv = cumulativeTotal > 0 ? cumulativeHltv / cumulativeTotal : 0;
      const dateKey = new Date(stat.matchDate).toDateString();
      statsMap.set(dateKey, progressiveAvgHltv);
    });

    const datasets = allPeriods.map(period => {

      const periodMatches = statsEvolution.filter(stat => {
        const date = new Date(stat.matchDate);
        return date >= period.startDate && date <= period.endDate;
      });

      if (periodMatches.length === 0) {
        return {
          label: period.label,
          data: [],
          fill: false,
          spanGaps: true,
          hidden: false
        };
      }

      const matchDates = periodMatches.map(m => new Date(m.matchDate));
      const minDate = new Date(Math.min(...matchDates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...matchDates.map(d => d.getTime())));

      const periodDates = this.getAllDatesBetween(minDate, maxDate);

      let lastValue: number | null = null;
      const data = periodDates.map(date => {
        const dateKey = date.toDateString();
        const value = statsMap.get(dateKey);

        if (value !== undefined) {
          lastValue = value;
          return lastValue;
        } else {
          return lastValue;
        }
      });

      return {
        label: period.label,
        data: data,
        dates: periodDates,
        fill: false,
        spanGaps: true,
        hidden: false
      };
    });

    const allDatesSet = new Set<string>();
    datasets.forEach((dataset: any) => {
      if (!dataset.hidden && dataset.dates) {
        dataset.dates.forEach((date: Date) => allDatesSet.add(date.toDateString()));
      }
    });

    const allDates = Array.from(allDatesSet)
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => a.getTime() - b.getTime());

    const labels = allDates.map(date => {
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'short' });
      return `${day} ${month}`;
    });

    const finalDatasets = datasets.map((dataset: any) => {
      if (dataset.hidden || !dataset.dates) {
        return {
          label: dataset.label,
          data: new Array(allDates.length).fill(null),
          fill: false,
          spanGaps: true,
          hidden: dataset.hidden
        };
      }

      const periodDataMap = new Map<string, number | null>();
      dataset.dates.forEach((date: Date, idx: number) => {
        periodDataMap.set(date.toDateString(), dataset.data[idx]);
      });

      const alignedData = allDates.map(date => {
        return periodDataMap.get(date.toDateString()) ?? null;
      });

      return {
        label: dataset.label,
        data: alignedData,
        fill: false,
        spanGaps: true,
        hidden: false
      };
    });

    this.hltvData = {
      labels: labels,
      datasets: finalDatasets
    };
  }

  private prepareKdData(seasons: Season[], statsEvolution: EvolutionResponseDto[]): void {
    const allPeriods = seasons.map((season, index) => ({
      originalIndex: index,
      startDate: new Date(season.startDate),
      endDate: new Date(season.endDate),
      label: `Season ${season.id}`,
    }));

    let cumulativeKills = 0;
    let cumulativeDeaths = 0;

    const statsMap = new Map<string, number>();
    statsEvolution.forEach(stat => {
      cumulativeKills += stat.kills;
      cumulativeDeaths += stat.deaths;
      const progressiveKD = cumulativeDeaths > 0 ? cumulativeKills / cumulativeDeaths : 0;
      const dateKey = new Date(stat.matchDate).toDateString();
      statsMap.set(dateKey, progressiveKD);
    });

    const datasets = allPeriods.map(period => {

      const periodMatches = statsEvolution.filter(stat => {
        const date = new Date(stat.matchDate);
        return date >= period.startDate && date <= period.endDate;
      });

      if (periodMatches.length === 0) {
        return {
          label: period.label,
          data: [],
          fill: false,
          spanGaps: true,
          hidden: false
        };
      }

      const matchDates = periodMatches.map(m => new Date(m.matchDate));
      const minDate = new Date(Math.min(...matchDates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...matchDates.map(d => d.getTime())));

      const periodDates = this.getAllDatesBetween(minDate, maxDate);

      let lastValue: number | null = null;
      const data = periodDates.map(date => {
        const dateKey = date.toDateString();
        const value = statsMap.get(dateKey);

        if (value !== undefined) {
          lastValue = value;
          return lastValue;
        } else {
          return lastValue;
        }
      });

      return {
        label: period.label,
        data: data,
        dates: periodDates,
        fill: false,
        spanGaps: true,
        hidden: false
      };
    });

    const allDatesSet = new Set<string>();
    datasets.forEach((dataset: any) => {
      if (!dataset.hidden && dataset.dates) {
        dataset.dates.forEach((date: Date) => allDatesSet.add(date.toDateString()));
      }
    });

    const allDates = Array.from(allDatesSet)
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => a.getTime() - b.getTime());

    const labels = allDates.map(date => {
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'short' });
      return `${day} ${month}`;
    });

    const finalDatasets = datasets.map((dataset: any) => {
      if (dataset.hidden || !dataset.dates) {
        return {
          label: dataset.label,
          data: new Array(allDates.length).fill(null),
          fill: false,
          spanGaps: true,
          hidden: dataset.hidden
        };
      }

      const periodDataMap = new Map<string, number | null>();
      dataset.dates.forEach((date: Date, idx: number) => {
        periodDataMap.set(date.toDateString(), dataset.data[idx]);
      });

      const alignedData = allDates.map(date => {
        return periodDataMap.get(date.toDateString()) ?? null;
      });

      return {
        label: dataset.label,
        data: alignedData,
        fill: false,
        spanGaps: true,
        hidden: false
      };
    });

    this.kdData = {
      labels: labels,
      datasets: finalDatasets
    };
  }

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
        onClick: () => { return }
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