import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rank } from '../shared/models/rank.interface';

@Injectable({
  providedIn: 'root'
})
export class RankService {
  private url = 'http://localhost:5130/api/ranks';
  constructor(private http: HttpClient) { }

  getRanks(): Observable<Rank[]> {
    return this.http.get<Rank[]>(this.url);
  }
}
