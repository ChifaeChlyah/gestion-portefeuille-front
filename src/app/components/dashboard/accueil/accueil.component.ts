import { Component, OnInit } from '@angular/core';
import {AuthentificationService} from "../../../services/authentification.service";
import {FamilleProjet} from "../../../model/FamilleProjet.model";
import {Projet} from "../../../model/Projet.model";
import {PortefeuilleService} from "../../../services/portefeuille.service";
import {ProjetsService} from "../../../services/projets.service";
import {RessourcesService} from "../../../services/ressources.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  active:string|null=null;
  portefeuilles:FamilleProjet[];
  statutParProtefeuilles:{
    codePortefeuille:string,
    attente:number,
    pre_lancement:number,
    lancement:number,
    execution:number,
    cloture:number,
    arret:number,
    garantie:number,
  }[]=new Array();
  obsProjets:Observable<Projet[]>;
  obsPortefeuilles:Observable<FamilleProjet[]>;
  projets:Projet[];
  nbRiques:number=0;
  nbRetard:number=0;
  nbComplets:number=0;
  nbRessources:number=0;
  constructor(private authService:AuthentificationService,
              private portefeuilesService:PortefeuilleService,
              private projetsService:ProjetsService,
              private ressourcesService:RessourcesService) { }
  prenom:string;
  ngOnInit(): void {
    this.prenomUser()
    this.chargerPortefeuilles()
    this.chargerProjets();
    this.chargerNbRessources();

  }
  chargerPortefeuilles()
  {
    this.portefeuilesService.tousLesPortefeuilles().subscribe(
      portefeuille=>{
        this.obsPortefeuilles=new Observable<FamilleProjet[]>(ob=>ob.next(portefeuille))
        this.portefeuilles=portefeuille
        console.log(this.portefeuilles);
        this.portefeuilles.forEach(
          p=>{
            let statut={
              codePortefeuille:p.codeFamille,
              attente:0,
              pre_lancement:0,
              lancement:0,
              execution:0,
              cloture:0,
              arret:0,
              garantie:0,
            }
            this.statutParProtefeuilles.push(statut)
          }
        )
      }
    )
  }
  chargerProjets()
  {
    this.projetsService.tousLesProjets().subscribe(
      projets=>{
        this.obsProjets=new Observable<Projet[]>(ob=>ob.next(projets));
        this.projets=projets;
        if(this.active!=null) {
          let projets=new Array();
          this.projets.forEach(p=>{
            if(p.familleProjet.codeFamille==this.active)
              projets.push(p);
          })
          this.projets=projets;
        }
        this.chargerNbRisques();
        this.chargerNbRetards();
        this.chargerNbComplets();
        this.chargerStatutPortefeuilles();
      }
    )
  }
  chargerNbRisques()
  {
    this.nbRiques=0;
    this.projets.forEach(p=>{
      this.nbRiques+=p.risques.length
    })
  }
  chargerNbRetards()
  {
    this.nbRetard=0;
    this.projets.forEach(p=>{
      if(p.dateFinPlanifiee>=p.dateFinPrevue)
        this.nbRetard++;
    })
  }
  chargerNbComplets()
  {
    this.nbComplets=0;
    this.projets.forEach(p=>{
      if(p.statut=="Garantie"||p.statut=="Clôturé")
        this.nbComplets++;
    })
  }
  chargerNbRessources()
  {
    this.ressourcesService.tous().subscribe(ressources=>{
      ressources.forEach(r=>{
        this.nbRessources++;
      })

      console.log(this.nbRessources);
    })
  }
  chargerStatutPortefeuilles()
  {
    this.projets.forEach(p=>{
      let exist=false;
      let statut;
      this.statutParProtefeuilles.forEach(s=>{
        if(s.codePortefeuille==p.familleProjet.codeFamille) {
          exist = true;
          statut=s;
        }
      })
      if(!exist)
      {
        statut={
          codePortefeuille:p.familleProjet.codeFamille,
          attente:0,
          pre_lancement:0,
          lancement:0,
          execution:0,
          cloture:0,
          arret:0,
          garantie:0,
        }
        this.statutParProtefeuilles.push(statut)
      }
      if(p.statut=="Attente (planifié)")
        statut.attente++;
      if(p.statut=="Pré - Lancement")
        statut.pre_lancement++;
      if(p.statut=="Lancement")
        statut.lancement++;
      if(p.statut=="Exécution")
        statut.execution++;
      if(p.statut=="Clôturé")
        statut.cloture++;
      if(p.statut=="Arrêt")
        statut.arret++;
      if(p.statut=="Garantie")
        statut.garantie++;
    })
  }
  clickFamille(famille:string) {
    if(this.active==famille) {
      this.active = null;
    }
    else {
      this.active = famille;
    }
    this.chargerProjets();
  }
  prenomUser()
  {
    this.authService.getUserbyEmail(this.authService.getEmail()).subscribe(
      user=>{
        this.prenom=user.prenom;
        console.log(this.prenom);
      }
    )
  }
}
