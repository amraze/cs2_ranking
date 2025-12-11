import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { CacheManager } from '../../shared/utils/cache-manager';
import { Rank } from '../models/rank.interface';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class RankService {
  private url = `${environment.apiMainUrl}/ranks`;
  private cacheManager = new CacheManager<Rank[]>();

  constructor(private http: HttpClient) { }

  getRanks(): Observable<Rank[]> {
    const key = this.cacheManager.generateKey({
      entity: 'ranks',
    });
    const cached = this.cacheManager.get(key);
    if (cached) return of(cached);

    return this.http.get<Rank[]>(this.url).pipe(
      tap(data => this.cacheManager.set(key, data))
    );
  }
}
