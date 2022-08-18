import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import * as ApexCharts from 'apexcharts';
import {FamilleProjet} from "../../../../../model/FamilleProjet.model";
import {Projet} from "../../../../../model/Projet.model";
declare var $:any
@Component({
  selector: 'app-risques-par-projets-bar-chart',
  templateUrl: './risques-par-projets-bar-chart.component.html',
  styleUrls: ['./risques-par-projets-bar-chart.component.css']
})
export class RisquesParProjetsBarChartComponent implements OnInit {
  @Input() projets:Projet[];
  @Input() portefeuilles:FamilleProjet[];
  constructor() { }
  loadBarChart(){
    let faible:number[]=[];
    let moyen:number[]=[];
    let fort:number[]=[];
    let catergories:string[]=[];
    for (let i = 0; i < this.portefeuilles.length; i++) {
      faible[i]=0;
      moyen[i]=0;
      fort[i]=0;
      catergories.push(this.portefeuilles[i].codeFamille);
      this.projets.forEach(p=>{
        if(p.familleProjet.codeFamille==this.portefeuilles[i].codeFamille)
        {
          p.risques.forEach(r=>{
            if(r.severite=="Faible")
            {
              faible[i]++;
            }
            if(r.severite=="Moyen")
            {
              moyen[i]++;
            }
            if(r.severite=="Elevé")
            {
              fort[i]++;
            }
          })
        }
      })
    }
    console.log("faible")
    console.log(faible)
    console.log("moyen")
    console.log(moyen)
    console.log("fort")
    console.log(fort)
    let options = {
      colors:['#ffac58', '#e64a19', '#880e0e'],/*
      colors:['#ad708d', '#a2105e', '#540831'],*/
      series: [{
        name: 'FAIBLE',
        data: faible
      }, {
        name: 'MOYEN',
        data: moyen
      }, {
        name: 'FORT',
        data: fort

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
        categories: catergories
      },
      legend: {
        position: 'right',
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
    };
    $("#chart").empty();
    let chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

  }
  ngOnInit(): void {
    this.loadBarChart();
  }
  ngOnChanges(changes: SimpleChanges): void
  {
    this.loadBarChart();
}
}
