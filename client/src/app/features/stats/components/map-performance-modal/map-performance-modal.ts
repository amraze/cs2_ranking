import { Component, WritableSignal, signal, effect, Input } from '@angular/core';
import { Map } from '../../../../core/models/map.interface';
import { MapPerformanceResponseDto } from '../../../../core/models/map-performance-response-dto';
import { SharedImports } from '../../../../shared/shared-imports';

@Component({
  selector: 'app-map-performance-modal',
  standalone: true,
  imports: [SharedImports],
  templateUrl: './map-performance-modal.html',
  styleUrls: ['./map-performance-modal.scss']
})
export class MapPerformanceModal {
  @Input() map!: WritableSignal<Map | null>;
  @Input() mapPerformance!: WritableSignal<MapPerformanceResponseDto | null>;

  constructor() {
    effect(() => {
      const mapValue = this.map();
      const perfValue = this.mapPerformance();
      if (!mapValue) return;
      console.log('Map changed in modal:', mapValue);
      console.log('MapPerformance changed in modal:', perfValue);
    });
  }

  get perf() {
    return this.mapPerformance() ?? {
      wins: 0,
      losses: 0,
      draws: 0,
      matches: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
      adr: 0,
      hltv: 0,
    };
  }

  get mapValue() {
    return this.map() ?? { name: '', picturePath: '', logoPath: '' };
  }
}
