import { Component } from '@angular/core';
import { MapPerformance } from './map-performance/map-performance';
import { GlobalStats } from './global-stats/global-stats';
import { TotalEvolution } from './total-evolution/total-evolution';

@Component({
  selector: 'app-stats',
  imports: [MapPerformance, GlobalStats, TotalEvolution],
  templateUrl: './stats.html',
  styleUrl: './stats.scss'
})
export class Stats {
}
