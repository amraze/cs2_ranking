import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Map } from '../shared/models/map.interface';
import { CacheManager } from '../shared/utils/cache-manager';
import { MapPerformanceResponseDto } from '../shared/models/map-performance-response-dto';
import { Season } from '../shared/models/season.interface';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private url = 'http://localhost:5130/api/maps';
  private mapCache = new CacheManager<Map[]>();
  private mapPerformanceCache = new CacheManager<MapPerformanceResponseDto[]>();

  constructor(private http: HttpClient) { }
  private keyName: string = "maps";
  private keyName2: string = "performances";

  getMaps(): Observable<Map[]> {
    const key = this.mapCache.generateKey({
      entity: this.keyName,
    });
    const cached = this.mapCache.get(key);
    if (cached) return of(cached);

    return this.http.get<Map[]>(this.url).pipe(
      tap(data => this.mapCache.set(key, data))
    );
  }

  getMapPerformance(season: Season | undefined): Observable<MapPerformanceResponseDto[]> {
    const key = this.mapPerformanceCache.generateKey({
      entity: this.keyName2,
    });
    const cached = this.mapPerformanceCache.get(key);
    if (cached) return of(cached);

    let params = new HttpParams();
    if (season?.startDate) params = params.set('start', new Date(season.startDate).toISOString());
    if (season?.endDate) params = params.set('end', new Date(season.endDate).toISOString());

    return this.http.get<MapPerformanceResponseDto[]>(`${this.url}/performances`, { params }).pipe(
      tap(data => this.mapPerformanceCache.set(key, data))
    );
  }

  clearMapPerformanceCache(): void {
    this.mapPerformanceCache.delete(this.keyName2);
  }

  clearMapsCache(): void {
    this.mapCache.delete(this.keyName);
  }
}
