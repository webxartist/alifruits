import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Excel Export
export const exportExcelReport = (stats) => {
  const data = [
    {
      Users: stats.users,
      Products: stats.products,
      Orders: stats.orders,
      TotalSales: stats.totalSales,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  XLSX.writeFile(workbook, "sales_report.xlsx");
};

// PDF Export
export const exportPDFReport = (stats) => {
  const doc = new jsPDF();

  doc.text("WebXShop Sales Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [["Users", "Products", "Orders", "Total Sales"]],
    body: [[stats.users, stats.products, stats.orders, `₹${stats.totalSales}`]],
  });

  doc.save("sales_report.pdf");
};
