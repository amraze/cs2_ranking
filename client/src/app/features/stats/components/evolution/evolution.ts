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
  rankMin = 1000;
  rankMax = 5000;
  adrMin = 40;
  adrMax = 120;
  hltvMin = 0.4;
  hltvMax = 1.4;
  kdMin = 0.4;
  kdMax = 1.4;

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
      min: this.rankMin,
      max: this.rankMax,
      calculator: (stat) => stat.rank
    },
    adr: {
      title: 'ADR Evolution',
      fill: false,
      cumulative: false,
      min: this.adrMin,
      max: this.adrMax,
      calculator: (stat) => stat.total > 0 ? stat.adr / stat.total : 0
    },
    hltv: {
      title: 'HLTV Evolution',
      fill: false,
      cumulative: false,
      min: this.hltvMin,
      max: this.hltvMax,
      calculator: (stat) => stat.total > 0 ? stat.hltv / stat.total : 0
    },
    kd: {
      title: 'K/D Evolution',
      fill: false,
      cumulative: false,
      min: this.kdMin,
      max: this.kdMax,
      calculator: (stat) => stat.deaths > 0 ? stat.kills / stat.deaths : 0
    }
  };

  constructor(private _matchService: MatchService) {
    effect(() => {
      let seasons = this.seasonsSignal();
      const statsEvolution = this.statsEvolutionSignal();
      const selected = this.selectedSeasonSignal();

      if (selected) seasons = [selected];

      if (seasons.length > 0 && statsEvolution.length > 0) {
        this.ranksData = this.prepareChartData('rank', seasons, statsEvolution);
        this.adrData = this.prepareChartData('adr', seasons, statsEvolution);
        this.kdData = this.prepareChartData('kd', seasons, statsEvolution);
        this.hltvData = this.prepareChartData('hltv', seasons, statsEvolution);
      }
    });
  }

  ngOnInit(): void {
    this._matchService.getStatsEvolution().subscribe(response => {
      this.statsEvolutionSignal.set(response);
    });
  }

  private prepareChartData(metric: ChartMetric, seasons: Season[], statsEvolution: EvolutionResponseDto[]): ChartData<'line', (number | null)[]> {
    const config = this.metricConfigs[metric];

    const periods = seasons.map(season => ({
      startDate: new Date(season.startDate),
      endDate: season.endDate ? new Date(season.endDate) : new Date(),
      label: `Season ${season.id}`,
    }));

    const datasets = periods.map(period => {
      const periodMatches = statsEvolution.filter(stat => {
        const date = new Date(stat.matchDate);
        return date >= period.startDate && date <= period.endDate;
      });

      if (periodMatches.length === 0) {
        return { label: period.label, data: [], dates: [], fill: config.fill };
      }

      if (config.cumulative) {
        const matchDates = periodMatches.map(m => new Date(m.matchDate));
        const minDate = new Date(Math.min(...matchDates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...matchDates.map(d => d.getTime())));
        const allDates = this.getDateRange(minDate, maxDate);

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
      plugins: {
        legend: {
          labels: {
            color: 'white',
            boxWidth: 10,
            boxHeight: 10,
            padding: 10,
            font: { size: 12 }
          },
          onClick: () => { }
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
        point: { radius: 0, hitRadius: 10 },
        line: { borderWidth: 2, tension: 0.3 }
      },
      scales: {
        y: {
          ticks: { color: 'white' },
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