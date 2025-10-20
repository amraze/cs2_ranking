import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Match } from '../shared/models/match.interface';
import { CacheManager } from '../shared/utils/cache-manager';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private url = 'http://localhost:5130/api/matches';
  private cacheManager = new CacheManager<Match[][]>();

  constructor(private http: HttpClient) { }

  getMatches(limit: number, offset: number): Observable<Match[][]> {
    const key = this.cacheManager.generateKey({
      entity: 'matches',
      params: { limit: limit, offset: offset }
    });
    const cached = this.cacheManager.get(key);
    if (cached) return of(cached);

    return this.http.get<Match[][]>(`${this.url}?limit=${limit}&offset=${offset}`).pipe(
      tap(data => this.cacheManager.set(key, data))
    );
  }

  importMatches(sheetsLink: string): Observable<void> {
    return this.http.post<void>(`${this.url}/import`, { sheetLink: sheetsLink });
  }
}
