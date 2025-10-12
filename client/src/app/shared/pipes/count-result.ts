import { Pipe, PipeTransform } from "@angular/core";
import { Match } from "../models/match.interface";

@Pipe({ name: 'countResult' })
export class CountResultPipe implements PipeTransform {
    transform(matches: Match[], resultCode: number): number {
        return matches.filter(e => e.outcome === resultCode).length;
    }
}
