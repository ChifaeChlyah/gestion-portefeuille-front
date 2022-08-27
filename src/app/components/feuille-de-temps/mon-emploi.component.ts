import { Component, OnInit } from '@angular/core';
import {Activite} from "../../model/Activite.model";
import {ProjetsService} from "../../services/projets.service";
import {RessourcesService} from "../../services/ressources.service";
import {AuthentificationService} from "../../services/authentification.service";
import {Ressource} from "../../model/Ressource.model";
import {Tache} from "../../model/Tache.model";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
declare var $ :any;
@Component({
  selector: 'app-mon-emploi',
  templateUrl: './mon-emploi.component.html',
  styleUrls: ['./mon-emploi.component.css']
})
export class MonEmploiComponent implements OnInit {
  activites: Activite[]=new Array();
  nbActivites: number[]=[];
  editMode:boolean ;
  user:Ressource;
  isMaFeuilleDeTempsPage:boolean=false;
  //dropdown Taches-----------------------------------
  configDropdownTaches={
    placeholder:'Tâches',
    search:true,
    displayFn:(item: any) => { return item.titre } ,//to support flexible text displaying for each item
    displayKey:"display", //if objects array passed which key to be displayed defaults to description
    height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    // limitTo:2, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
    moreText: 'autres' ,// text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'Aucun résultat obtenu !' ,// text to be displayed when no items are found while searching
    searchPlaceholder:'Rechercher' ,// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false ,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
  }
  dropdownOptionsTaches:Tache[];
  //dropdown Taches-----------------------------------
  page: any=1;
  pageSize: any=10;
  submitted: boolean=false;
  constructor(private ressourcesService:RessourcesService,public authService:AuthentificationService
  ,public datePipe:DatePipe,private router:Router,private route:ActivatedRoute,private messageService: MessageService) { }

  ngOnInit(): void {
    if(this.router.url=="/ma-feuille-de-temps")
      this.isMaFeuilleDeTempsPage=true;
    if(this.isMaFeuilleDeTempsPage) {
      this.authService.getUserbyEmail(this.authService.getEmail()).subscribe(
        user => {
          this.user = user;
          this.ressourcesService.tachesAffectes(user.codeRessource).subscribe(
            taches => {
              this.dropdownOptionsTaches = taches;
            }
          )
          this.initActivites();
        }
      )
    }
    else{
      this.ressourcesService.get(this.route.snapshot.paramMap.get('codeRessource')).subscribe(
        user=>{
          this.user=user;
          this.ressourcesService.tachesAffectes(user.codeRessource).subscribe(
            taches => {
              this.dropdownOptionsTaches = taches;
              this.initActivites();
            }
          )
        }
      )

    }
  }
  initActivites(){
    this.activites=new Array();
    this.nbActivites=[];
    this.ressourcesService.AllActivitesByUser(this.user.codeRessource).subscribe(
      activites=>{
        this.activites=activites;
        if(activites.length!=0)
        activites.forEach(a=>{
          this.addRow(a);
        })
      }
    )
  }
  dateChange($event, n: number) {
    this.activites[n].date=$event.target.value;
  }

  descriptionChange($event, n: number) {
    this.activites[n].description=$event.target.value;
  }
  addRow(activite=new Activite()) {
    this.nbActivites.push(this.nbActivites.length);
    this.activites[this.nbActivites.length-1]=activite;
  }
  removeRow($event, n: number) {
    this.activites[n]=null;
  }

  selectionChangedTaches($event: any, n: number) {
    if(Array.isArray($event.value))
      this.activites[n].tache=null;
    else
      this.activites[n].tache=$event.value;
  }

  saveEdit() {
    let activites:Activite[]=new Array();
    this.submitted=true;
    let activitesInvalides=false;
    this.activites.forEach(
      a=>{
        // @ts-ignore
        if(a.date==null||a.date==''
        ||a.description==null||a.description==''
        ||a.tache==null
        )
          activitesInvalides=true;
      }
    )
    if(!activitesInvalides) {
      this.activites.forEach(t => {
        if (t != null)
          activites.push(t);
      })
      this.ressourcesService.deleteAllActivites(this.user.codeRessource).subscribe(data => {
        this.ressourcesService.ajouterActivites(this.user.codeRessource, activites).subscribe(
          data => {
            this.initActivites();
            this.addSingleSuccess("Succès !", "Vos modifications ont bien été enregistrées.")
            this.editMode = false;
            this.submitted=false;
          })
      })
    }
  }
  annulerEdit() {
    this.initActivites();
    this.addSingleDanger("Annulé !", "Vos modifications ont été annulées.")
    this.editMode=false;
    this.submitted=false;
  }
  addSingleSuccess(summary, detail) {
    this.messageService.add({severity: 'success', summary: summary, detail: detail});
  }

  addSingleInfo(summary, detail) {
    this.messageService.add({severity: 'info', summary: summary, detail: detail});
  }

  addSingleDanger(summary, detail) {
    this.messageService.add({severity: 'error', summary: summary, detail: detail});
  }

}
