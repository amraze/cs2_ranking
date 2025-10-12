import { Pipe, PipeTransform } from "@angular/core";
import { Match } from "../models/match.interface";

@Pipe({ name: 'averageAdr' })
export class AverageAdrPipe implements PipeTransform {
    transform(matches: Match[]): number {
        return matches.reduce((sum, e) => sum + e.matchResult.adr, 0) / matches.length;
    }
}
