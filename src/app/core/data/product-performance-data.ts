export interface ProductSummary {
  name: string;
  transactions: number;
  income: number;
}

export interface SubProduct {
  name: string;
  transactions: number;
}

export interface ProductPerformance {
  name: string;
  transactions: number;
  income: number;
  subProducts: SubProduct[];
}

export const productPerformanceData: ProductPerformance[] = [

  {
    name: 'Life',
    transactions: 8420,
    income: 4850000,

    subProducts: [
      {
        name: 'My Property',
        transactions: 3200
      },
      {
        name: 'My Family and I',
        transactions: 3410
      },
      {
        name: 'My Life',
        transactions: 1810
      }
    ]
  },

  {
    name: 'Investment',
    transactions: 3250,
    income: 3200000,

    subProducts: [
      {
        name: 'Unit Trusts',
        transactions: 2180
      },
      {
        name: 'Private Wealth Management',
        transactions: 1070
      }
    ]
  },

  {
    name: 'General',
    transactions: 5680,
    income: 4100000,

    subProducts: [
      {
        name: 'Personal Retirement',
        transactions: 1850
      },
      {
        name: 'Income Drawdown Fund',
        transactions: 920
      },
      {
        name: 'Annuity',
        transactions: 1740
      },
      {
        name: 'Thabiti Life Plan',
        transactions: 1170
      }
    ]
  },

  {
    name: 'Medical',
    transactions: 2940,
    income: 2600000,

    subProducts: [
      {
        name: 'Milele Trust',
        transactions: 820
      },
      {
        name: 'Estate Planning',
        transactions: 640
      },
      {
        name: 'Medical Trust',
        transactions: 730
      },
      {
        name: 'Family Welfare',
        transactions: 750
      }
    ]
  }

];
export const monthlyProductIncome = [
  {
    month: 'Jan',
    secureLifeAssets: 320000,
    growYourMoney: 210000,
    retireWithEase: 280000,
    preserveYourLegacy: 175000
  },
  {
    month: 'Feb',
    secureLifeAssets: 360000,
    growYourMoney: 230000,
    retireWithEase: 310000,
    preserveYourLegacy: 190000
  },
  {
    month: 'Mar',
    secureLifeAssets: 390000,
    growYourMoney: 245000,
    retireWithEase: 340000,
    preserveYourLegacy: 205000
  },
  {
    month: 'Apr',
    secureLifeAssets: 410000,
    growYourMoney: 270000,
    retireWithEase: 365000,
    preserveYourLegacy: 220000
  },
  {
    month: 'May',
    secureLifeAssets: 430000,
    growYourMoney: 285000,
    retireWithEase: 380000,
    preserveYourLegacy: 235000
  },
  {
    month: 'Jun',
    secureLifeAssets: 460000,
    growYourMoney: 310000,
    retireWithEase: 410000,
    preserveYourLegacy: 250000
  }
];