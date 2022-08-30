import { Component, OnInit } from '@angular/core';
import {EventDrivenService} from "../../../../../services/event-driven.service";
import {ActionEvent} from "../../../../../state/appData.state";
import {FamilleProjet} from "../../../../../model/FamilleProjet.model";
import {Projet} from "../../../../../model/Projet.model";
import {DatePipe} from "@angular/common";
declare var $:any;
@Component({
  selector: 'app-retards-par-portefeuilles-chart',
  templateUrl: './retards-par-portefeuilles-chart.component.html',
  styleUrls: ['./retards-par-portefeuilles-chart.component.css']
})
export class RetardsParPortefeuillesChartComponent implements OnInit {
  projets:Projet[];
  constructor(private eventDrivenService:EventDrivenService
  ,public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.eventDrivenService.sourceEventSubjectObservable.subscribe(
      (actionEvent:ActionEvent)=> {
        this.projets=actionEvent.payload;
        let projets:Projet[] = actionEvent.payload;
        let portefeuilles:FamilleProjet[]=[];
        let nomsPortefeuilles:string[]=[];
        let nbRetard:number[]=[];
        let retardCumule:number[]=[];

        projets.forEach(p=>{
          let found=false;
          portefeuilles.forEach(pf=>{
            if(pf.codeFamille==p.familleProjet.codeFamille)
              found=true;
          })
          if(!found) {
            portefeuilles.push(p.familleProjet);
            nomsPortefeuilles.push(p.familleProjet.codeFamille)
          }
        })
        for(let n=0;n<portefeuilles.length;n++) {
          nbRetard.push(0);
          retardCumule.push(0);
        }
        for(let i=0;i<portefeuilles.length;i++)
        {
          projets.forEach(
            p=>{
              if(p.familleProjet.codeFamille==portefeuilles[i].codeFamille&&p.dateFinPrevue>p.dateFinPlanifiee) {
                nbRetard[i]++;
                // let t=(new Date(p.dateFinPrevue).getTime()-new Date(p.dateFinReelle).getTime());
                console.log("this.datepipe.transform(p.dateFinPrevue, 'MM/dd/yyyy'")
                console.log(this.datepipe.transform(p.dateFinPrevue, 'MM/dd/yyyy'))
                console.log("this.datepipe.transform(p.dateFinPlanifiee, 'MM/dd/yyyy'")
                console.log(this.datepipe.transform(p.dateFinPlanifiee, 'MM/dd/yyyy'))
                let t=(new Date(this.datepipe.transform(p.dateFinPrevue, 'MM/dd/yyyy')).getTime()-new Date(this.datepipe.transform(p.dateFinPlanifiee, 'MM/dd/yyyy')).getTime());
                console.log("t")
                console.log(t)
                console.log("t/86400000")
                console.log(t/86400000)
                retardCumule[i]+=t/86400000
                console.log(retardCumule[i])
                // retardCumule[i]+=this.getDifferenceInDays(new Date(p.dateFinPrevue), new Date(p.dateFinReelle))
              }
            }
          )
        }
      console.log("nbRetard")
      console.log(nbRetard)
      console.log("retardCumule")
      console.log(retardCumule)
      console.log("portefeuilles")
      console.log(portefeuilles)
    var options = {
      colors:['rgba(169,118,142,0.74)', '#590934'],
      series: [{
        name: 'retard cumulé ',
        type: 'column',
        data: retardCumule
      }, {
        name: 'Nombre de projets en retards',
        type: 'line',
        data: nbRetard
      }],
      chart: {
        height: 350,
        type: 'line',
      },
      stroke: {
        width: [0, 4]
      },
      title: {
        text: 'Retard par portefeuilles'
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      labels: nomsPortefeuilles,
      yaxis: [{
        title: {
          text: 'retard cumulé (Jour)',
        },

      }, {
        opposite: true,
        title: {
          text: 'Nombre de projets en retards'
        }
      }]
    };
        $("#chart").empty();
    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  }
  )
  }

  getDifferenceInDays(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60 * 24);
  }
}
