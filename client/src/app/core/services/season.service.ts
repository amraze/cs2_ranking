import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { CacheManager } from '../../shared/utils/cache-manager';
import { Season } from '../models/season.interface';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  private url = `${environment.apiMainUrl}/seasons`;
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
