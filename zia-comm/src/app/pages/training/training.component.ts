import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-training',
  standalone: true,
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
  imports: [CommonModule, HttpClientModule, TranslateModule],
})
export class TrainingComponent implements OnInit {
  currentLang: string = 'fr';
  trainings: any[] = [];
  loading = true;
  errorMessage: string = '';

  private SHEET_ID = '1_V6fIDSKqmttTooXhTid-jMyN_lre3Os5n8LoqfQsbY';
  private useAlternativeMethod = false;

  constructor(private http: HttpClient, private translate: TranslateService) {
    this.currentLang = this.translate.currentLang || 'fr';
    this.translate.onLangChange.subscribe((e) => {
      this.currentLang = e.lang;
    });
  }

  ngOnInit() {
    this.loadTrainings();
  }

  loadTrainings() {
    this.loading = true;
    this.errorMessage = '';
    this.trainings = [];

    if (this.useAlternativeMethod) {
      this.loadViaAlternativeAPI();
    } else {
      this.loadViaGvizAPI();
    }
  }

  loadViaGvizAPI() {
    const url = `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/gviz/tq?tqx=out:json`;

    this.http.get(url, { responseType: 'text' }).subscribe({
      next: (text) => {
        try {
          if (!text || text.trim().length === 0) {
            throw new Error('Empty response from Google Sheets');
          }

          let jsonText = text;

          const start = text.indexOf('{');
          const end = text.lastIndexOf('}') + 1;
          if (start !== -1 && end > start) {
            jsonText = text.substring(start, end);
          }

          const data = JSON.parse(jsonText);
          this.processGvizData(data);

        } catch (error) {
          this.useAlternativeMethod = true;
          this.loadViaAlternativeAPI();
        }
      },
      error: () => {
        this.useAlternativeMethod = true;
        this.loadViaAlternativeAPI();
      }
    });
  }

  private processGvizData(data: any) {
    if (data.table && data.table.rows) {
      this.extractFromRows(data.table.rows);
    } else if (data.rows) {
      this.extractFromRows(data.rows);
    } else if (data.cols && data.rows) {
      this.extractFromRows(data.rows);
    } else {
      this.errorMessage = 'Unexpected data format from Google Sheets';
      this.loading = false;
    }
  }

  private extractFromRows(rows: any[]) {
    if (rows.length === 0) {
      this.trainings = [];
      this.loading = false;
      return;
    }

    if (rows.length === 1) {
      const row = rows[0];
      const cells = row.c || [];
      const firstCellValue = cells[0]?.v;

      if (
        firstCellValue === 'id' ||
        firstCellValue === 'ID' ||
        firstCellValue === 'Id' ||
        (typeof firstCellValue === 'string' &&
          firstCellValue.toLowerCase().includes('header'))
      ) {
        this.trainings = [];
      } else {
        this.processSingleRowAsData(row);
      }
      this.loading = false;
      return;
    }

    const trainingsTemp: any[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.c || [];

      if (i === 0 && cells[0]?.v === 'id') {
        continue;
      }

      const training = this.mapRowToTraining(cells, i);

      if (this.isValidTraining(training)) {
        trainingsTemp.push(training);
      }
    }

    this.trainings = trainingsTemp;
    this.loading = false;
  }

  private processSingleRowAsData(row: any) {
    const cells = row.c || [];
    const training = this.mapRowToTraining(cells, 0);

    if (this.isValidTraining(training)) {
      this.trainings = [training];
    } else {
      this.trainings = [];
    }
  }

  private mapRowToTraining(cells: any[], rowIndex: number): any {
    return {
      id: this.getCellValue(cells[0]) || rowIndex + 1,
      title: this.getCellValue(cells[1]),
      description: this.getCellValue(cells[2]),
      date: this.getCellValue(cells[3]),
      city: this.getCellValue(cells[4]),
      duration: this.getCellValue(cells[5]),
      price: this.getCellValue(cells[6]),
      target: this.getCellValue(cells[7]),
      formLink: this.getCellValue(cells[8]),
      status: this.getCellValue(cells[9]),
    };
  }

  private isValidTraining(training: any): boolean {
    if (!training) return false;

    const hasTitle =
      training.title && training.title.toString().trim() !== '';
    const statusStr =
      training.status?.toString().toLowerCase().trim() || '';
    const isUpcoming = statusStr === 'upcoming';

    return hasTitle && isUpcoming;
  }

  private getCellValue(cell: any): any {
    if (!cell || cell.v === undefined || cell.v === null) {
      return '';
    }
    return cell.v;
  }

  loadViaAlternativeAPI() {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/export?format=csv`;

    this.http.get(csvUrl, { responseType: 'text' }).subscribe({
      next: (csvText) => {
        this.parseCSVData(csvText);
      },
      error: () => {
        this.errorMessage = 'Could not load training data';
        this.loading = false;
      }
    });
  }

  private parseCSVData(csvText: string) {
    const lines = csvText.split('\n');

    if (lines.length <= 1) {
      this.trainings = [];
      this.loading = false;
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const trainingsTemp: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = this.parseCSVLine(lines[i]);

      const training: any = {};
      headers.forEach((header, index) => {
        const key = this.mapHeaderToKey(header);
        training[key] = values[index] || '';
      });

      if (this.isValidTraining(training)) {
        trainingsTemp.push(training);
      }
    }

    this.trainings = trainingsTemp;
    this.loading = false;
  }

  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result.map(val => val.replace(/^"|"$/g, ''));
  }

  private mapHeaderToKey(header: string): string {
    const headerMap: { [key: string]: string } = {
      id: 'id',
      title: 'title',
      description: 'description',
      date: 'date',
      city: 'city',
      duration: 'duration',
      price: 'price',
      target: 'target',
      form_link: 'formLink',
      formlink: 'formLink',
      status: 'status',
    };

    return headerMap[header.toLowerCase()] || header;
  }

  reloadWithGviz() {
    this.useAlternativeMethod = false;
    this.loadTrainings();
  }

  reloadWithCSV() {
    this.useAlternativeMethod = true;
    this.loadTrainings();
  }
}
