import { CommonModule } from '@angular/common';
import { CountResultPipe } from './pipes/count-result';
import { AverageKdPipe } from './pipes/average-kd';
import { AverageAdrPipe } from './pipes/average-adr';
import { RankDifferencePipe } from './pipes/rank-difference';
import { WinRatePipe } from './pipes/win-rate';

export const SharedImports = [
    CommonModule,
    CountResultPipe,
    AverageKdPipe,
    AverageAdrPipe,
    RankDifferencePipe,
    WinRatePipe,
];