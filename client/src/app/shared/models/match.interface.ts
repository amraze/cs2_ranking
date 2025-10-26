import { MatchRank } from "./match-rank.interface";
import { MatchResult } from "./match-result.interface";

export interface Match {
    id: number;
    outcome: number;
    score: string;
    gamemode: string;
    mapId: number;
    seasonId: number;
    datetime: Date;
    matchRank: MatchRank;
    matchResult: MatchResult;
}
