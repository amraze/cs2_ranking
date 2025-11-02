import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Season } from '../shared/models/season.interface';
import { CacheManager } from '../shared/utils/cache-manager';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  private url = 'http://localhost:5130/api/seasons';
  private cacheManager = new CacheManager<Season[]>();

  constructor(private http: HttpClient) { }

  getSeasons(): Observable<Season[]> {
    const key = this.cacheManager.generateKey({
      entity: 'seasons',
    });
    const cached = this.cacheManager.get(key);
    if (cached) return of(cached);

    return this.http.get<Season[]>(this.url).pipe(
      tap(data => this.cacheManager.set(key, data))
    );
  }
}
