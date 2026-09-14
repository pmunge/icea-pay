/*
 * ============================================================
 * DASHBOARD DATA INTERFACES
 * ============================================================
 */

export interface CategorySubProduct {
  name: string;
  transactions: number;
}

export interface CategoryProduct {
  name: string;
  transactions: number;
  income: number;
}

export interface TimeSeriesPoint {
  label: string;
  values: number[];
}

export interface CategoryDashboardData {
  title: string;
  subtitle: string;

  products: CategoryProduct[];

  // INCOME
  hourlyIncome: TimeSeriesPoint[];
  dailyIncome: TimeSeriesPoint[];
  weeklyIncome: TimeSeriesPoint[];
  monthlyIncome: TimeSeriesPoint[];

  // TRANSACTIONS
  hourlyTransactions: TimeSeriesPoint[];
  dailyTransactions: TimeSeriesPoint[];
  weeklyTransactions: TimeSeriesPoint[];
  monthlyTransactions: TimeSeriesPoint[];
}


/*
 * ============================================================
 * LIFE
 * ============================================================
 */

export const lifeDashboardData: CategoryDashboardData = {

  title: 'Life Products Performance',

  subtitle: 'Performance of selected life insurance and retirement products',

  products: [

    {
      name: 'Education Insurance / UsomiBora',
      transactions: 6120,
      income: 4650000
    },

    {
      name: 'Whole of Life',
      transactions: 4380,
      income: 3350000
    },

    {
      name: 'Term Assurance',
      transactions: 5210,
      income: 2600000
    },

    {
      name: 'Endowment Assurance',
      transactions: 3040,
      income: 2950000
    },

    {
      name: 'InvestSure',
      transactions: 3450,
      income: 4560000
    },

    {
      name: 'Annuity',
      transactions: 6750,
      income: 7860000
    },

    {
      name: 'Income Drawdown',
      transactions: 5643,
      income: 6750000
    },

    {
      name: 'Personal Retirement Scheme',
      transactions: 5643,
      income: 45600000
    }

  ],


  /*
   * ==========================================================
   * LIFE - HOURLY INCOME
   * ==========================================================
   */

  hourlyIncome: [

    {
      label: '8 AM',
      values: [45000, 32000, 21000, 28000, 30000, 52000, 42000, 85000]
    },

    {
      label: '9 AM',
      values: [52000, 38000, 25000, 31000, 35000, 61000, 49000, 92000]
    },

    {
      label: '10 AM',
      values: [68000, 45000, 32000, 39000, 42000, 74000, 58000, 110000]
    },

    {
      label: '11 AM',
      values: [72000, 51000, 36000, 42000, 48000, 81000, 64000, 125000]
    },

    {
      label: '12 PM',
      values: [85000, 62000, 41000, 48000, 56000, 94000, 72000, 140000]
    },

    {
      label: '1 PM',
      values: [91000, 68000, 45000, 52000, 62000, 102000, 79000, 155000]
    },

    {
      label: '2 PM',
      values: [78000, 59000, 39000, 46000, 54000, 88000, 69000, 135000]
    },

    {
      label: '3 PM',
      values: [65000, 48000, 33000, 40000, 47000, 76000, 61000, 118000]
    },

    {
      label: '4 PM',
      values: [58000, 42000, 30000, 35000, 41000, 68000, 55000, 105000]
    },

    {
      label: '5 PM',
      values: [49000, 36000, 25000, 30000, 35000, 59000, 47000, 90000]
    }

  ],


  /*
   * ==========================================================
   * LIFE - DAILY INCOME
   * ==========================================================
   */

  dailyIncome: [

    {
      label: 'Mon',
      values: [145000, 105000, 82000, 91000, 125000, 180000, 155000, 420000]
    },

    {
      label: 'Tue',
      values: [152000, 112000, 87000, 96000, 132000, 195000, 168000, 455000]
    },

    {
      label: 'Wed',
      values: [168000, 124000, 94000, 105000, 145000, 215000, 182000, 490000]
    },

    {
      label: 'Thu',
      values: [175000, 131000, 99000, 112000, 152000, 225000, 195000, 520000]
    },

    {
      label: 'Fri',
      values: [190000, 145000, 108000, 120000, 165000, 245000, 210000, 560000]
    },

    {
      label: 'Sat',
      values: [125000, 92000, 71000, 80000, 110000, 165000, 140000, 360000]
    },

    {
      label: 'Sun',
      values: [95000, 72000, 56000, 63000, 85000, 125000, 105000, 280000]
    }

  ],


  /*
   * ==========================================================
   * LIFE - WEEKLY INCOME
   * ==========================================================
   */

  weeklyIncome: [

    {
      label: 'Week 1',
      values: [520000, 380000, 290000, 340000, 420000, 680000, 570000, 2100000]
    },

    {
      label: 'Week 2',
      values: [610000, 420000, 330000, 390000, 510000, 760000, 650000, 2500000]
    },

    {
      label: 'Week 3',
      values: [680000, 510000, 370000, 450000, 580000, 840000, 720000, 2900000]
    },

    {
      label: 'Week 4',
      values: [750000, 570000, 410000, 490000, 650000, 920000, 810000, 3400000]
    }

  ],


  /*
   * ==========================================================
   * LIFE - MONTHLY INCOME
   * ==========================================================
   */

  monthlyIncome: [

    {
      label: 'Jan',
      values: [320000, 240000, 180000, 210000, 350000, 580000, 490000, 3200000]
    },

    {
      label: 'Feb',
      values: [340000, 250000, 190000, 220000, 380000, 620000, 520000, 3500000]
    },

    {
      label: 'Mar',
      values: [365000, 265000, 205000, 235000, 420000, 680000, 570000, 3800000]
    },

    {
      label: 'Apr',
      values: [385000, 280000, 220000, 250000, 450000, 730000, 620000, 4100000]
    },

    {
      label: 'May',
      values: [410000, 300000, 235000, 265000, 480000, 790000, 680000, 4500000]
    },

    {
      label: 'Jun',
      values: [440000, 320000, 250000, 285000, 520000, 850000, 740000, 4900000]
    }

  ],


  /*
   * ==========================================================
   * LIFE - HOURLY TRANSACTIONS
   * ==========================================================
   */

  hourlyTransactions: [

    {
      label: '8 AM',
      values: [42, 35, 28, 31, 30, 45, 38, 52]
    },

    {
      label: '9 AM',
      values: [51, 40, 32, 37, 36, 54, 45, 61]
    },

    {
      label: '10 AM',
      values: [64, 48, 39, 44, 43, 67, 55, 74]
    },

    {
      label: '11 AM',
      values: [72, 55, 43, 49, 50, 76, 62, 83]
    },

    {
      label: '12 PM',
      values: [86, 63, 51, 58, 59, 89, 71, 96]
    },

    {
      label: '1 PM',
      values: [94, 71, 56, 64, 66, 98, 79, 108]
    },

    {
      label: '2 PM',
      values: [81, 62, 49, 57, 58, 84, 70, 92]
    },

    {
      label: '3 PM',
      values: [70, 53, 42, 48, 49, 73, 61, 81]
    },

    {
      label: '4 PM',
      values: [61, 46, 38, 43, 44, 65, 54, 72]
    },

    {
      label: '5 PM',
      values: [50, 39, 31, 36, 37, 56, 46, 63]
    }

  ],


  /*
   * ==========================================================
   * LIFE - DAILY TRANSACTIONS
   * ==========================================================
   */

  dailyTransactions: [

    {
      label: 'Mon',
      values: [180, 135, 120, 95, 140, 210, 175, 260]
    },

    {
      label: 'Tue',
      values: [195, 148, 132, 104, 155, 225, 190, 280]
    },

    {
      label: 'Wed',
      values: [215, 162, 145, 115, 170, 245, 205, 300]
    },

    {
      label: 'Thu',
      values: [228, 175, 152, 122, 182, 260, 218, 320]
    },

    {
      label: 'Fri',
      values: [245, 190, 165, 135, 198, 285, 235, 345]
    },

    {
      label: 'Sat',
      values: [165, 125, 108, 88, 125, 180, 155, 220]
    },

    {
      label: 'Sun',
      values: [130, 98, 85, 70, 100, 145, 120, 175]
    }

  ],


  /*
   * ==========================================================
   * LIFE - WEEKLY TRANSACTIONS
   * ==========================================================
   */

  weeklyTransactions: [

    {
      label: 'Week 1',
      values: [820, 610, 480, 540, 520, 880, 720, 1250]
    },

    {
      label: 'Week 2',
      values: [940, 690, 550, 620, 610, 980, 810, 1420]
    },

    {
      label: 'Week 3',
      values: [1080, 780, 630, 710, 720, 1120, 920, 1580]
    },

    {
      label: 'Week 4',
      values: [1210, 860, 710, 790, 830, 1280, 1050, 1740]
    }

  ],


  /*
   * ==========================================================
   * LIFE - MONTHLY TRANSACTIONS
   * ==========================================================
   */

  monthlyTransactions: [

    {
      label: 'Jan',
      values: [850, 620, 510, 580, 540, 920, 760, 1350]
    },

    {
      label: 'Feb',
      values: [920, 680, 560, 640, 590, 1010, 820, 1480]
    },

    {
      label: 'Mar',
      values: [980, 720, 610, 690, 640, 1090, 890, 1580]
    },

    {
      label: 'Apr',
      values: [1040, 780, 670, 750, 700, 1180, 960, 1690]
    },

    {
      label: 'May',
      values: [1120, 840, 720, 810, 760, 1270, 1040, 1810]
    },

    {
      label: 'Jun',
      values: [1210, 910, 780, 870, 830, 1380, 1140, 1950]
    }

  ]

};


/*
 * ============================================================
 * GENERAL
 * ============================================================
 */

export const generalDashboardData: CategoryDashboardData = {

  title: 'General Products Performance',

  subtitle: 'Performance of selected general insurance products',

  products: [

    {
      name: 'Motor Insurance',
      transactions: 7840,
      income: 7200000
    },

    {
      name: 'Travel Insurance',
      transactions: 2960,
      income: 1850000
    },

    {
      name: 'Home / Domestic Insurance',
      transactions: 4120,
      income: 3100000
    },

    {
      name: 'BizBora SME Package',
      transactions: 3380,
      income: 4300000
    },

    {
      name: 'Fire & Perils',
      transactions: 4532,
      income: 6200000
    },

    {
      name: 'Marine Cargo',
      transactions: 2345,
      income: 4500000
    },

    {
      name: 'WIBA & Liability',
      transactions: 2296,
      income: 5400000
    }

  ],


  hourlyIncome: [

    {
      label: '8 AM',
      values: [72000, 22000, 35000, 42000, 48000, 37000, 44000]
    },

    {
      label: '9 AM',
      values: [85000, 28000, 42000, 51000, 56000, 45000, 52000]
    },

    {
      label: '10 AM',
      values: [105000, 34000, 52000, 64000, 68000, 57000, 63000]
    },

    {
      label: '11 AM',
      values: [118000, 39000, 59000, 72000, 78000, 64000, 71000]
    },

    {
      label: '12 PM',
      values: [135000, 45000, 68000, 84000, 92000, 76000, 85000]
    },

    {
      label: '1 PM',
      values: [148000, 52000, 75000, 96000, 105000, 87000, 94000]
    },

    {
      label: '2 PM',
      values: [132000, 47000, 65000, 82000, 91000, 74000, 83000]
    },

    {
      label: '3 PM',
      values: [115000, 40000, 57000, 71000, 79000, 65000, 73000]
    },

    {
      label: '4 PM',
      values: [98000, 35000, 49000, 62000, 69000, 56000, 64000]
    },

    {
      label: '5 PM',
      values: [82000, 30000, 42000, 53000, 59000, 48000, 55000]
    }

  ],


  dailyIncome: [

    {
      label: 'Mon',
      values: [210000, 58000, 92000, 115000, 165000, 120000, 135000]
    },

    {
      label: 'Tue',
      values: [225000, 65000, 105000, 128000, 180000, 135000, 148000]
    },

    {
      label: 'Wed',
      values: [245000, 72000, 118000, 142000, 195000, 150000, 165000]
    },

    {
      label: 'Thu',
      values: [260000, 78000, 130000, 155000, 215000, 165000, 180000]
    },

    {
      label: 'Fri',
      values: [285000, 86000, 145000, 172000, 235000, 185000, 205000]
    },

    {
      label: 'Sat',
      values: [190000, 55000, 85000, 105000, 150000, 115000, 125000]
    },

    {
      label: 'Sun',
      values: [145000, 42000, 68000, 82000, 115000, 90000, 98000]
    }

  ],


  weeklyIncome: [

    {
      label: 'Week 1',
      values: [820000, 210000, 380000, 510000, 620000, 430000, 470000]
    },

    {
      label: 'Week 2',
      values: [960000, 260000, 440000, 610000, 710000, 520000, 590000]
    },

    {
      label: 'Week 3',
      values: [1080000, 310000, 510000, 690000, 820000, 610000, 680000]
    },

    {
      label: 'Week 4',
      values: [1240000, 360000, 590000, 780000, 940000, 720000, 790000]
    }

  ],


  monthlyIncome: [

    {
      label: 'Jan',
      values: [520000, 180000, 240000, 300000, 450000, 320000, 380000]
    },

    {
      label: 'Feb',
      values: [545000, 195000, 255000, 320000, 490000, 350000, 410000]
    },

    {
      label: 'Mar',
      values: [560000, 210000, 270000, 340000, 530000, 380000, 440000]
    },

    {
      label: 'Apr',
      values: [590000, 230000, 285000, 360000, 570000, 410000, 470000]
    },

    {
      label: 'May',
      values: [615000, 250000, 300000, 380000, 610000, 440000, 500000]
    },

    {
      label: 'Jun',
      values: [650000, 275000, 315000, 400000, 660000, 480000, 540000]
    }

  ],


  hourlyTransactions: [

    {
      label: '8 AM',
      values: [55, 24, 31, 36, 40, 29, 33]
    },

    {
      label: '9 AM',
      values: [67, 29, 38, 44, 48, 36, 41]
    },

    {
      label: '10 AM',
      values: [82, 35, 47, 53, 58, 44, 49]
    },

    {
      label: '11 AM',
      values: [94, 41, 54, 62, 67, 51, 57]
    },

    {
      label: '12 PM',
      values: [108, 48, 63, 71, 78, 59, 66]
    },

    {
      label: '1 PM',
      values: [119, 54, 70, 79, 87, 67, 74]
    },

    {
      label: '2 PM',
      values: [106, 49, 62, 70, 78, 59, 67]
    },

    {
      label: '3 PM',
      values: [91, 43, 54, 62, 68, 52, 59]
    },

    {
      label: '4 PM',
      values: [78, 37, 47, 54, 60, 45, 52]
    },

    {
      label: '5 PM',
      values: [65, 31, 40, 47, 52, 39, 45]
    }

  ],


  dailyTransactions: [

    {
      label: 'Mon',
      values: [240, 82, 125, 145, 165, 95, 110]
    },

    {
      label: 'Tue',
      values: [260, 91, 138, 158, 180, 105, 122]
    },

    {
      label: 'Wed',
      values: [285, 100, 150, 172, 195, 118, 135]
    },

    {
      label: 'Thu',
      values: [305, 110, 165, 188, 215, 128, 148]
    },

    {
      label: 'Fri',
      values: [330, 122, 180, 205, 238, 142, 165]
    },

    {
      label: 'Sat',
      values: [220, 78, 110, 132, 150, 90, 102]
    },

    {
      label: 'Sun',
      values: [175, 62, 88, 105, 120, 72, 84]
    }

  ],


  weeklyTransactions: [

    {
      label: 'Week 1',
      values: [980, 360, 520, 610, 740, 430, 480]
    },

    {
      label: 'Week 2',
      values: [1140, 420, 610, 720, 860, 510, 560]
    },

    {
      label: 'Week 3',
      values: [1290, 480, 700, 830, 980, 590, 650]
    },

    {
      label: 'Week 4',
      values: [1450, 540, 790, 940, 1120, 680, 740]
    }

  ],


  monthlyTransactions: [

    {
      label: 'Jan',
      values: [1100, 390, 580, 650, 720, 410, 470]
    },

    {
      label: 'Feb',
      values: [1180, 430, 630, 710, 780, 450, 510]
    },

    {
      label: 'Mar',
      values: [1260, 470, 680, 770, 850, 490, 550]
    },

    {
      label: 'Apr',
      values: [1350, 520, 730, 830, 920, 540, 610]
    },

    {
      label: 'May',
      values: [1440, 570, 790, 890, 990, 590, 660]
    },

    {
      label: 'Jun',
      values: [1540, 620, 850, 950, 1070, 640, 720]
    }

  ]

};


/*
 * ============================================================
 * MEDICAL
 * ============================================================
 */

export const medicalDashboardData: CategoryDashboardData = {

  title: 'Medical Products Performance',

  subtitle: 'Performance of selected health and medical products',

  products: [

    {
      name: 'Individual Medical Cover',
      transactions: 3480,
      income: 2600000
    },

    {
      name: 'Family Healthcare Plan',
      transactions: 4260,
      income: 3400000
    },

    {
      name: 'Senior Citizens Healthcare',
      transactions: 1540,
      income: 1250000
    },

    {
      name: 'Corporate & Group Medical Cover',
      transactions: 2180,
      income: 4100000
    }

  ],


  hourlyIncome: [

    {
      label: '8 AM',
      values: [28000, 34000, 16000, 42000]
    },

    {
      label: '9 AM',
      values: [34000, 41000, 19000, 51000]
    },

    {
      label: '10 AM',
      values: [42000, 50000, 23000, 62000]
    },

    {
      label: '11 AM',
      values: [49000, 59000, 27000, 71000]
    },

    {
      label: '12 PM',
      values: [56000, 67000, 31000, 82000]
    },

    {
      label: '1 PM',
      values: [63000, 75000, 35000, 91000]
    },

    {
      label: '2 PM',
      values: [58000, 69000, 32000, 84000]
    },

    {
      label: '3 PM',
      values: [51000, 61000, 29000, 75000]
    },

    {
      label: '4 PM',
      values: [44000, 53000, 25000, 66000]
    },

    {
      label: '5 PM',
      values: [37000, 45000, 21000, 57000]
    }

  ],


  dailyIncome: [

    {
      label: 'Mon',
      values: [85000, 110000, 42000, 135000]
    },

    {
      label: 'Tue',
      values: [92000, 118000, 46000, 148000]
    },

    {
      label: 'Wed',
      values: [105000, 132000, 51000, 162000]
    },

    {
      label: 'Thu',
      values: [112000, 145000, 56000, 175000]
    },

    {
      label: 'Fri',
      values: [125000, 160000, 62000, 195000]
    },

    {
      label: 'Sat',
      values: [82000, 105000, 40000, 125000]
    },

    {
      label: 'Sun',
      values: [62000, 82000, 31000, 95000]
    }

  ],


  weeklyIncome: [

    {
      label: 'Week 1',
      values: [320000, 420000, 160000, 520000]
    },

    {
      label: 'Week 2',
      values: [380000, 490000, 190000, 610000]
    },

    {
      label: 'Week 3',
      values: [440000, 560000, 220000, 700000]
    },

    {
      label: 'Week 4',
      values: [510000, 650000, 260000, 820000]
    }

  ],


  monthlyIncome: [

    {
      label: 'Jan',
      values: [260000, 300000, 150000, 380000]
    },

    {
      label: 'Feb',
      values: [275000, 315000, 160000, 400000]
    },

    {
      label: 'Mar',
      values: [290000, 335000, 172000, 425000]
    },

    {
      label: 'Apr',
      values: [305000, 360000, 185000, 450000]
    },

    {
      label: 'May',
      values: [325000, 385000, 198000, 480000]
    },

    {
      label: 'Jun',
      values: [345000, 410000, 210000, 510000]
    }

  ],


  hourlyTransactions: [

    {
      label: '8 AM',
      values: [25, 31, 12, 29]
    },

    {
      label: '9 AM',
      values: [32, 38, 15, 35]
    },

    {
      label: '10 AM',
      values: [41, 47, 19, 43]
    },

    {
      label: '11 AM',
      values: [49, 56, 23, 51]
    },

    {
      label: '12 PM',
      values: [57, 64, 27, 59]
    },

    {
      label: '1 PM',
      values: [64, 72, 31, 67]
    },

    {
      label: '2 PM',
      values: [58, 66, 29, 61]
    },

    {
      label: '3 PM',
      values: [51, 59, 26, 54]
    },

    {
      label: '4 PM',
      values: [44, 51, 22, 47]
    },

    {
      label: '5 PM',
      values: [37, 43, 18, 39]
    }

  ],


  dailyTransactions: [

    {
      label: 'Mon',
      values: [75, 95, 35, 105]
    },

    {
      label: 'Tue',
      values: [82, 102, 39, 115]
    },

    {
      label: 'Wed',
      values: [91, 115, 44, 125]
    },

    {
      label: 'Thu',
      values: [98, 128, 49, 138]
    },

    {
      label: 'Fri',
      values: [108, 142, 55, 152]
    },

    {
      label: 'Sat',
      values: [70, 88, 32, 98]
    },

    {
      label: 'Sun',
      values: [52, 68, 25, 76]
    }

  ],


  weeklyTransactions: [

    {
      label: 'Week 1',
      values: [420, 510, 180, 620]
    },

    {
      label: 'Week 2',
      values: [500, 610, 220, 740]
    },

    {
      label: 'Week 3',
      values: [580, 710, 260, 860]
    },

    {
      label: 'Week 4',
      values: [670, 820, 310, 980]
    }

  ],


  monthlyTransactions: [

    {
      label: 'Jan',
      values: [520, 630, 230, 710]
    },

    {
      label: 'Feb',
      values: [560, 690, 250, 760]
    },

    {
      label: 'Mar',
      values: [610, 740, 280, 820]
    },

    {
      label: 'Apr',
      values: [660, 800, 300, 880]
    },

    {
      label: 'May',
      values: [710, 860, 330, 950]
    },

    {
      label: 'Jun',
      values: [780, 930, 360, 1040]
    }

  ]

};


/*
 * ============================================================
 * INVESTMENT
 * ============================================================
 */

export const investmentDashboardData: CategoryDashboardData = {

  title: 'Investment Products Performance',

  subtitle: 'Performance of selected investment funds',

  products: [

    {
      name: 'Money Market Fund (MMF)',
      transactions: 5820,
      income: 3200000
    },

    {
      name: 'Equity Fund',
      transactions: 3140,
      income: 3900000
    },

    {
      name: 'Fixed Income Fund',
      transactions: 2760,
      income: 2500000
    },

    {
      name: 'Balanced Fund',
      transactions: 3010,
      income: 3050000
    }

  ],


  hourlyIncome: [

    {
      label: '8 AM',
      values: [22000, 30000, 20000, 25000]
    },

    {
      label: '9 AM',
      values: [27000, 36000, 24000, 30000]
    },

    {
      label: '10 AM',
      values: [34000, 43000, 29000, 36000]
    },

    {
      label: '11 AM',
      values: [41000, 51000, 34000, 42000]
    },

    {
      label: '12 PM',
      values: [48000, 59000, 39000, 48000]
    },

    {
      label: '1 PM',
      values: [55000, 67000, 45000, 55000]
    },

    {
      label: '2 PM',
      values: [51000, 62000, 42000, 51000]
    },

    {
      label: '3 PM',
      values: [45000, 55000, 37000, 45000]
    },

    {
      label: '4 PM',
      values: [39000, 48000, 33000, 40000]
    },

    {
      label: '5 PM',
      values: [33000, 41000, 28000, 35000]
    }

  ],


  dailyIncome: [

    {
      label: 'Mon',
      values: [72000, 95000, 62000, 78000]
    },

    {
      label: 'Tue',
      values: [79000, 104000, 68000, 85000]
    },

    {
      label: 'Wed',
      values: [88000, 115000, 75000, 93000]
    },

    {
      label: 'Thu',
      values: [96000, 126000, 82000, 101000]
    },

    {
      label: 'Fri',
      values: [108000, 140000, 91000, 112000]
    },

    {
      label: 'Sat',
      values: [70000, 90000, 59000, 73000]
    },

    {
      label: 'Sun',
      values: [52000, 68000, 45000, 57000]
    }

  ],


  weeklyIncome: [

    {
      label: 'Week 1',
      values: [420000, 510000, 330000, 390000]
    },

    {
      label: 'Week 2',
      values: [490000, 590000, 390000, 450000]
    },

    {
      label: 'Week 3',
      values: [560000, 670000, 450000, 520000]
    },

    {
      label: 'Week 4',
      values: [640000, 760000, 520000, 600000]
    }

  ],


  monthlyIncome: [

    {
      label: 'Jan',
      values: [210000, 280000, 190000, 240000]
    },

    {
      label: 'Feb',
      values: [230000, 295000, 205000, 255000]
    },

    {
      label: 'Mar',
      values: [245000, 315000, 220000, 270000]
    },

    {
      label: 'Apr',
      values: [270000, 335000, 235000, 290000]
    },

    {
      label: 'May',
      values: [285000, 360000, 250000, 310000]
    },

    {
      label: 'Jun',
      values: [310000, 385000, 268000, 330000]
    }

  ],


  hourlyTransactions: [

    {
      label: '8 AM',
      values: [34, 22, 18, 25]
    },

    {
      label: '9 AM',
      values: [42, 28, 22, 31]
    },

    {
      label: '10 AM',
      values: [51, 35, 27, 38]
    },

    {
      label: '11 AM',
      values: [60, 42, 33, 46]
    },

    {
      label: '12 PM',
      values: [69, 49, 39, 54]
    },

    {
      label: '1 PM',
      values: [77, 56, 44, 62]
    },

    {
      label: '2 PM',
      values: [71, 52, 41, 57]
    },

    {
      label: '3 PM',
      values: [63, 46, 36, 51]
    },

    {
      label: '4 PM',
      values: [55, 40, 31, 44]
    },

    {
      label: '5 PM',
      values: [47, 34, 26, 38]
    }

  ],


  dailyTransactions: [

    {
      label: 'Mon',
      values: [115, 78, 65, 88]
    },

    {
      label: 'Tue',
      values: [128, 86, 72, 96]
    },

    {
      label: 'Wed',
      values: [142, 95, 80, 105]
    },

    {
      label: 'Thu',
      values: [155, 104, 88, 116]
    },

    {
      label: 'Fri',
      values: [172, 118, 98, 130]
    },

    {
      label: 'Sat',
      values: [108, 72, 61, 80]
    },

    {
      label: 'Sun',
      values: [82, 55, 47, 62]
    }

  ],


  weeklyTransactions: [

    {
      label: 'Week 1',
      values: [710, 420, 350, 460]
    },

    {
      label: 'Week 2',
      values: [820, 490, 410, 540]
    },

    {
      label: 'Week 3',
      values: [940, 570, 470, 620]
    },

    {
      label: 'Week 4',
      values: [1080, 650, 540, 710]
    }

  ],


  monthlyTransactions: [

    {
      label: 'Jan',
      values: [850, 490, 420, 540]
    },

    {
      label: 'Feb',
      values: [920, 540, 460, 590]
    },

    {
      label: 'Mar',
      values: [980, 590, 510, 640]
    },

    {
      label: 'Apr',
      values: [1050, 630, 550, 690]
    },

    {
      label: 'May',
      values: [1120, 680, 600, 750]
    },

    {
      label: 'Jun',
      values: [1210, 740, 660, 820]
    }

  ]

};