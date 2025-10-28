import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'winRate' })
export class WinRatePipe implements PipeTransform {
    transform(wins: number, games: number): number {
        return (wins / games) * 100;
    }
}
