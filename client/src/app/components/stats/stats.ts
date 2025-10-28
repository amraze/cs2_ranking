import { Component, OnInit } from '@angular/core';
import { MapPerformance } from './map-performance/map-performance';
import { GlobalStats } from './global-stats/global-stats';
import { TotalEvolution } from './total-evolution/total-evolution';
import { MapService } from '../../services/map.service';
import { MapPerformanceResponseDto } from '../../shared/models/map-performance-response-dto';
import { Map } from '../../shared/models/map.interface';

@Component({
  selector: 'app-stats',
  imports: [MapPerformance, GlobalStats, TotalEvolution],
  templateUrl: './stats.html',
  styleUrl: './stats.scss'
})
export class Stats implements OnInit {
  maps: Map[] = [];
  mapPerformance: { [id: string]: MapPerformanceResponseDto } = {};
  constructor(private _mapService: MapService) { }

  ngOnInit(): void {
    this.getMaps();
    this.getMapPerformance();
  }

  getMaps(): void {
    this._mapService.getMaps().subscribe(response => {
      this.maps = response;
      this.filterMaps();
    })
  }

  getMapPerformance(): void {
    this._mapService.getMapPerformance().subscribe(response => {
      const mapPerformance = response;
      this.mapPerformance = mapPerformance.reduce((acc, performance) => {
        acc[performance.id] = performance;
        return acc;
      }, {} as { [id: string]: MapPerformanceResponseDto });
      this.filterMaps();
    })
  }

  private filterMaps(): void {
    if (!this.maps.length || !Object.keys(this.mapPerformance).length) return;
    this.maps = this.maps.filter(map => !!this.mapPerformance[map.id]);
  }
}
