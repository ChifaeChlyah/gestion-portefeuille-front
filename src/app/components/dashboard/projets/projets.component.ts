import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {Options} from "@angular-slider/ngx-slider";
import {Router} from "@angular/router";
import {AuthentificationService} from "../../../services/authentification.service";
import {FormControl, FormGroup} from "@angular/forms";
import {DateAdapter, MAT_DATE_LOCALE} from "@angular/material/core";
import {Projet, StatutMapping} from "../../../model/Projet.model";
import {PortefeuilleService} from "../../../services/portefeuille.service";
import {RessourcesService} from "../../../services/ressources.service";
import {Ressource} from "../../../model/Ressource.model";
import {ProjetsService} from "../../../services/projets.service";
declare var $: any;
@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.css'],
})
export class ProjetsComponent implements OnInit {
  optionsCoutInitial: Options={ceil:500000,floor:0};
  minCoutReel: number=0;
  maxCoutReel: number=200000;
  minCoutInitial: number=0;
  maxCoutInitial: number=20000;
  FilterHidden: boolean=true;

  optionsCoutReel: Options={ceil:500,floor:0};
  tousLesChefs:Ressource[]
  tousLesProjets:Projet[]
  public StatutMapping = StatutMapping;
  constructor(private router:Router,public authService:AuthentificationService,
              private portefeuillesService:PortefeuilleService,
              private ressourcesService:RessourcesService, private projetsService:ProjetsService) {
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
  priorite: number = 2;
  optionsPriorite: Options = {
    ceil: 2,
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
      return '#880e4f';
    },
  };

  date2 = new Date();
  optionsDateRange: any/*IDateRangePickerOptions= {
    labelText: 'Date de début - Date de fin',
    format: 'DD-MM-YYYY',
  };*/


  ngOnInit() {
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
}
