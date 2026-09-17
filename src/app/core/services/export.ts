import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type ExportValue = string | number;
type ExportRow = Record<string, ExportValue>;

const LOGO_URL = '/static/images/icea-lion-logo.png';
const LOGO_ASPECT = 450 / 326;

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private logoDataUrl: Promise<string | null> | null = null;

  exportToExcel(
    data: ExportRow[],
    fileName: string
  ): void {

    const worksheet =
      XLSX.utils.json_to_sheet(data);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Transactions'
    );

    XLSX.writeFile(
      workbook,
      `${fileName}.xlsx`
    );

  }


  async exportToPdf(
    data: ExportRow[],
    columns: string[],
    fileName: string,
    title: string
  ): Promise<void> {

    const doc = new jsPDF({
      orientation: 'landscape'
    });

    const logo = await this.loadLogo();

    const logoHeight = 16;
    const logoWidth = logoHeight * LOGO_ASPECT;
    const textX = logo ? 14 + logoWidth + 6 : 14;

    if (logo) {
      doc.addImage(logo, 'PNG', 14, 8, logoWidth, logoHeight);
    }

    doc.setTextColor('#0d1a63');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');

    doc.text(
      'ICEA PAY',
      textX,
      15
    );

    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#000000');
    doc.setFontSize(12);

    doc.text(
      title,
      textX,
      22
    );


    doc.setFontSize(9);
    doc.setTextColor('#555555');

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      textX,
      28
    );

    doc.setTextColor('#000000');


    const headers = [
      columns.map(column =>
        this.formatHeader(column)
      )
    ];

    const rows = data.map(row =>

      columns.map(column =>
        this.formatValue(row[column])
      )

    );


    autoTable(doc, {

      head: headers,

      body: rows,

      startY: 34,

      styles: {
        fontSize: 8
      },

      headStyles: {
        fontStyle: 'bold'
      },

      margin: {
        left: 14,
        right: 14
      }

    });


    doc.save(
      `${fileName}.pdf`
    );

  }


  private loadLogo(): Promise<string | null> {

    if (!this.logoDataUrl) {

      this.logoDataUrl = fetch(LOGO_URL)
        .then(response => response.blob())
        .then(blob => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }))
        .catch(() => null);

    }

    return this.logoDataUrl;

  }


  private formatHeader(
    column: string
  ): string {

    return column
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, char =>
        char.toUpperCase()
      );

  }


  private formatValue(
    value: ExportValue
  ): string {

    if (
      value === null ||
      value === undefined
    ) {

      return '';

    }

    if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) {
      return new Date(value).toLocaleDateString();
    }

    return String(value);

  }

}