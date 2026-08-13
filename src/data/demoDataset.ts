import Papa from 'papaparse';

// Generate realistic dataset with 500 rows that exhibits all target ML data risks:
// 1. Target Imbalance (churn: 9% positive, 91% negative)
// 2. Data Leakage (account_closed_date, exit_survey_score)
// 3. High Cardinality (city)
// 4. Identifier Risk (customer_id)
// 5. Missing Values (income 18% missing)
// 6. Extreme Outliers (total_balance up to $12,500,000)
// 7. Constant Feature (country: "United States")

function generateDemoRows() {
  const cities = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego",
    "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Indianapolis", "Charlotte",
    "San Francisco", "Seattle", "Denver", "Washington", "Boston", "El Paso", "Nashville", "Detroit",
    "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee", "Albuquerque",
    "Tucson", "Fresno", "Sacramento", "Mesa", "Kansas City", "Atlanta", "Omaha", "Colorado Springs",
    "Raleigh", "Long Beach", "Virginia Beach", "Miami", "Oakland", "Minneapolis", "Tulsa", "Bakersfield",
    "Wichita", "Arlington", "Aurora", "Tampa", "New Orleans", "Cleveland", "Honolulu", "Anaheim", "Lexington",
    "Stockton", "Corpus Christi", "Henderson", "Riverside", "Newark", "Saint Paul", "Santa Ana", "Cincinnati",
    "Irvine", "Orlando", "Pittsburgh", "St. Louis", "Greensboro", "Jersey City", "Anchorage", "Lincoln"
  ];

  const contracts = ["Month-to-Month", "One Year", "Two Year"];

  const rows = [];
  const totalRows = 500;
  
  for (let i = 1; i <= totalRows; i++) {
    // 9% positive churn
    const isChurned = i <= 45 ? 1 : 0;
    
    // Identifier
    const customer_id = `CUST-${10000 + i}`;
    
    // Age
    const age = Math.floor(20 + Math.random() * 55);
    
    // Tenure
    const tenure_months = isChurned ? Math.floor(1 + Math.random() * 14) : Math.floor(6 + Math.random() * 66);
    
    // Income (18% missing)
    const incomeMissing = Math.random() < 0.18;
    const income = incomeMissing ? '' : Math.floor(28000 + Math.random() * 92000);
    
    // City (high cardinality)
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    // Leakage feature 1: account_closed_date (only present if churned!)
    const account_closed_date = isChurned ? `2024-${String(Math.floor(1 + Math.random() * 6)).padStart(2, '0')}-${String(Math.floor(1 + Math.random() * 28)).padStart(2, '0')}` : '';
    
    // Leakage feature 2: exit_survey_score (only present if churned!)
    const exit_survey_score = isChurned ? Math.floor(1 + Math.random() * 3) : '';
    
    // Contract type
    const contract_type = isChurned ? (Math.random() < 0.8 ? "Month-to-Month" : "One Year") : contracts[Math.floor(Math.random() * contracts.length)];
    
    // Monthly charges
    const monthly_charges = (35 + Math.random() * 80).toFixed(2);
    
    // Outliers in total_balance (2.5% extreme values)
    const isOutlier = Math.random() < 0.025;
    const total_balance = isOutlier 
      ? Math.floor(3500000 + Math.random() * 9000000) 
      : Math.floor(1200 + Math.random() * 48000);
      
    // Constant column
    const country = "United States";
    
    // Support tickets
    const support_tickets_30d = isChurned ? Math.floor(3 + Math.random() * 6) : Math.floor(Math.random() * 3);
    
    rows.push({
      customer_id,
      age,
      tenure_months,
      income,
      city,
      account_closed_date,
      exit_survey_score,
      contract_type,
      monthly_charges,
      total_balance,
      country,
      support_tickets_30d,
      churn: isChurned
    });
  }

  return rows;
}

export const DEMO_DATA_ROWS = generateDemoRows();

export function getDemoCSVString(): string {
  return Papa.unparse(DEMO_DATA_ROWS);
}
