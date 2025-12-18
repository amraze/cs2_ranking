// evolution.component.ts
import { Component, effect, Input, OnInit, signal } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { SharedImports } from '../../../../shared/shared-imports';
import { ChartComponent } from '../../../../shared/components/chart/chart';
import { MatchService } from '../../../../core/services/match.service';
import { Season } from '../../../../core/models/season.interface';
import { EvolutionResponseDto } from '../../../../core/models/evolution-response-dto';

type ChartMetric = 'rank' | 'adr' | 'hltv' | 'kd';

interface MetricConfig {
  title: string;
  min?: number;
  max?: number;
  fill: boolean;
  cumulative: boolean;
  calculator: (stat: EvolutionResponseDto) => number;
  cumulativeCalculator?: (stats: EvolutionResponseDto[]) => number;
}

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

  // Date range controls
  dateRangeDays = signal<number>(30); // Start with 30 days
  minDateRange = 7;
  maxDateRange = 90;

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

  private metricConfigs: Record<ChartMetric, MetricConfig> = {
    rank: {
      title: 'Rank Evolution',
      fill: true,
      cumulative: true,
      calculator: (stat) => stat.rank
    },
    adr: {
      title: 'ADR Evolution',
      fill: false,
      cumulative: false,
      calculator: (stat) => stat.total > 0 ? stat.adr / stat.total : 0
    },
    hltv: {
      title: 'HLTV Evolution',
      fill: false,
      cumulative: false,
      calculator: (stat) => stat.total > 0 ? stat.hltv / stat.total : 0
    },
    kd: {
      title: 'K - D Evolution',
      fill: true,
      cumulative: true,
      calculator: (stat) => stat.kills - stat.deaths,
      cumulativeCalculator: (stats) => {
        const totalKills = stats.reduce((sum, stat) => sum + stat.kills, 0);
        const totalDeaths = stats.reduce((sum, stat) => sum + stat.deaths, 0);
        return totalKills - totalDeaths;
      }
    }
  };

  constructor(private _matchService: MatchService) {
    effect(() => {
      let seasons = this.seasonsSignal();
      const statsEvolution = this.statsEvolutionSignal();
      const selected = this.selectedSeasonSignal();
      const dateRange = this.dateRangeDays();

      if (selected) seasons = [selected];
      else seasons = [seasons[seasons.length - 1]];

      if (seasons.length > 0 && statsEvolution.length > 0) {
        this.ranksData = this.prepareChartData('rank', seasons, statsEvolution, dateRange);
        this.adrData = this.prepareChartData('adr', seasons, statsEvolution, dateRange);
        this.kdData = this.prepareChartData('kd', seasons, statsEvolution, dateRange);
        this.hltvData = this.prepareChartData('hltv', seasons, statsEvolution, dateRange);
      }
    });
  }

  ngOnInit(): void {
    this._matchService.getStatsEvolution().subscribe(response => {
      this.statsEvolutionSignal.set(response);
    });
  }

  increaseDateRange(): void {
    const current = this.dateRangeDays();
    if (current < this.maxDateRange) {
      this.dateRangeDays.set(current + 1);
    }
  }

  decreaseDateRange(): void {
    const current = this.dateRangeDays();
    if (current > this.minDateRange) {
      this.dateRangeDays.set(current - 1);
    }
  }

  private filterByDateRange(statsEvolution: EvolutionResponseDto[], dateRangeDays: number): EvolutionResponseDto[] {
    if (statsEvolution.length === 0) return [];
    const dates = statsEvolution.map(stat => new Date(stat.matchDate).getTime());
    const maxDate = new Date(Math.max(...dates));
    const startDate = new Date(maxDate);
    startDate.setDate(startDate.getDate() - dateRangeDays);
    return statsEvolution.filter(stat => {
      const statDate = new Date(stat.matchDate);
      return statDate >= startDate && statDate <= maxDate;
    });
  }

  private prepareChartData(
    metric: ChartMetric,
    seasons: Season[],
    statsEvolution: EvolutionResponseDto[],
    dateRangeDays: number
  ): ChartData<'line', (number | null)[]> {
    const config = this.metricConfigs[metric];

    const periods = seasons.map(season => ({
      startDate: new Date(season.startDate),
      endDate: season.endDate ? new Date(season.endDate) : new Date(),
      label: `Season ${season.id}`,
    }));

    const datasets = periods.map(period => {
      let periodMatches = statsEvolution.filter(stat => {
        const date = new Date(stat.matchDate);
        return date >= period.startDate && date <= period.endDate;
      });

      // Apply date range filter
      periodMatches = this.filterByDateRange(periodMatches, dateRangeDays);

      if (periodMatches.length === 0) {
        return { label: period.label, data: [], dates: [], fill: config.fill };
      }

      if (config.cumulative) {
        const matchDates = periodMatches.map(m => new Date(m.matchDate));
        const minDate = new Date(Math.min(...matchDates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...matchDates.map(d => d.getTime())));
        const allDates = this.getDateRange(minDate, maxDate);

        if (config.cumulativeCalculator) {
          const cumulativeCalculator = config.cumulativeCalculator;
          const data = allDates.map(date => {
            const matchesUpToDate = periodMatches.filter(stat => {
              const matchDate = new Date(stat.matchDate);
              return matchDate <= date;
            });

            if (matchesUpToDate.length === 0) return null;
            return cumulativeCalculator(matchesUpToDate);
          });

          return { label: period.label, data, dates: allDates, fill: config.fill };
        } else {
          const statsMap = new Map<string, number>();
          periodMatches.forEach(stat => {
            statsMap.set(new Date(stat.matchDate).toDateString(), config.calculator(stat));
          });

          let lastValue: number | null = null;
          const data = allDates.map(date => {
            const value = statsMap.get(date.toDateString());
            if (value !== undefined) lastValue = value;
            return lastValue;
          });

          return { label: period.label, data, dates: allDates, fill: config.fill };
        }
      } else {
        const dates = periodMatches.map(m => new Date(m.matchDate));
        const data = periodMatches.map(stat => config.calculator(stat));

        return { label: period.label, data, dates, fill: config.fill };
      }
    });

    const allDates = this.getAllUniqueDates(datasets);
    const labels = allDates.map(date =>
      `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })}`
    );

    const finalDatasets = datasets.map(dataset => {
      if (!dataset.dates.length) {
        return {
          label: dataset.label,
          data: new Array(allDates.length).fill(null),
          fill: config.fill,
          spanGaps: true,
        };
      }

      const dataMap = new Map(
        dataset.dates.map((date, idx) => [date.toDateString(), dataset.data[idx]])
      );

      return {
        label: dataset.label,
        data: allDates.map(date => dataMap.get(date.toDateString()) ?? null),
        fill: config.fill,
        spanGaps: true,
      };
    });

    return { labels, datasets: finalDatasets };
  }

  private getDateRange(start: Date, end: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  private getAllUniqueDates(datasets: any[]): Date[] {
    const dateSet = new Set<string>();
    datasets.forEach(ds => {
      ds.dates?.forEach((date: Date) => dateSet.add(date.toDateString()));
    });
    return Array.from(dateSet)
      .map(str => new Date(str))
      .sort((a, b) => a.getTime() - b.getTime());
  }

  private createChartOptions(metric: ChartMetric): ChartOptions<'line'> {
    const config = this.metricConfigs[metric];

    return {
      responsive: true,
      aspectRatio: 1.75,
      animation: {
        duration: 300,
        easing: 'easeInOutQuad'
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: config.title,
          color: 'white',
          font: { size: 18 }
        },
        datalabels: { display: false }
      },
      elements: {
        point: {
          radius: 3,
          hitRadius: 10,
          hoverRadius: 5,
          backgroundColor: 'transparent',
          borderWidth: 0
        },
        line: { borderWidth: 2, tension: 0.3 }
      },
      scales: {
        y: {
          ticks: {
            color: 'white',
            count: 5
          },
          grid: { color: 'rgba(255, 255, 255, 0.2)' },
          ...(config.min !== undefined && { min: config.min }),
          ...(config.max !== undefined && { max: config.max })
        },
        x: { ticks: { color: 'white' } }
      }
    };
  }

  rankOptions = this.createChartOptions('rank');
  adrOptions = this.createChartOptions('adr');
  kdOptions = this.createChartOptions('kd');
  hltvOptions = this.createChartOptions('hltv');
}