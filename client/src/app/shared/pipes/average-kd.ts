import { Pipe, PipeTransform } from "@angular/core";
import { Match } from "../models/match.interface";

@Pipe({ name: 'averageKd' })
export class AverageKdPipe implements PipeTransform {
    transform(matches: Match[]): number {
        const totalKills = matches.reduce((sum, e) => sum + e.matchResult.kills, 0);
        const totalDeaths = matches.reduce((sum, e) => sum + e.matchResult.deaths, 0);

        return totalKills / totalDeaths;
    }
}
