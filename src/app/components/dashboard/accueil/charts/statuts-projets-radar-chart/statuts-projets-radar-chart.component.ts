import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
declare var $:any
@Component({
  selector: 'app-statuts-projets-radar-chart',
  templateUrl: './statuts-projets-radar-chart.component.html',
  styleUrls: ['./statuts-projets-radar-chart.component.css']
})
export class StatutsProjetsRadarChartComponent implements OnInit {
  @Input() statutParProtefeuilles:{
  codePortefeuille:string,
  attente:number,
  pre_lancement:number,
  lancement:number,
  execution:number,
  cloture:number,
  arret:number,
  garantie:number,
}[];
  max=0;
  attente:number[]=[];
  pre_lancement:number[]=[];
  lancement:number[]=[];
  execution:number[]=[];
  cloture:number[]=[];
  arret:number[]=[];
  garantie:number[]=[];
  categories:string[]=[];
  colors:string[]=["#F1C40F","#EB984E","#2ECC71","#48C9B0","#2874A6","#5B2C6F","#943126"];
  constructor() { }
  loadRadarChart()
  {
    this.attente=[];
    this.pre_lancement=[];
    this.lancement=[];
    this.execution=[];
    this.cloture=[];
    this.arret=[];
    this.garantie=[];
    this.categories=[];
    this.statutParProtefeuilles.forEach(s=> {
      if(s.attente>this.max)
        this.max=s.attente
      if(s.pre_lancement>this.max)
        this.max=s.pre_lancement
      if(s.lancement>this.max)
        this.max=s.lancement
      if(s.cloture>this.max)
        this.max=s.cloture
      if(s.arret>this.max)
        this.max=s.arret
      if(s.garantie>this.max)
        this.max=s.garantie
        this.categories.push(s.codePortefeuille)
        this.attente.push(s.attente)
        this.pre_lancement.push(s.pre_lancement)
        this.lancement.push(s.lancement)
        this.cloture.push(s.cloture)
        this.arret.push(s.arret)
        this.garantie.push(s.garantie)
      }
    )
    while(this.max%5!=0)
      this.max++;
    console.log(this.cloture);

    var options = {

      colors: this.colors,
      series: [
      //   {
      //   name: 'Attente (planifié)',
      //   data: [2,4,3,9,4,0,10,5]
      // },
        {
        name: 'Attente (planifié)',
        data: this.attente
      },
        {
        name: 'Pré - Lancement',
        data: this.pre_lancement
      }, {
        name: 'Lancement',
        data: this.lancement
      }, {
        name: 'Exécution',
        data: this.execution
      }, {
        name: 'Clôturé',
        data: this.cloture
      }, {
        name: 'Arrêt',
        data: this.arret
      }, {
        name: 'Garantie',
        data: this.garantie
      }],
      chart: {
        height: 350,
        type: 'radar',
        dropShadow: {
          enabled: true,
          blur: 1,
          left: 1,
          top: 1
        }
      },
      title: {
        /*text: 'Radar Chart - Multi Series'*/
      },
      stroke: {
        width: 2
      },
      fill: {
        opacity: 0.1,
      },
      markers: {
        size: 0
      },
      xaxis: {
        categories: this.categories,

      },
      yaxis: {
        max:this.max,
        min: 0,
        tickAmount: 5,
      }
    };
    $("#chart2").empty();
    var chart = new ApexCharts(document.querySelector("#chart2"), options);
    chart.render();
  }
  ngOnInit(): void {
    this.loadRadarChart();
  }
  ngOnChanges(changes: SimpleChanges): void
  {
    this.loadRadarChart();
  }
}
