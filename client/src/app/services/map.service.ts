import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Map } from '../shared/models/map.interface';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private url = 'http://localhost:5130/api/maps';
  constructor(private http: HttpClient) { }

  importMaps(sheetsLink: string): Observable<void> {
    return this.http.post<void>(`${this.url}/import`, { sheetLink: sheetsLink });
  }

  getMaps(): Observable<Map[]> {
    return this.http.get<Map[]>(this.url);
  }
}
