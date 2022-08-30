import { Component, OnInit } from '@angular/core';
import {EventDrivenService} from "../../../../../services/event-driven.service";
import {ActionEvent} from "../../../../../state/appData.state";
import {Projet} from "../../../../../model/Projet.model";
import {auto} from "@popperjs/core";
declare var $:any;
@Component({
  selector: 'app-risques-par-projets-chart',
  templateUrl: './risques-par-projets-chart.component.html',
  styleUrls: ['./risques-par-projets-chart.component.css']
})
export class RisquesParProjetsChartComponent implements OnInit {

  constructor(private eventDrivenService:EventDrivenService) { }

  ngOnInit(): void {
    this.eventDrivenService.sourceEventSubjectObservable.subscribe(
      (actionEvent:ActionEvent)=> {
        let projets:Projet[] = actionEvent.payload;
        let faibles:number[]=[];
        let moyens:number[]=[];
        let forts:number[]=[];
        let codesProjets:string[]=[];
        projets.forEach(p=>{
          let faible=0;
          let moyen=0;
          let fort=0;
          if(p.risques.length>0) {
            codesProjets.push(p.codeProjet);
            p.risques.forEach(r => {
              let niveau = r.severity * r.probabilite / 100;
              if (niveau <= 33)
                faible++;
              else if (niveau > 33 && niveau < 66)
                moyen++;
              else {
                fort++;
              }
            })
            faibles.push(faible);
            moyens.push(moyen);
            forts.push(fort);
            codesProjets.push(p.codeProjet);
            p.risques.forEach(r => {
              let niveau = r.severity * r.probabilite / 100;
              if (niveau <= 33)
                faible++;
              else if (niveau > 33 && niveau < 66)
                moyen++;
              else {
                fort++;
              }
            })
            faibles.push(faible);
            moyens.push(moyen);
            forts.push(fort);
          }
        })
        var options = {
          colors:['rgba(169,118,142,0.74)', '#7e0e4a', '#380621'],
          series: [{
            name: 'Risques faibles',
            data: faibles
          }, {
            name: 'Risques moyens',
            data: moyens
          }, {
            name: 'Risques forts',
            data: forts
          }, ],
          chart: {
            type: 'bar',
            height: auto,
            stacked: true,
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          stroke: {
            width: 1,
            colors: ['#fff']
          },
          title: {
            text: 'Risques par projets et par gravité'
          },
          xaxis: {
            categories: codesProjets,

          },
          yaxis: {
            title: {
              text: undefined
            },
          },
          tooltip: {
            y: {

            }
          },
          fill: {
            opacity: 1
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
          }
        };
        $("#chart2").empty();
        var chart = new ApexCharts(document.querySelector("#chart2"), options);
        chart.render();
      });
  }

}
