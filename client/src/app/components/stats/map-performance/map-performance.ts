import { Component, Input } from '@angular/core';
import { Map } from '../../../shared/models/map.interface';
import { SharedImports } from '../../../shared/shared-imports';
import { MapPerformanceResponseDto } from '../../../shared/models/map-performance-response-dto';

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
