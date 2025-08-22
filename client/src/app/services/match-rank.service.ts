import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchRankService {
  private url = 'http://localhost:5130/api/matches';
  constructor(private http: HttpClient) { }
}
