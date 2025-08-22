import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environment.js';
import { SharedImports } from '../../shared/shared-imports.js';
import { MatchService } from '../../services/match.service.js';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, SharedImports],
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class Settings {
  protected error: string = '';
  protected sheetHeaders: string[] = [];
  protected sheetRows: string[][] = [[]];
  constructor(private matchService: MatchService) { }

  onSubmit(sheetId: string): void {
    const sheetsLink = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:M/?key=${environment.googleSheetsApiKey}`;
    this.matchService.importMatches(sheetsLink).subscribe({
      next: () => console.log('Import successful'),
      error: err => console.error('Import failed', err)
    });
  }
}
