import { Component, OnInit } from '@angular/core';
import { MapPerformance } from './map-performance/map-performance';
import { GlobalStats } from './global-stats/global-stats';
import { Evolution } from './evolution/evolution';
import { MapService } from '../../services/map.service';
import { MapPerformanceResponseDto } from '../../shared/models/map-performance-response-dto';
import { Map } from '../../shared/models/map.interface';
import { SeasonService } from '../../services/season.service';
import { Season } from '../../shared/models/season.interface';
import { SharedImports } from '../../shared/shared-imports';

@Component({
  selector: 'app-stats',
  imports: [MapPerformance, GlobalStats, Evolution, SharedImports],
  templateUrl: './stats.html',
  styleUrl: './stats.scss'
})
export class Stats implements OnInit {
  maps: Map[] = [];
  seasons: Season[] = [];
  mapPerformance: { [id: string]: MapPerformanceResponseDto } = {};
  selectedSeason: Season | undefined;
  constructor(private _mapService: MapService, private _seasonService: SeasonService) { }

  ngOnInit(): void {
    this.getMaps();
    this.getSeasons();
    this.getMapPerformance();
  }

  getMaps(): void {
    this._mapService.getMaps().subscribe(response => {
      this.maps = response;
      this.filterMaps();
    })
  }

  getSeasons(): void {
    this._seasonService.getSeasons().subscribe(response => {
      this.seasons = response;
    })
  }

  getMapPerformance(): void {
    this._mapService.getMapPerformance(this.selectedSeason).subscribe(response => {
      const mapPerformance = response;
      this.mapPerformance = mapPerformance.reduce((acc, performance) => {
        acc[performance.id] = performance;
        return acc;
      }, {} as { [id: string]: MapPerformanceResponseDto });
      this.filterMaps();
    })
  }

  selectSeason(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    if (value) {
      this.handleSeasonChange(value);
    }
  }

  handleSeasonChange(value: string): void {
    this.selectedSeason = this.seasons.find(
      season => season.id === parseInt(value, 10)
    );

    this._mapService.clearMapPerformanceCache();
    this._mapService.clearMapsCache();
    this.mapPerformance = {};
    this.maps = [];
    this.getMaps();
    this.getMapPerformance();
  }

  private filterMaps(): void {
    if (!this.maps.length || !Object.keys(this.mapPerformance).length) return;
    this.maps = this.maps.filter(map => !!this.mapPerformance[map.id]).sort((a, b) => {
      const aCount = this.mapPerformance[a.id]?.matches || 0;
      const bCount = this.mapPerformance[b.id]?.matches || 0;
      return bCount - aCount;
    });
  }
}
