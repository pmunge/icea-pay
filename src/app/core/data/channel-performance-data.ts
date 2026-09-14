export interface ChannelSubChannel {
  name: string;
  transactions: number;
  income: number;
}

export interface ChannelPerformance {
  name: string;
  transactions: number;
  income: number;
  subChannels: ChannelSubChannel[];
}


export const channelPerformanceData: ChannelPerformance[] = [

  {
    name: 'Mobile Money',

    transactions: 8420,

    income: 6800000,

    subChannels: [
      {
        name: 'M-Pesa',
        transactions: 6120,
        income: 4850000
      },
      {
        name: 'Airtel Money',
        transactions: 2300,
        income: 1950000
      }
    ]
  },

  {
    name: 'Cards',

    transactions: 2940,

    income: 2400000,

    subChannels: [
      {
        name: 'Cards',
        transactions: 2940,
        income: 2400000
      }
    ]
  },

  {
    name: 'Bank Account',

    transactions: 3850,

    income: 4100000,

    subChannels: [
      {
        name: 'Bank Account',
        transactions: 3850,
        income: 4100000
      }
    ]
  }

];
export const monthlyChannelIncome = [

  {
    month: 'Jan',

    mobileMoney: 520000,
    cards: 210000,
    bankAccount: 340000
  },

  {
    month: 'Feb',

    mobileMoney: 580000,
    cards: 225000,
    bankAccount: 365000
  },

  {
    month: 'Mar',

    mobileMoney: 610000,
    cards: 245000,
    bankAccount: 390000
  },

  {
    month: 'Apr',

    mobileMoney: 640000,
    cards: 265000,
    bankAccount: 420000
  },

  {
    month: 'May',

    mobileMoney: 690000,
    cards: 285000,
    bankAccount: 450000
  },

  {
    month: 'Jun',

    mobileMoney: 720000,
    cards: 310000,
    bankAccount: 480000
  }

];