// preprocessData.js

class Report {
  constructor(sheetData) {
    this.GeneralInformation = {
      report_date: sheetData[0][0],
      company_name: sheetData[1][0],
      reporting_period: `${sheetData[3][1]} - ${sheetData[3][3]}`,
    };
    this.IncomeDetails = this.extractIncomeDetails(sheetData);
    this.DepartmentBreakdown = this.extractDepartmentBreakdown(sheetData);
    this.AdditionalIncomeStreams = this.extractAdditionalIncomeStreams(sheetData);
    this.GrossProfit = this.extractGrossProfit(sheetData);
  }

  extractIncomeDetails(sheetData) {
    // Check if the Total row exists and has the expected number of columns
    const incomeDetailsRow = sheetData.find(row => row && row[0] === 'Total');
    return incomeDetailsRow ? {
      total_sales: incomeDetailsRow[1],
      total_purchases: incomeDetailsRow[2],
      total_gross_profit: incomeDetailsRow[3],
      total_rebate: incomeDetailsRow[4],
      sales_margin_percentage: incomeDetailsRow[5],
    } : {};
  }

  extractDepartmentBreakdown(sheetData) {
    // Define the start and end rows based on your data structure
    const departmentStartRow = 4; // for example
    const departmentEndRow = 10; // for example
    return sheetData.slice(departmentStartRow, departmentEndRow + 1).map(row => ({
      department_name: row[0],
      sales: row[1],
      purchases: row[2],
      gross_profit: row[3],
      rebate: row[4],
      gross_margin_percentage: row[5],
    }));
  }

  extractAdditionalIncomeStreams(sheetData) {
    // Manually extract each item based on its position
    return {
      fuel_sales: this.getValueFromSheet(sheetData, 18, 1),
      fuel_gross_profit: this.getValueFromSheet(sheetData, 18, 3),
      lottery_sales: this.getValueFromSheet(sheetData, 21, 1),
      lottery_gross_profit: this.getValueFromSheet(sheetData, 21, 3),
      atm_commission: this.getValueFromSheet(sheetData, 22, 3),
      misc_income: this.getValueFromSheet(sheetData, 23, 3),
      coam_commission: this.getValueFromSheet(sheetData, 24, 3),
    };
  }

  extractGrossProfit(sheetData) {
    // Check if the Gross Profit row exists
    const grossProfitRow = sheetData.find(row => row && row[0] === 'Gross Profit');
    return grossProfitRow ? grossProfitRow[3] : 0;
  }

  getValueFromSheet(sheetData, rowIndex, colIndex) {
    // Check if the row exists and has enough columns
    const row = sheetData[rowIndex];
    return row && row.length > colIndex ? row[colIndex] : 0;
  }
}

module.exports = function preprocessData(sheetData) {
  return new Report(sheetData);
};
