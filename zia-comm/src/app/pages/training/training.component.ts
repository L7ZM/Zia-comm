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

  // Alternative API endpoint
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

    // Try alternative method if regular method fails
    if (this.useAlternativeMethod) {
      this.loadViaAlternativeAPI();
    } else {
      this.loadViaGvizAPI();
    }
  }

  loadViaGvizAPI() {
    // Standard gviz endpoint
    const url = `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/gviz/tq?tqx=out:json`;

    console.log('📡 Using gviz API:', url);

    this.http.get(url, { responseType: 'text' }).subscribe({
      next: (text) => {
        console.log('✅ Response received, length:', text.length);

        try {
          // Check if response is valid
          if (!text || text.trim().length === 0) {
            throw new Error('Empty response from Google Sheets');
          }

          // Handle potential Google Sheets quirks
          let jsonText = text;

          // Remove the google.visualization.Query.setResponse wrapper
          if (text.startsWith('google.visualization.Query.setResponse')) {
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}') + 1;
            if (start !== -1 && end !== 0) {
              jsonText = text.substring(start, end);
            }
          }

          console.log('📋 JSON text to parse:', jsonText.substring(0, 200) + '...');

          const data = JSON.parse(jsonText);

          // CRITICAL FIX: Handle single row case
          this.processGvizData(data);

        } catch (error) {
          console.error('❌ Error with gviz API:', error);
          console.log('🔄 Trying alternative API method...');
          this.useAlternativeMethod = true;
          this.loadViaAlternativeAPI();
        }
      },
      error: (error) => {
        console.error('❌ HTTP Error with gviz:', error);
        this.useAlternativeMethod = true;
        this.loadViaAlternativeAPI();
      }
    });
  }

  private processGvizData(data: any) {
    console.log('🔄 Processing gviz data structure...');
    console.log('Full data structure:', data);

    // Check for different response formats
    if (data.table && data.table.rows) {
      console.log('📊 Found table.rows structure');
      this.extractFromRows(data.table.rows);
    } else if (data.rows) {
      console.log('📊 Found direct rows structure');
      this.extractFromRows(data.rows);
    } else if (data.cols && data.rows) {
      console.log('📊 Found cols/rows structure');
      this.extractFromRows(data.rows);
    } else {
      console.error('❌ Unknown data structure:', Object.keys(data));
      this.errorMessage = 'Unexpected data format from Google Sheets';
      this.loading = false;
    }
  }

  private extractFromRows(rows: any[]) {
    console.log(`📝 Found ${rows.length} row(s) total`);

    if (rows.length === 0) {
      console.log('📭 No rows found in data');
      this.trainings = [];
      this.loading = false;
      return;
    }

    // SPECIAL HANDLING FOR SINGLE ROW
    if (rows.length === 1) {
      console.log('⚠️ Only one row found - checking if it contains data or is header only');

      // Check if this single row is actually data (not header)
      const row = rows[0];
      const cells = row.c || [];

      // If first cell is "id" or similar header, it's probably just the header
      const firstCellValue = cells[0]?.v;
      if (firstCellValue === 'id' || firstCellValue === 'ID' ||
          firstCellValue === 'Id' || typeof firstCellValue === 'string' &&
          firstCellValue.toLowerCase().includes('header')) {
        console.log('📋 Single row appears to be header only');
        this.trainings = [];
      } else {
        console.log('📋 Single row appears to be data');
        this.processSingleRowAsData(row);
      }
      this.loading = false;
      return;
    }

    // MULTIPLE ROWS: Process normally
    const trainingsTemp: any[] = [];

    // Process each row (skip first row if it looks like a header)
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.c || [];

      // Skip header row (row 0 with "id" as first cell)
      if (i === 0 && cells[0]?.v === 'id') {
        console.log('⏭️ Skipping header row');
        continue;
      }

      const training = this.mapRowToTraining(cells, i);

      if (this.isValidTraining(training)) {
        trainingsTemp.push(training);
      }
    }

    this.trainings = trainingsTemp;
    console.log(`🎉 Found ${this.trainings.length} valid training(s)`);
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
      // For debugging
      rawCells: cells.map(c => c?.v)
    };
  }

  private isValidTraining(training: any): boolean {
    if (!training) return false;

    const hasTitle = training.title && training.title.toString().trim() !== '';
    const statusStr = training.status?.toString().toLowerCase().trim() || '';
    const isUpcoming = statusStr === 'upcoming';

    console.log(`🔍 Validating "${training.title}":`, {
      hasTitle,
      status: training.status,
      normalizedStatus: statusStr,
      isUpcoming
    });

    return hasTitle && isUpcoming;
  }

  private getCellValue(cell: any): any {
    if (!cell || cell.v === undefined || cell.v === null) {
      return '';
    }
    return cell.v;
  }

  // ALTERNATIVE METHOD: Use JSON export via sheet name
  loadViaAlternativeAPI() {
    console.log('🔄 Using alternative API method...');

    // Method 1: CSV export (more reliable for small data)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/export?format=csv`;

    this.http.get(csvUrl, { responseType: 'text' }).subscribe({
      next: (csvText) => {
        console.log('✅ CSV data received');
        this.parseCSVData(csvText);
      },
      error: (error) => {
        console.error('❌ CSV method failed:', error);
        this.errorMessage = 'Could not load training data';
        this.loading = false;
      }
    });
  }

  private parseCSVData(csvText: string) {
    console.log('📋 Parsing CSV data...');
    console.log('First 500 chars:', csvText.substring(0, 500));

    const lines = csvText.split('\n');
    console.log(`📊 Found ${lines.length} lines`);

    if (lines.length <= 1) {
      console.log('📭 CSV has only header or is empty');
      this.trainings = [];
      this.loading = false;
      return;
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    console.log('Headers:', headers);

    const trainingsTemp: any[] = [];

    // Parse data rows (skip header)
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines

      const values = this.parseCSVLine(lines[i]);
      console.log(`Row ${i} values:`, values);

      // Map values to training object
      const training: any = {};
      headers.forEach((header, index) => {
        // Map common header names
        const key = this.mapHeaderToKey(header);
        training[key] = values[index] || '';
      });

      console.log('Mapped training:', training);

      if (this.isValidTraining(training)) {
        trainingsTemp.push(training);
      }
    }

    this.trainings = trainingsTemp;
    console.log(`🎉 CSV parsing complete: ${this.trainings.length} training(s) found`);
    this.loading = false;
  }

  private parseCSVLine(line: string): string[] {
    // Simple CSV parsing (for basic cases)
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
    const headerMap: {[key: string]: string} = {
      'id': 'id',
      'title': 'title',
      'description': 'description',
      'date': 'date',
      'city': 'city',
      'duration': 'duration',
      'price': 'price',
      'target': 'target',
      'form_link': 'formLink',
      'formlink': 'formLink',
      'status': 'status'
    };

    return headerMap[header.toLowerCase()] || header;
  }

  // Force reload with specific method
  reloadWithGviz() {
    this.useAlternativeMethod = false;
    this.loadTrainings();
  }

  reloadWithCSV() {
    this.useAlternativeMethod = true;
    this.loadTrainings();
  }
}
