import { Component, OnInit } from '@angular/core';
import { SharedImports } from '../../shared/shared-imports';
import { MatchService } from '../../services/match.service';
import { Match } from '../../shared/models/match.interface';

@Component({
  selector: 'app-history',
  imports: [SharedImports],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class History implements OnInit {
  private offset = 0;
  private limit = 20;
  protected matches: Match[][] = [];
  protected hasMoreMatches: boolean = true;

  constructor(private matchService: MatchService) { }

  ngOnInit(): void {
    this.getMatches()
  }

  getMatches(): void {
    this.matchService.getMatches(this.limit, this.offset).subscribe(response => {
      if (this.offset === 0) {
        this.matches = response;
      } else {
        this.matches = [...this.matches, ...response];
      }
      if (response.length == 0) this.hasMoreMatches = false;
    })
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;

    const atBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 1;

    if (atBottom && this.hasMoreMatches) {
      this.offset += 20;
      this.getMatches();
    }
  }

}
