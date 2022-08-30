import {Component, OnInit} from '@angular/core';
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {Options} from "@angular-slider/ngx-slider";
import {Router} from "@angular/router";
import {AuthentificationService} from "../../../services/authentification.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Priorite, Projet, StatutMapping} from "../../../model/Projet.model";
import {PortefeuilleService} from "../../../services/portefeuille.service";
import {RessourcesService} from "../../../services/ressources.service";
import {Ressource} from "../../../model/Ressource.model";
import {ProjetsService} from "../../../services/projets.service";
import {EventDrivenService} from "../../../services/event-driven.service";
import {ActionEvent, ProjectActionTypes} from "../../../state/appData.state";
import {FamilleProjet} from "../../../model/FamilleProjet.model";

declare var $: any;
@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.css'],
})
export class ProjetsComponent implements OnInit {
  optionsCoutInitial: Options={ceil:500000,floor:0};

  datesAFiltrer: any;
  dateDebut: any;
  dateFin: any;
  portefeuilleSelectionnes:FamilleProjet[];
  chefsSelectionnes:{id:bigint,nom_prenom:string}[];
  statutsSelectionnes: {id:number,valeur:string}[];
  risquesSelectionnes:{id:number,valeur:string,min:number,max:number}[];
  minNbRisques:number;
  maxNbRisques:number;
  estComplet:boolean=false;
  minCoutReel: number=0;
  maxCoutReel: number=200000;
  minCoutInitial: number=0;
  maxCoutInitial: number=20000;
  estEnRetard:boolean=false;
  FilterHidden: boolean=true;
  projetsFiltres:Projet[];
  optionsCoutReel: Options={ceil:500,floor:0};
  tousLesChefs:Ressource[]
  tousLesProjets:Projet[]
  public StatutMapping = StatutMapping;
  constructor(private router:Router,public authService:AuthentificationService,
              private portefeuillesService:PortefeuilleService,
              private ressourcesService:RessourcesService, private projetsService:ProjetsService
              ,private eventDrivenService:EventDrivenService) {
  }
  rangeDateDebut = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  rangeDateFin = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  dropdownList:any[] = [];
  dropdownSettings:IDropdownSettings={
    selectAllText: 'Sélectionner tout',
    unSelectAllText: 'Désélectionner tout',
  };
  // --------DropdownStatut--------------------------
  dropdownListStatut:any[] = [
    {id:0,valeur:this.StatutMapping[0]},
    {id:1,valeur:this.StatutMapping[1]},
    {id:2,valeur:this.StatutMapping[2]},
    {id:3,valeur:this.StatutMapping[3]},
    {id:4,valeur:this.StatutMapping[4]},
    {id:5,valeur:this.StatutMapping[5]},
    {id:6,valeur:this.StatutMapping[6]},
  ];
  dropdownSettingsStatut:IDropdownSettings={
    idField: 'id',
    textField: 'valeur',
    selectAllText: 'Sélectionner tout',
    unSelectAllText: 'Désélectionner tout',
  };
  // --------DropdownRisque--------------------------
  dropdownListRisque:any[] = [
    {id:0,valeur:"Faible"},
    {id:1,valeur:"Moyen"},
    {id:2,valeur:"Elevé"},
  ];
  dropdownSettingsRisque:IDropdownSettings={
    idField: 'id',
    textField: 'valeur',
    selectAllText: 'Sélectionner tout',
    unSelectAllText: 'Désélectionner tout',
  };
  // --------DropdownTypeDureeDate--------------------------
  dropdownListTypeDureeDate:any[] = [
    {id:0,valeur:"Planifiée"},
    {id:1,valeur:"Prévue"},
    {id:2,valeur:"Réelle"},
  ];
  dropdownSettingsTypeDureeDate:IDropdownSettings={
    idField: 'id',
    textField: 'valeur',
    selectAllText: 'Sélectionner tout',
    unSelectAllText: 'Désélectionner tout',
  };
  // --------DropdownPortefeuille--------------------------
  dropdownListPortefeuilles:any[] ;
  dropdownSettingsPortefeuilles:IDropdownSettings={
    idField: 'codeFamille',
    textField: 'titreFamille',
    selectAllText: 'Sélectionner tout',
    unSelectAllText: 'Désélectionner tout',
  };
  // --------DropdownChefs--------------------------
  dropdownListChefs:any[] =[];
  dropdownSettingsChefs:IDropdownSettings={
    idField: 'id',
    textField: 'nom_prenom',
    selectAllText: 'Sélectionner tout',
    unSelectAllText: 'Désélectionner tout',
  };



  duree: any;
JqueryCode(){

  $('#sidebar-control').on('click', function() {
    $('#content').toggleClass('sidebar-hidden');
  });

}
  risque: number = 1;

  form: any;
  priorite: number = 3;
  optionsPriorite: Options = {
    ceil: 3,
    showSelectionBar: true,
    selectionBarGradient: {
      from: '#FC0',
      to: 'transparent'
    },


    showTicksValues:false,
    hidePointerLabels:true,
    hideLimitLabels:true,
    showTicks: true,
    getLegend: (value: number): string => {
      if (value == 0) {
        return 'Basse';
      }
      if (value == 1) {
        return 'Moyenne';
      }
      if (value == 2) {
        return 'Elevée';
      }
      if (value == 3) {
        return 'Toutes';
      }
      return 'Elevée';
    },
    getPointerColor:(value: number): string => {
      if (value == 0) {
        return '#fac305';
      }
      if (value == 1) {
        return '#cd6732';
      }
      if (value == 2) {
        return '#880e4f';
      }
      if (value == 3) {
        return 'white';
      }
      return '#880e4f';
    },
  };

  date2 = new Date();
  optionsDateRange: any/*IDateRangePickerOptions= {
    labelText: 'Date de début - Date de fin',
    format: 'DD-MM-YYYY',
  };*/


  ngOnInit() {
    this.projetsService.tousLesProjets().subscribe(
      projets=>{
        this.projetsFiltres=projets;
        this.eventDrivenService.publishEvent(
          {
            type:ProjectActionTypes.Filtre_Projets,
            payload:projets
          })
      }
    )
    this.portefeuillesService.tousLesPortefeuilles().subscribe(
      portefeuilles=>{
        this.dropdownListPortefeuilles=portefeuilles;
      }
    )
    this.ressourcesService.tousLesChef().subscribe(chefs=>{
      this.tousLesChefs=chefs;
      let cs=[]
      chefs.forEach(c=>{
        cs.push({id:c.codeRessource,nom_prenom:c.nom+" "+c.prenom})
      })
      this.dropdownListChefs=cs;
      console.log("chefs")
      console.log(this.dropdownListChefs)
    })
    this.loadCout()
  }
  async loadCout(){
    await this.projetsService.tousLesProjets().toPromise().then(
      projets=>{
      this.tousLesProjets=projets;
      let maxReel=0
      let maxInitial=0
      projets.forEach(p=>{
        if(p.coutInitial>maxInitial) {
          maxInitial=p.coutInitial;
        }
        if(p.coutReel>maxReel) {
          maxReel = p.coutReel;
        }
      })

      this.optionsCoutReel = {ceil:maxReel,floor:0};
      this.maxCoutReel = maxReel;
      this.optionsCoutInitial = {ceil:maxInitial,floor:0};
      this.maxCoutInitial = maxInitial;
      console.log("this.optionsCoutInitialthis.optionsCoutInitial")
      console.log(this.optionsCoutInitial)
    })
  }
  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
  }
  async clickFiltre() {
    $('#content').toggleClass('sidebar-hidden');
    if(this.FilterHidden==true)
      this.FilterHidden = !this.FilterHidden;
    else {
      await this.delay(1000);
      this.FilterHidden = !this.FilterHidden;
    }
  }
  getUrl():string{
    return this.router.url;
}

  Filtrer() {
    console.log("this.datesAFiltrer")
    console.log(this.datesAFiltrer);
    console.log("this.rangeDateDebut")
    console.log(this.rangeDateDebut)
    console.log("this.rangeDateFin")
    console.log(this.rangeDateFin)
    console.log("this.portefeuilleSelectionnes")
    console.log(this.portefeuilleSelectionnes)
    console.log("this.duree")
    console.log(this.duree)
    let projets:Projet[]=[];
    let projets2:Projet[]=this.projetsFiltres;
    let filtre=false;
    if(this.datesAFiltrer) {
      this.datesAFiltrer.forEach(d => {
        if (d.id == 0) {
          filtre=true;
          projets2.forEach(p => {
            if ((!this.rangeDateDebut.value.start ||
                (this.rangeDateDebut.value.start && new Date(p.dateDebutPlanifiee) > this.rangeDateDebut.value.start))
              && (!this.rangeDateDebut.value.end ||
                (this.rangeDateDebut.value.end &&
                  new Date(p.dateDebutPlanifiee) < this.rangeDateDebut.value.end)) &&
              (!this.rangeDateFin.value.start ||
                (this.rangeDateFin.value.start && new Date(p.dateFinPlanifiee) > this.rangeDateFin.value.start))
              && (!this.rangeDateFin.value.end ||
                (this.rangeDateFin.value.end &&
                  new Date(p.dateFinPlanifiee) < this.rangeDateFin.value.end)))
              projets.push(p);
          })
        } else if (d.id == 1) {
          projets2.forEach(p => {
            filtre=true;
            if ((!this.rangeDateDebut.value.start ||
                (this.rangeDateDebut.value.start && new Date(p.dateDebutPrevue) > this.rangeDateDebut.value.start))
              && (!this.rangeDateDebut.value.end ||
                (this.rangeDateDebut.value.end &&
                  new Date(p.dateDebutPrevue) < this.rangeDateDebut.value.end)) &&
              (!this.rangeDateFin.value.start ||
                (this.rangeDateFin.value.start && new Date(p.dateFinPrevue) > this.rangeDateFin.value.start))
              && (!this.rangeDateFin.value.end ||
                (this.rangeDateFin.value.end &&
                  new Date(p.dateFinPrevue) < this.rangeDateFin.value.end)))
              projets.push(p);
          })
        } else if (d.id == 2) {
          projets2.forEach(p => {
            filtre=true;
            if ((!this.rangeDateDebut.value.start ||
                (this.rangeDateDebut.value.start && new Date(p.dateDebutReelle) > this.rangeDateDebut.value.start))
              && (!this.rangeDateDebut.value.end ||
                (this.rangeDateDebut.value.end &&
                  new Date(p.dateDebutReelle) < this.rangeDateDebut.value.end)) &&
              (!this.rangeDateFin.value.start ||
                (this.rangeDateFin.value.start && new Date(p.dateFinReelle) > this.rangeDateFin.value.start))
              && (!this.rangeDateFin.value.end ||
                (this.rangeDateFin.value.end &&
                  new Date(p.dateFinReelle) < this.rangeDateFin.value.end)))
              projets.push(p);
          })
        }
        projets2 = projets;
        projets = [];
      })
    }
    if(this.portefeuilleSelectionnes&&this.portefeuilleSelectionnes.length>0) {
      projets2.forEach(p => {
        this.portefeuilleSelectionnes.forEach(pf=>{
          if(p.familleProjet.codeFamille==pf.codeFamille)
            projets.push(p);
        })
      });
      filtre=true;
      projets2=projets;
      projets=[];
    }
    if(this.chefsSelectionnes&&this.chefsSelectionnes.length>0) {
      projets2.forEach(p => {
        this.chefsSelectionnes.forEach(c=>{
          if(p.chefProjet.codeRessource==c.id)
            projets.push(p);
        })
      });
      filtre=true;
      projets2=projets;
      projets=[];
    }
    if(this.statutsSelectionnes&&this.statutsSelectionnes.length>0) {
      projets2.forEach(p => {
        this.statutsSelectionnes.forEach(s=>{
          if(p.statut==s.valeur)
            projets.push(p);
        })
      });
      filtre=true;
      projets2=projets;
      projets=[];
    }
    if(this.risquesSelectionnes&&this.risquesSelectionnes.length>0) {
      projets2.forEach(p => {
        p.risques.forEach(rp=>{
          this.risquesSelectionnes.forEach(r=>{
            let niveau=rp.severity*rp.probabilite/100
            if((r.id==0&&niveau>=0&&niveau<=33) || (r.id==1&&niveau>=34&&niveau<=66) || (r.id==2&&niveau>=67&&niveau<=100))
            {
              let found=false;
              projets.forEach(p1=>{
                if(p1.codeProjet==p.codeProjet)
                  found=true;
              })
              if(!found)
                projets.push(p);
            }
          })
        })
      });
      filtre=true;
      projets2=projets;
      projets=[];
    }
    if(this.minNbRisques) {
      projets2.forEach(p => {
        let nbRisques=p.risques.length;
        if(nbRisques>=this.minNbRisques)
          projets.push(p)
      });
      filtre=true;
      projets2=projets;
      projets=[];
    }
    if(this.maxNbRisques) {
      projets2.forEach(p => {
        let nbRisques=p.risques.length;
        if(nbRisques<=this.maxNbRisques)
          projets.push(p)
      });
      filtre=true;
      projets2=projets;
      projets=[];
    }
    if(this.estComplet==true) {
      projets2.forEach(p => {
        if(p.avancement==100)
          projets.push(p);
      });
      filtre=true;
      projets2=projets;
      projets=[];
    }
    if(this.estEnRetard==true) {
      projets2.forEach(p => {
        if(p.dateFinPrevue>p.dateFinPlanifiee)
          projets.push(p);
      });
      filtre=true;
      projets2=projets;
      projets=[];
    }
    {
      projets2.forEach(p => {
        if(p.coutInitial>=this.minCoutInitial&&
          p.coutInitial<=this.maxCoutInitial&&
          p.coutReel>=this.minCoutReel&&
          p.coutReel<=this.maxCoutReel)
          projets.push(p);
      });
      projets2=projets;
      projets=[];
    }
    if(this.priorite!=3) {
      projets2.forEach(p => {
        if((this.priorite==0&&p.priorite.toString()=="Basse")||
          (this.priorite==1&&p.priorite.toString()=="Moyenne")||
          (this.priorite==2&&p.priorite.toString()=="Elevé"))
          projets.push(p);
      });
      filtre=true;
      projets2=projets;
      projets=[];
    }
    console.log(projets2)
    if(filtre) {
      this.eventDrivenService.publishEvent(
        {
          type: ProjectActionTypes.Filtre_Projets,
          payload: projets2
        }
      );
    }
    else {
      this.eventDrivenService.publishEvent(
        {
          type: ProjectActionTypes.Filtre_Non_Projets,
          payload: projets2
        }
      );
    }
  }

  checkComplet() {
    this.estComplet=!this.estComplet;
    this.Filtrer();
  }
  checkRetard() {
    this.estEnRetard=!this.estEnRetard;
    this.Filtrer();
  }
}
