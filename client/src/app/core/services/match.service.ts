import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { EvolutionResponseDto } from '../models/evolution-response-dto';
import { CacheManager } from '../../shared/utils/cache-manager';
import { Match } from '../models/match.interface';
import { environment } from '../../../environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private url = `${environment.apiMainUrl}/matches`;
  private cacheManager = new CacheManager<Match[][]>();
  private statsCacheManager = new CacheManager<EvolutionResponseDto[]>();

  constructor(private http: HttpClient, private tokenService: TokenService) { }

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

  getStatsEvolution(): Observable<EvolutionResponseDto[]> {
    const key = this.statsCacheManager.generateKey({
      entity: 'statsEvolution',
    });
    const cached = this.statsCacheManager.get(key);
    if (cached) return of(cached);

    let params = new HttpParams();

    return this.http.get<EvolutionResponseDto[]>(`${this.url}/evolution`, { params }).pipe(
      tap(data => this.statsCacheManager.set(key, data))
    );
  }

  importSheetMatches(sheetsLink: string): Observable<void> {
    return this.http.post<void>(`${this.url}/import/sheets`, { sheetLink: sheetsLink });
  }

  clearCache(): void {
    this.cacheManager.clear();
  }

  importScopeMatches(): Observable<boolean> {
    return this.http
      .get<void>(`${this.url}/import/scope`, { observe: 'response' })
      .pipe(
        map(response => response.status === 204)
      );
  }
}
