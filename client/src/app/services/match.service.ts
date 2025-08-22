import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private url = 'http://localhost:5130/api/matches';
  constructor(private http: HttpClient) { }

  importMatches(sheetsLink: string): Observable<void> {
    return this.http.post<void>(`${this.url}/import`, { sheetLink: sheetsLink });
  }
}
