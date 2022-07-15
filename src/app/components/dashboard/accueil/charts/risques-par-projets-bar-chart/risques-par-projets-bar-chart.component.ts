import { Component, OnInit } from '@angular/core';
import * as ApexCharts from 'apexcharts';

@Component({
  selector: 'app-risques-par-projets-bar-chart',
  templateUrl: './risques-par-projets-bar-chart.component.html',
  styleUrls: ['./risques-par-projets-bar-chart.component.css']
})
export class RisquesParProjetsBarChartComponent implements OnInit {

  constructor() { }
  loadBarChart(){

    let options = {
      colors:['#ffac58', '#e64a19', '#880e0e'],/*
      colors:['#ad708d', '#a2105e', '#540831'],*/
      series: [{
        name: 'FAIBLE',
        data: [44, 55, 41, 67, 22, 43]
      }, {
        name: 'MOYEN',
        data: [13, 23, 20, 8, 13, 27]
      }, {
        name: 'FORT',
        data: [11, 17, 15, 15, 21, 14]

      }],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10
        },
      },
      xaxis: {

        type: 'string',
        categories: ['SICOM', 'SIONEP', 'FOURNIS', 'DEV ORACLE',
          'ARIS', 'SIGEP'
        ],
      },
      legend: {
        position: 'right',
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
    };

    let chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

  }
  ngOnInit(): void {
    this.loadBarChart();
  }

}
