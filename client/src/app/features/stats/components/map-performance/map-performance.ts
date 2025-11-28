import { Component, Input } from '@angular/core';
import { SharedImports } from '../../../../shared/shared-imports';
import { MapPerformanceResponseDto } from '../../../../core/models/map-performance-response-dto';
import { Map } from '../../../../core/models/map.interface';

@Component({
  selector: 'app-map-performance',
  imports: [SharedImports],
  templateUrl: './map-performance.html',
  styleUrl: './map-performance.scss'
})
export class MapPerformance {
  @Input() maps: Map[] = [];
  @Input() mapPerformance: { [id: string]: MapPerformanceResponseDto } = {};
  constructor() { }
}
