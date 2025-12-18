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
  fill: boolean | string;
  cumulative: boolean;
  calculator: (stat: EvolutionResponseDto) => number;
  cumulativeCalculator?: (stats: EvolutionResponseDto[]) => number;
}

@Component({
  selector: 'app-evolution',
  imports: [SharedImports, ChartComponent],
  templateUrl: './evolution.html',
  styleUrls: ['./evolution.scss']
})
export class Evolution implements OnInit {
  seasonsSignal = signal<Season[]>([]);
  selectedSeasonSignal = signal<Season | null>(null);
  statsEvolutionSignal = signal<EvolutionResponseDto[]>([]);
  dateRangeDays = signal<number>(1);
  diffDays = signal<number>(0);
  selectedFilter = signal<'all' | 'week' | 'month' | '3months'>('all');

  dateRangeFilters = [
    { label: 'All', value: 'all' as const },
    { label: 'Last 3 Months', value: '3months' as const },
    { label: 'Last Month', value: 'month' as const },
    { label: 'Last Week', value: 'week' as const }
  ];

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
      fill: "+1",
      cumulative: false,
      calculator: (stat) => stat.total > 0 ? stat.adr / stat.total : 0
    },
    hltv: {
      title: 'HLTV Evolution',
      fill: "+1",
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
      const statsEvolution = this.statsEvolutionSignal();
      const selected = this.selectedSeasonSignal();
      const filter = this.selectedFilter();

      let periods: { startDate: Date; endDate: Date; label: string }[] = [];

      if (selected) {
        // single selected season
        periods = [{
          startDate: new Date(selected.startDate),
          endDate: selected.endDate ? new Date(selected.endDate) : new Date(),
          label: `Season ${selected.id}`
        }];
      } else if (this.seasonsSignal().length > 0) {
        const allStartDate = new Date(Math.min(...this.seasonsSignal().map(s => new Date(s.startDate).getTime())));
        const allEndDate = new Date(Math.max(...this.seasonsSignal().map(s => s.endDate ? new Date(s.endDate).getTime() : Date.now())));
        periods = [{ startDate: allStartDate, endDate: allEndDate, label: 'All Seasons' }];
      }

      if (periods.length && statsEvolution.length) {
        const firstDate = statsEvolution[0].matchDate;
        const lastDate = statsEvolution[statsEvolution.length - 1].matchDate;
        const diffMs = new Date(lastDate).getTime() - new Date(firstDate).getTime();
        const calculatedDiffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        this.diffDays.set(calculatedDiffDays);
        const dateRange = this.getDateRangeFromFilter(filter, calculatedDiffDays);
        this.dateRangeDays.set(dateRange);

        const dateRangeDays = this.dateRangeDays();

        this.ranksData = this.prepareChartData('rank', periods, statsEvolution, dateRangeDays);
        this.adrData = this.prepareChartData('adr', periods, statsEvolution, dateRangeDays);
        this.kdData = this.prepareChartData('kd', periods, statsEvolution, dateRangeDays);
        this.hltvData = this.prepareChartData('hltv', periods, statsEvolution, dateRangeDays);
      }
    });
  }

  ngOnInit(): void {
    this._matchService.getStatsEvolution().subscribe(response => {
      this.statsEvolutionSignal.set(response);
    });
  }

  setDateRangeFilter(filter: 'all' | 'week' | 'month' | '3months'): void {
    this.selectedFilter.set(filter);
  }

  private getDateRangeFromFilter(filter: 'all' | 'week' | 'month' | '3months', maxDays: number): number {
    switch (filter) {
      case 'week': return Math.min(7, maxDays);
      case 'month': return Math.min(30, maxDays);
      case '3months': return Math.min(90, maxDays);
      case 'all':
      default: return maxDays;
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

  private prepareChartData(metric: ChartMetric, periods: { startDate: Date; endDate: Date; label: string }[], statsEvolution: EvolutionResponseDto[], dateRangeDays: number): ChartData<'line', (number | null)[]> {
    const config = this.metricConfigs[metric];

    const datasets = periods.map(period => {
      let periodMatches = statsEvolution.filter(stat => {
        const date = new Date(stat.matchDate);
        return date >= period.startDate && date <= period.endDate;
      });

      periodMatches = this.filterByDateRange(periodMatches, dateRangeDays);
      if (periodMatches.length === 0) return { label: period.label, data: [], dates: [], fill: config.fill };

      if (config.cumulative) {
        const matchDates = periodMatches.map(m => new Date(m.matchDate));
        const minDate = new Date(Math.min(...matchDates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...matchDates.map(d => d.getTime())));
        const allDates = this.getDateRange(minDate, maxDate);

        if (config.cumulativeCalculator) {
          const cumulativeCalculator = config.cumulativeCalculator;
          const data = allDates.map(date => {
            const matchesUpToDate = periodMatches.filter(stat => new Date(stat.matchDate) <= date);
            return matchesUpToDate.length ? cumulativeCalculator(matchesUpToDate) : null;
          });
          return { label: period.label, data, dates: allDates, fill: config.fill };
        } else {
          const statsMap = new Map<string, number>();
          periodMatches.forEach(stat => statsMap.set(new Date(stat.matchDate).toDateString(), config.calculator(stat)));
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
    const labels = allDates.map(date => `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })}`);

    const finalDatasets = datasets.map(dataset => {
      if (!dataset.dates.length) return { label: dataset.label, data: new Array(allDates.length).fill(null), fill: config.fill, spanGaps: true };
      const dataMap = new Map(dataset.dates.map((date, idx) => [date.toDateString(), dataset.data[idx]]));
      return { label: dataset.label, data: allDates.map(date => dataMap.get(date.toDateString()) ?? null), fill: config.fill, spanGaps: true };
    });

    if (metric === 'adr') {
      finalDatasets.push({ label: 'Average ADR', data: new Array(allDates.length).fill(90), fill: false, spanGaps: true, borderColor: 'red', borderWidth: 2, pointRadius: 0 } as any);
    } else if (metric === 'hltv') {
      finalDatasets.push({ label: 'Average HLTV', data: new Array(allDates.length).fill(1.0), borderColor: 'red', fill: false, spanGaps: true, borderWidth: 2, pointRadius: 0 } as any);
    }

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
    datasets.forEach(ds => ds.dates?.forEach((date: Date) => dateSet.add(date.toDateString())));
    return Array.from(dateSet).map(str => new Date(str)).sort((a, b) => a.getTime() - b.getTime());
  }

  private createChartOptions(metric: ChartMetric): ChartOptions<'line'> {
    const config = this.metricConfigs[metric];
    return {
      responsive: true,
      aspectRatio: 1.75,
      animation: { duration: 300, easing: 'easeInOutQuad' },
      plugins: { legend: { display: false }, title: { display: true, text: config.title, color: 'white', font: { size: 18 } }, datalabels: { display: false } },
      elements: { point: { radius: 0, hitRadius: 10, hoverRadius: 5, backgroundColor: 'transparent', borderWidth: 0 }, line: { borderWidth: 2, tension: 0.3 } },
      scales: {
        y: { ticks: { color: 'white', count: 5 }, grid: { color: 'rgba(255,255,255,0.2)' }, ...(config.min !== undefined && { min: config.min }), ...(config.max !== undefined && { max: config.max }) },
        x: { ticks: { color: 'white' } }
      }
    };
  }

  rankOptions = this.createChartOptions('rank');
  adrOptions = this.createChartOptions('adr');
  kdOptions = this.createChartOptions('kd');
  hltvOptions = this.createChartOptions('hltv');
}
