import { Component, OnInit } from '@angular/core';
import {Projet} from "../../../../model/Projet.model";
import {ActionEvent} from "../../../../state/appData.state";
import {EventDrivenService} from "../../../../services/event-driven.service";
import {FamilleProjet} from "../../../../model/FamilleProjet.model";

@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.css']
})
export class StatistiquesComponent implements OnInit {
  nbRisques:number=0;
  nbRetard:number=0;
  nbComplets:number=0;
  projets:Projet[];
  portefeuilles:FamilleProjet[]=[];
  constructor(private eventDrivenService:EventDrivenService) { }

  ngOnInit(): void {
    this.eventDrivenService.sourceEventSubjectObservable.subscribe(
      (actionEvent:ActionEvent)=> {
        this.projets = actionEvent.payload;
        this.nbRisques=0;
        this.nbRetard=0;
        this.nbComplets=0;
        this.projets.forEach(p=>{
          this.nbRisques+=p.risques.length
          if(p.dateFinPrevue>p.dateFinPlanifiee)
            this.nbRetard++;
          if(p.avancement==100)
            this.nbComplets++;
          let found=false;
          this.portefeuilles.forEach(r=>{
            if(r.codeFamille==p.familleProjet.codeFamille)
              found=true;
          })
          if(!found)
            this.portefeuilles.push(p.familleProjet);
        })
      })
  }

}
