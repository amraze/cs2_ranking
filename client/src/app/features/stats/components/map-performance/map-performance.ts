import { Component, Input, signal, WritableSignal } from '@angular/core';
import { SharedImports } from '../../../../shared/shared-imports';
import { MapPerformanceResponseDto } from '../../../../core/models/map-performance-response-dto';
import { Map } from '../../../../core/models/map.interface';
import { MapPerformanceModal } from "../map-performance-modal/map-performance-modal";

@Component({
  selector: 'app-map-performance',
  imports: [SharedImports, MapPerformanceModal],
  templateUrl: './map-performance.html',
  styleUrls: ['./map-performance.scss']
})
export class MapPerformance {
  @Input() maps: Map[] = [];
  @Input() mapPerformance: { [id: string]: MapPerformanceResponseDto } = {};

  selectedMapSignal: WritableSignal<Map | null> = signal<Map | null>(null);

  private mapPerformanceSignals: { [id: string]: WritableSignal<MapPerformanceResponseDto | null> } = {};

  getMapPerformanceSignal(id: string) {
    if (!this.mapPerformanceSignals[id]) {
      this.mapPerformanceSignals[id] = signal(this.mapPerformance[id] ?? null);
    }
    return this.mapPerformanceSignals[id];
  }

  selectMap(map: Map) {
    this.selectedMapSignal.set(map);
  }

  hasMapPerformanceData(): boolean {
    console.log(Object.keys(this.mapPerformance).length);
    return Object.keys(this.mapPerformance).length > 0;
  }
}
