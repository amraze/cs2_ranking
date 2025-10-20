import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Map } from '../shared/models/map.interface';
import { CacheManager } from '../shared/utils/cache-manager';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private url = 'http://localhost:5130/api/maps';
  private cacheManager = new CacheManager<Map[]>();

  constructor(private http: HttpClient) { }

  getMaps(): Observable<Map[]> {
    const key = this.cacheManager.generateKey({
      entity: 'maps',
    });
    const cached = this.cacheManager.get(key);
    if (cached) return of(cached);

    return this.http.get<Map[]>(this.url).pipe(
      tap(data => this.cacheManager.set(key, data))
    );
  }

}
