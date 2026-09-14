export interface BusinessSubProduct {
    name: string;
    transactions: number;
}

export interface BusinessProduct {
    name: string;
    transactions: number;
    income: number;
    subProducts: BusinessSubProduct[];
}

export const businessProductPerformanceData: BusinessProduct[] = [

    {
        name: 'Life',

        transactions: 2840,

        income: 4200000,

        subProducts: [
            {
                name: 'My Employees',
                transactions: 1640
            },
            {
                name: 'Life',
                transactions: 1200
            }
        ]
    },

    {
        name: 'Investment',

        transactions: 1920,

        income: 3100000,

        subProducts: [
            {
                name: 'Pensions Management',
                transactions: 1120
            },
            {
                name: 'Umbrella Trust Retirement Scheme',
                transactions: 800
            }
        ]
    },

    {
        name: 'General',

        transactions: 3450,

        income: 5600000,

        subProducts: [
            {
                name: 'Deposit Administration',
                transactions: 1280
            },
            {
                name: 'Guaranteed Umbrella Fund',
                transactions: 970
            },
            {
                name: 'Contracting Out of NSSF',
                transactions: 1200
            }
        ]
    },

    {
        name: 'Medical',

        transactions: 980,

        income: 1400000,

        subProducts: [
            {
                name: 'Corporate Trustee Services',
                transactions: 980
            }
        ]
    }

];
export const monthlyBusinessProductIncome = [

    {
        month: 'Jan',

        secureLifeAssets: 280000,
        growYourMoney: 190000,
        retireWithEase: 350000,
        preserveYourLegacy: 95000
    },

    {
        month: 'Feb',

        secureLifeAssets: 310000,
        growYourMoney: 210000,
        retireWithEase: 380000,
        preserveYourLegacy: 110000
    },

    {
        month: 'Mar',

        secureLifeAssets: 335000,
        growYourMoney: 230000,
        retireWithEase: 410000,
        preserveYourLegacy: 120000
    },

    {
        month: 'Apr',

        secureLifeAssets: 360000,
        growYourMoney: 250000,
        retireWithEase: 445000,
        preserveYourLegacy: 135000
    },

    {
        month: 'May',

        secureLifeAssets: 390000,
        growYourMoney: 270000,
        retireWithEase: 470000,
        preserveYourLegacy: 150000
    },

    {
        month: 'Jun',

        secureLifeAssets: 420000,
        growYourMoney: 290000,
        retireWithEase: 500000,
        preserveYourLegacy: 165000
    }

];