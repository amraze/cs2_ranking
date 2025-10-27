import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Map } from '../shared/models/map.interface';
import { CacheManager } from '../shared/utils/cache-manager';
import { MapPerformanceResponseDto } from '../shared/models/map-performance-response-dto';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private url = 'http://localhost:5130/api/maps';
  private mapCache = new CacheManager<Map[]>();
  private mapPerformanceCache = new CacheManager<MapPerformanceResponseDto[]>();

  constructor(private http: HttpClient) { }

  getMaps(): Observable<Map[]> {
    const key = this.mapCache.generateKey({
      entity: 'maps',
    });
    const cached = this.mapCache.get(key);
    if (cached) return of(cached);

    return this.http.get<Map[]>(this.url).pipe(
      tap(data => this.mapCache.set(key, data))
    );
  }

  getMapPerformance(): Observable<MapPerformanceResponseDto[]> {
    const key = this.mapPerformanceCache.generateKey({
      entity: 'mapPerformance',
    });
    const cached = this.mapPerformanceCache.get(key);
    if (cached) return of(cached);

    return this.http.get<MapPerformanceResponseDto[]>(`${this.url}/performances`).pipe(
      tap(data => this.mapPerformanceCache.set(key, data))
    );
  }
}
