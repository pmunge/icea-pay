import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

import {
  ChartConfiguration,
  ChartOptions
} from 'chart.js';

import { BaseChartDirective } from 'ng2-charts';

import {
  channelPerformanceData,
  monthlyChannelIncome
} from '../../../core/data/channel-performance-data';


@Component({
  selector: 'app-channel-performance',

  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    BaseChartDirective
  ],

  templateUrl: './channel-performance.html',

  styleUrl: './channel-performance.scss'
})
export class ChannelPerformance {

  channels = channelPerformanceData;

  monthlyIncome = monthlyChannelIncome;


  /*
   * LINE CHART
   */

  lineChartData: ChartConfiguration<'line'>['data'] = {

    labels: this.monthlyIncome.map(
      item => item.month
    ),

    datasets: [

      {
        label: 'Mobile Money',

        data: this.monthlyIncome.map(
          item => item.mobileMoney
        ),

        tension: 0,

        fill: false
      },

      {
        label: 'Cards',

        data: this.monthlyIncome.map(
          item => item.cards
        ),

        tension: 0,

        fill: false
      },

      {
        label: 'Bank Account',

        data: this.monthlyIncome.map(
          item => item.bankAccount
        ),

        tension: 0,

        fill: false
      }

    ]

  };


  lineChartOptions: ChartOptions<'line'> = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        position: 'bottom'
      }

    },

    scales: {

      y: {

        ticks: {

          callback: (value) =>
            `KES ${Number(value).toLocaleString()}`

        }

      }

    }

  };


  /*
   * PIE CHART
   */

  pieChartOptions: ChartOptions<'pie'> = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        position: 'bottom'
      }

    }

  };


  createMobileMoneyPieChart(): ChartConfiguration<'pie'>['data'] {

    const mobileMoney = this.channels.find(
      channel => channel.name === 'Mobile Money'
    );

    if (!mobileMoney) {

      return {
        labels: [],
        datasets: []
      };

    }

    return {

      labels: mobileMoney.subChannels.map(
        subChannel => subChannel.name
      ),

      datasets: [

        {

          data: mobileMoney.subChannels.map(
            subChannel => subChannel.income
          ),

          borderWidth: 1

        }

      ]

    };

  }


  /*
   * TABLE
   */

  displayedColumns = [
    'channel',
    'transactions',
    'income'
  ];

}