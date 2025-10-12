import { Pipe, PipeTransform } from "@angular/core";
import { Match } from "../models/match.interface";

@Pipe({ name: 'rankDifference' })
export class RankDifferencePipe implements PipeTransform {
    transform(matches: Match[][], matchIndex: number, matchDateIndex: number): string {
        let lastIndex = matchIndex + 1;
        let lastMatchDateIndex = matchDateIndex;

        if (matchIndex === matches[matchDateIndex].length - 1) {
            lastIndex = 0;
            lastMatchDateIndex++;
        }

        if (lastMatchDateIndex === matches.length) return '0';

        const lastMatchScore = matches[lastMatchDateIndex][lastIndex]?.matchRank?.rankScore;
        const currentMatchScore = matches[matchDateIndex][matchIndex]?.matchRank?.rankScore;

        if (currentMatchScore != null && lastMatchScore != null) {
            const diff = currentMatchScore - lastMatchScore;
            return diff > 0 ? `+${diff}` : diff.toString();
        }

        return '';
    }
}
