import { Component, OnInit } from '@angular/core';
import { SharedImports } from '../../shared/shared-imports';
import { MatchService } from '../../services/match.service';
import { Match } from '../../shared/models/match.interface';
import { MapService } from '../../services/map.service';
import { RankService } from '../../services/rank.service';
import { Map } from '../../shared/models/map.interface';
import { Rank } from '../../shared/models/rank.interface';
import { EntityCustomizer } from '../../shared/utils/entity-customizer';

@Component({
  selector: 'app-history',
  imports: [SharedImports],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class History implements OnInit {
  private offset = 0;
  private limit = 15;
  protected matches: Match[][] = [];
  protected ranks: { [id: string]: Rank } = {};
  protected maps: { [id: string]: Map } = {};
  protected hasMoreMatches: boolean = true;
  EntityCustomizer = EntityCustomizer;

  constructor(private matchService: MatchService, private mapService: MapService, private rankService: RankService) { }

  ngOnInit(): void {
    this.getRanks();
    this.getMaps();
    this.getMatches();
  }

  getRanks(): void {
    this.rankService.getRanks().subscribe(response => {
      const ranks = response;
      this.ranks = ranks.reduce((acc, rank) => {
        acc[rank.id] = rank;
        return acc;
      }, {} as { [id: string]: Rank });
      console.log(this.ranks);
    })
  }

  getMaps(): void {
    this.mapService.getMaps().subscribe(response => {
      const maps = response;
      this.maps = maps.reduce((acc, map) => {
        acc[map.id] = map;
        return acc;
      }, {} as { [id: string]: Map });

    })
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

  loadNextMatches() {
    if (this.hasMoreMatches) {
      this.offset += 15;
      this.getMatches();
    }
  }

}
