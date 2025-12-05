import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Export data to Excel
 *
 * @param {Array} columns - array of column definitions [{ Header, accessor }]
 * @param {Array} data - array of row objects
 * @param {String} fileName - name of exported file
 */
export const exportToExcel = (columns, data, fileName = "data_export") => {
  // ---- Prepare Excel Header ----
  const headers = columns.map((col) => col.Header);

  // ---- Prepare Excel Rows ----
  const rows = data.map((row) => columns.map((col) => row[col.accessor]));

  // ---- Build Worksheet ----
  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Auto column width
  worksheet["!cols"] = columns.map(() => ({ wch: 20 }));

  // ---- Build Workbook ----
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // ---- Export File ----
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${fileName}.xlsx`);
};
