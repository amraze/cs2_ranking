import { Component, OnInit } from '@angular/core';
import { MapService } from '../../../services/map.service';
import { Map } from '../../../shared/models/map.interface';
import { SharedImports } from '../../../shared/shared-imports';
import { MapPerformanceResponseDto } from '../../../shared/models/map-performance-response-dto';

@Component({
  selector: 'app-map-performance',
  imports: [SharedImports],
  templateUrl: './map-performance.html',
  styleUrl: './map-performance.scss'
})
export class MapPerformance implements OnInit {
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
    })
  }

  getMapPerformance(): void {
    this._mapService.getMapPerformance().subscribe(response => {
      const mapPerformance = response;
      this.mapPerformance = mapPerformance.reduce((acc, performance) => {
        acc[performance.id] = performance;
        return acc;
      }, {} as { [id: string]: MapPerformanceResponseDto });
    })
  }
}
