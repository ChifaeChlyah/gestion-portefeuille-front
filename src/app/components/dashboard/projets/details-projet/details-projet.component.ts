import { Component, OnInit } from '@angular/core';
import {Tache} from "../../../../model/Tache.model";
import {Risque} from "../../../../model/Risque.model";
import {Ressource} from "../../../../model/Ressource.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FamilleProjet} from "../../../../model/FamilleProjet.model";
import {Priorite, PrioriteMapping, Projet, Statut, StatutMapping} from "../../../../model/Projet.model";
import {RessourcesService} from "../../../../services/ressources.service";
import {PortefeuilleService} from "../../../../services/portefeuille.service";
import {ProjetsService} from "../../../../services/projets.service";
import {AuthentificationService} from "../../../../services/authentification.service";
import {Intervention} from "../../../../model/Intervention.model";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../../environments/environment";
import {DatePipe} from "@angular/common";
import {PieceJointe} from "../../../../model/PieceJointe.model";
declare var $:any;
@Component({
  selector: 'app-details-projet',
  templateUrl: './details-projet.component.html',
  styleUrls: ['./details-projet.component.css']
})
export class DetailsProjetComponent implements OnInit {
  ditionnaireIdTaches=new Map<number,number>();
  codeProjet:string;
  description:string;
  titreProjet:string;
  editMode:boolean=false;
  editModePlanning:boolean=false;
  editModeIntervenants:boolean=false;
  editModePredecesseurs:boolean=false;
  dateDebutPlanifiee;
  dateFinPlanifiee;
  dateDebutPrevue;
  dateFinPrevue;
  dateDebutRelle;
  dateFinRelle;
  projet:Projet;
  host=environment.host;
  nbTaches: number[] = [];
  nbInterventionParTaches: any[]=new Array();
  taches:Tache[]=new Array(1);
  piecesJointesValid:boolean=true;
  infoGeneralesValid:boolean=true;
  risquesF:Risque[]=new Array();
  risquesM:Risque[]=new Array();
  risquesE:Risque[]=new Array();
  selectedFiles;
  progress;
  currentFileUpload;
  private currentTime: number;
  user:Ressource;
  datePlanifiee;
  dateRelle;
  datePrevue;
  avancement:number;
  projetFormGroup:FormGroup;
  submitted=false;
  chef:Ressource=undefined;
  intervenants:Ressource[]=null;
  statut=null;
  priorite=null;
  portefeuille=null;
  predecesseurs:Projet[]=null;
  coutInitial:number;
  coutReel:number;
  piecesJointes:any[]=new Array();
  public StatutMapping = StatutMapping;
  public Statuts = Object.values(Statut);
  public PrioriteMapping = PrioriteMapping;
  public Priorite = Object.values(Priorite);

  constructor(public fb: FormBuilder,private ressourceService:RessourcesService
    ,private portefeuilleService:PortefeuilleService,private projetsService:ProjetsService,
              public authService:AuthentificationService,
              private projetService:ProjetsService,
              private route: ActivatedRoute,
              public datepipe: DatePipe) {

  }

  //dropdown priorité-----------------------------------
  configDropdownPriorite={
    placeholder:'Priorité',
    displayFn:(item: any) => { return item.valeur } ,//to support flexible text displaying for each item
  }
  dropdownOptionsPriorite=[
    {nom:this.Priorite[0],valeur:this.PrioriteMapping[0]},
    {nom:this.Priorite[1],valeur:this.PrioriteMapping[1]},
    {nom:this.Priorite[2],valeur:this.PrioriteMapping[2]},
  ];
  selectionChangedPriorite($event: any) {
    if(Array.isArray($event.value))
      this.priorite=null;
    else
    this.priorite=$event.value;
  }
  //dropdown priorité-----------------------------------

  //dropdown Statut-----------------------------------
  configDropdownStatut={
    placeholder:'Statut',
    displayFn:(item: any) => { return item.valeur } ,//to support flexible text displaying for each item
  }
  dropdownOptionsStatut=[
    {nom:this.Statuts[0],valeur:this.StatutMapping[0]},
    {nom:this.Statuts[1],valeur:this.StatutMapping[1]},
    {nom:this.Statuts[2],valeur:this.StatutMapping[2]},
    {nom:this.Statuts[3],valeur:this.StatutMapping[3]},
    {nom:this.Statuts[4],valeur:this.StatutMapping[4]},
    {nom:this.Statuts[5],valeur:this.StatutMapping[5]},
    {nom:this.Statuts[6],valeur:this.StatutMapping[6]},
  ];
  selectionChangedStatut($event: any) {
    if(Array.isArray($event.value))
      this.statut=null;
    else
    this.statut=$event.value;
  }
  //dropdown Statut-----------------------------------

  //dropdown ChefProjet-----------------------------------
  configDropdownChefProjet={
    placeholder:'Chef de projet',
    search:true,
    displayFn:(item: any) => { return item.nom+" "+item.prenom; } ,//to support flexible text displaying for each item
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
  dropdownOptionsChefProjet;
  selectionChangedChefProjet($event: any) {
    console.log("Array.isArray($event.value)")
    console.log(Array.isArray($event.value))
    if(Array.isArray($event.value))
      this.chef=null;
    else
      this.chef=$event.value;
  }
  //dropdown ChefProjet-----------------------------------

  //dropdown Tache mère-----------------------------------
  configDropdownTacheMere={
    placeholder:'Tâche mère',
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
  dropdownOptionsTacheMere:any[]=new Array();
  //dropdown Tache mère-----------------------------------

  //dropdown Intervenants Tache-----------------------------------
  configDropdownIntervenantsTache={
    placeholder:'Intervenants',
    search:true,
    displayFn:(item: any) => { return item.nom+" "+item.prenom } ,//to support flexible text displaying for each item
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
  dropdownOptionsIntervenantsTache:Ressource[]=this.intervenants;
  //dropdown Intervenants Tache-----------------------------------

  //dropdown Tache mère-----------------------------------
  configDropdownTacheDependances={
    placeholder:'Dépendances',
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
  dropdownOptionsTacheDependances:any[]=new Array();
  //dropdown Tache mère-----------------------------------

  //dropdown Intervenants-----------------------------------
  configDropdownIntervenants={
    multiple:true,
    placeholder:'Intervenants',
    search:true,
    displayFn:(item: any) => { return item.nom+" "+item.prenom; } ,//to support flexible text displaying for each item
    displayKey:"display", //if objects array passed which key to be displayed defaults to description
    height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    moreText: 'autres' ,// text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'Aucun résultat obtenu !' ,// text to be displayed when no items are found while searching
    searchPlaceholder:'Rechercher' ,// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false ,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
    scroll:true,
  }
  dropdownOptionsIntervenants;
  selectionChangedIntervenants($event: any) {
    this.intervenants=$event.value;
    this.dropdownOptionsIntervenantsTache=this.intervenants;
    console.log(this.intervenants)
  }
  //dropdown Intervenants-----------------------------------

  //dropdown Portefeuille-----------------------------------
  configDropdownPortefeuille={
    placeholder:'Portefeuille',
    search:true,
    displayFn:(item: any) => { return item.titreFamille } ,//to support flexible text displaying for each item
    displayKey:"display", //if objects array passed which key to be displayed defaults to description
    height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    moreText: 'autres' ,// text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'Aucun résultat obtenu !' ,// text to be displayed when no items are found while searching
    searchPlaceholder:'Rechercher' ,// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false ,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
    scroll:true,
  }
  dropdownOptionsPortefeuille;
  selectionChangedPortefeuille($event: any) {
    if(Array.isArray($event.value))
      this.portefeuille=null;
    else
    this.portefeuille=$event.value;
  }
  //dropdown Portefeuille-----------------------------------

  //dropdown Predecesseurs-----------------------------------
  configDropdownPredecesseurs={
    placeholder:'Predecesseurs',
    search:true,
    multiple:true,
    displayFn:(item: any) => { return item.titreProjet } ,//to support flexible text displaying for each item
    displayKey:"display", //if objects array passed which key to be displayed defaults to description
    height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    moreText: 'autres' ,// text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'Aucun résultat obtenu !' ,// text to be displayed when no items are found while searching
    searchPlaceholder:'Rechercher' ,// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false ,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
    scroll:true,
  }
  dropdownOptionsPredecesseurs;
  selectionChangedPredecesseurs($event: any) {
    console.log("changed")
    this.predecesseurs=$event.value;
  }
  //dropdown Portefeuille-----------------------------------











  //piece jointe---------------------------------------------------------
  nbPiecesJointes=0;
  JavaScriptShowNameOfFile(number:number) {
    $('.piecesJointes-container').on('change', '#pieceJointe' + number, function () {
      var fileName = $("#pieceJointe" + number).val().split("\\").pop();
      $("#pieceJointe" + number).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
  }
  DeletePiecejointe(number:number) {
    $('.piecesJointes-container').on('click', '#deletePieceJointe' + number, (event)=> {
      if(this.piecesJointes[number]!=undefined)
        this.piecesJointes[number].deleted=true;
      else
        this.piecesJointes[number]={pieceJointe:null,desc:'',deleted:true}
      $("#pieceJointeC" + number).remove();
    });
  }
  ChangePiecejointe(number:number) {
    $('.piecesJointes-container').on('change', '#pieceJointe' + number, (event)=> {
      if(this.piecesJointes[number]!=undefined)
        this.piecesJointes[number].pieceJointe=event.target.files[0];
      else
        this.piecesJointes[number]={pieceJointe:event.target.files[0],desc:'',deleted:false}
      $("#validationPJ"+number).remove();
      console.log(this.piecesJointes);
    });
  }
  ChangeDescPiecejointe(number:number) {
    $('.piecesJointes-container').on('change', '#descriptionPieceJointe' + number, (event)=> {
      if(this.piecesJointes[number]!=undefined)
        this.piecesJointes[number].desc=event.target.value;
      else
        this.piecesJointes[number]={pieceJointe:null,desc:event.target.value,deleted:false}
      $("#validationPJ"+number).remove();
      console.log(this.piecesJointes);
    });
  }
  addPieceJointe() {
    var pieceJointe=$("<div id=\"pieceJointeC"+this.nbPiecesJointes+"\" class=\"pieceJointe\">\n" +
      "<i  id=\"deletePieceJointe"+this.nbPiecesJointes+"\" data-toggle='tooltip' title='Supprimer la pièce jointe' class=\"fa-solid fa-rectangle-xmark\"></i>"+
      "          <div class=\"custom-file\">\n"+
      "            <input id=\"pieceJointe"+this.nbPiecesJointes+"\" name=\"pieceJointe"+this.nbPiecesJointes+"\" type=\"file\"  class=\"custom-file-input\" >\n" +
      "            <label class=\"custom-file-label\" for=\"pieceJointe"+this.nbPiecesJointes+"\">Glissez la pièce jointe</label>\n" +
      "          </div>\n" +
      "          <div class=\"form-group desc-pieceJointe\">\n" +
      "          <textarea rows=\"2\" placeholder=\"Description de la pièce jointe\" class=\"form-control \"\n" +
      "                id=\"descriptionPieceJointe"+this.nbPiecesJointes+"\"></textarea>\n" +
      "          </div>\n" +
      "          </div>");
    $(".piecesJointes-container").append(pieceJointe);
    this.nbPiecesJointes++;
    this.piecesJointes[this.nbPiecesJointes-1]=undefined;
    for (let i = 0; i < this.nbPiecesJointes; i++) {
      this.JavaScriptShowNameOfFile(i);
      this.DeletePiecejointe(i);
      this.ChangePiecejointe(i);
      this.ChangeDescPiecejointe(i);
    }
  }
  //piece jointe---------------------------------------------------------

  //Risque Faible--------------------------------------------------------
  titreRisqueF:string='';
  probaRisqueF:number;
  descriptionRisqueF:string='';
  nbRisquesFaibles:number=0;

  ajoutRisqueF(){
    let r=new Risque();
    r.titre=this.titreRisqueF;
    r.probabilite=this.probaRisqueF;
    r.severite='Faible';
    r.description=this.descriptionRisqueF;
    this.projetsService.addRisque(r,this.codeProjet).subscribe(
      data=>
      {
        this.projetService.getProjetByCode(this.codeProjet).subscribe(
          p=>{
            this.projet=p;
          }
        )
      }
    )
    $("#modalRisqueFaible").close();
    this.titreRisqueF=null;
    this.probaRisqueF=null;
    this.descriptionRisqueF=null;
  }
  //Risque Faible--------------------------------------------------------

  //Risque Moyen--------------------------------------------------------
  titreRisqueM:string='';
  probaRisqueM:number;
  descriptionRisqueM:string='';
  nbRisquesMoyens:number=0;
  ajoutRisqueM(){
    let r=new Risque();
    r.titre=this.titreRisqueM;
    r.probabilite=this.probaRisqueM;
    r.severite='Moyen';
    r.description=this.descriptionRisqueM;
    this.projetsService.addRisque(r,this.codeProjet).subscribe(
      data=>
      {
        this.projetService.getProjetByCode(this.codeProjet).subscribe(
          p=>{
            this.projet=p;
          }
        )
      }
    )
    $("#modalRisqueMoyen").close();
    this.titreRisqueM=null;
    this.probaRisqueM=null;
    this.descriptionRisqueM=null;
  }
  //Risque Moyen--------------------------------------------------------


  //Risque élevé--------------------------------------------------------
  probaRisqueE:number;
  titreRisqueE:string='';
  descriptionRisqueE:string='';
  nbRisquesEleves:number=0;
  ajoutRisqueE(){
    let r=new Risque();
    r.titre=this.titreRisqueE;
    r.probabilite=this.probaRisqueE;
    r.severite='Elevé';
    r.description=this.descriptionRisqueE;
    this.projetsService.addRisque(r,this.codeProjet).subscribe(
      data=>
      {
        this.projetService.getProjetByCode(this.codeProjet).subscribe(
          p=>{
            this.projet=p;
          }
        )
      }
    )
    $("#modalRisqueEleve").close();
    this.titreRisqueE=null;
    this.probaRisqueE=null;
    this.descriptionRisqueE=null;
  }
  //Risque Moyen--------------------------------------------------------
  javaScriptForm()
  {
    $(document).ready(function() {
      // Test for placeholder support
      $.support.placeholder = (function(){
        var i = document.createElement('input');
        return 'placeholder' in i;
      })();

      // Hide labels by default if placeholders are supported
      if($.support.placeholder) {
        $('.form-label').each(function(){
          $(this).addClass('js-hide-label');
        });

        // Code for adding/removing classes here
        $('.form-group').find('input, textarea').on('keyup blur focus', function(e){

          // Cache our selectors
          var $this = $(this),
            $label = $this.parent().find("label");

          switch(e.type) {
            case 'keyup': {
              $label.toggleClass('js-hide-label', $this.val() == '');
            } break;
            case 'blur': {
              if( $this.val() == '' ) {
                $label.addClass('js-hide-label');
              } else {
                $label.removeClass('js-hide-label').addClass('js-unhighlight-label');
              }
            } break;
            case 'focus': {
              if( $this.val() !== '' ) {
                $label.removeClass('js-unhighlight-label');
              }
            } break;
            default: break;
          }
          // previous implementation with ifs
          /*if (e.type == 'keyup') {
              if( $this.val() == '' ) {
                  $parent.addClass('js-hide-label');
              } else {
                  $parent.removeClass('js-hide-label');
              }
          }
          else if (e.type == 'blur') {
              if( $this.val() == '' ) {
                  $parent.addClass('js-hide-label');
              }
              else {
                  $parent.removeClass('js-hide-label').addClass('js-unhighlight-label');
              }
          }
          else if (e.type == 'focus') {
              if( $this.val() !== '' ) {
                  $parent.removeClass('js-unhighlight-label');
              }
          }*/
        });
      }
    });
  }
  imageJavaScript()
  {
    $(document).ready(function(){
// Prepare the preview for profile picture
      $("#wizard-picture").change(function(){
        readURL(this);
      });
    });
    function readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
          $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
        }
        reader.readAsDataURL(input.files[0]);
      }
    }
  }

  addRow(tache=new Tache()){
    this.nbTaches.push(this.nbTaches.length)
    this.taches[this.nbTaches.length-1]=tache;
    this.nbInterventionParTaches[this.nbTaches.length-1]=new Array();
    if(tache.idTache==null){
      this.taches[this.nbTaches.length-1].interventions=new Array();
    }
    this.ditionnaireIdTaches.set(tache.idTache,this.nbTaches.length-1);
    this.taches[this.nbTaches.length-1].idTache=this.nbTaches.length-1;
    if(tache.interventions.length>0)
    {
      for(let i=0;i<tache.interventions.length;i++)
        this.nbInterventionParTaches[this.nbTaches.length-1].push(i)
    }
    for(let j=0;j<this.taches.length;j++)
    {
      let t=new Array()
      for(let i=0;i<j;i++)
      {
        if(this.nbTaches[i]!=null)
          t.push(this.taches[i])
      }
      this.dropdownOptionsTacheMere[j]=t;
      this.dropdownOptionsTacheDependances[j]=t;
    }
  }
  removeRow(event,n){
    let dep;
    dep=false;
    this.taches.forEach(t=>{

      if(t.tacheMere!=null&&t.tacheMere.idTache==this.taches[n].idTache)
        dep=true;
      t.dependances.forEach(d=>{
        if(d.idTache==this.taches[n].idTache)
          dep=true;
      });
    });
    if(dep==true)
    {
      var alert=$("<div class=\"alert alert-danger alert-dismissible\">\n" +
        "             <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n" +
        "             <strong>Suppression impossible !</strong> Veuillez d'abord supprimer les dépendances liées à la taches .\n" +
        "           </div>");
      $("#alerts-container").append(alert);
    }
    else
      this.taches[n]=null;
  }
  titreTacheChange(event,number)
  {
    this.taches[number].titre=event.target.value;
  }
  descTacheChange(event,number)
  {
    this.taches[number].description=event.target.value;
  }
  avancementTacheChange(event,number)
  {
    this.taches[number].avancement=event.target.value;
  }
  coutInitialTacheChange(event,number)
  {
    this.taches[number].coutInitial=event.target.value;
  }
  coutReelTacheChange(event,number)
  {
    this.taches[number].coutReel=event.target.value;
  }
  dateDebutPlanifieeTacheChange(event,number)
  {
    this.taches[number].dateDebutPlanifiee=event.target.value;
  }
  dateFinPlanifieeTacheChange(event,number)
  {
    this.taches[number].dateFinPlanifiee=event.target.value;
  }
  dateDebutPrevueTacheChange(event,number)
  {
    this.taches[number].dateDebutPrevue=event.target.value;
  }
  dateFinPrevueTacheChange(event,number)
  {
    this.taches[number].dateFinPrevue=event.target.value;
  }
  dateDebutRelleTacheChange(event,number)
  {
    this.taches[number].dateDebutRelle=event.target.value;
  }
  dateFinRelleTacheChange(event,number)
  {
    this.taches[number].dateFinRelle=event.target.value;
  }

  selectionChangedTacheMere($event,number) {
    if(Array.isArray($event.value))
      this.taches[number].tacheMere=null;
    else
    this.taches[number].tacheMere=$event.value;
  }
  selectionChangedTacheDependances($event,number) {
    this.taches[number].dependances=$event.value;
  }
  selectionChangedIntervenantTache($event,indiceTache,indiceIntervention)
  {
    this.taches[indiceTache].interventions[indiceIntervention].intervenant=$event.value;
  }
  addIntervention(n)
  {
    this.nbInterventionParTaches[n].push(this.nbInterventionParTaches[n].length)
    this.taches[n].interventions[this.nbInterventionParTaches[n].length-1]=new Intervention();
  }
  removeIntervention(event,indiceTache,indiceIntervention){
    // $("#intervention"+indiceTache+"-"+indiceIntervention).remove();
    this.taches[indiceTache].interventions[indiceIntervention]=null;

  }
  affectationTacheChange(event,indiceTache,indiceIntervention){
    this.taches[indiceTache].interventions[indiceIntervention].affectation=event.target.value;
  }
  ngOnInit(): void {
    this.javaScriptForm();
    this.codeProjet = this.route.snapshot.paramMap.get('codeProjet')
    this.projetService.getProjetByCode(this.codeProjet).subscribe(
      p=>{
        console.log(p)
        this.projet=p;
        console.log("projetdebut")
        console.log(this.projet)
        this.projetFormGroup=this.fb.group({
          codeProjet: [p.codeProjet,Validators.required],
          titreProjet: [p.titreProjet, Validators.required],
          description: [p.description, Validators.required],
          dateDebutPlanifiee: [this.datepipe.transform(this.projet.dateDebutPlanifiee, 'yyyy-MM-dd')],
          dateDebutPrevue: [this.datepipe.transform(this.projet.dateDebutPrevue, 'yyyy-MM-dd')],
          dateFinPlanifiee: [this.datepipe.transform(this.projet.dateFinPlanifiee, 'yyyy-MM-dd')],
          dateFinRelle: [this.datepipe.transform(this.projet.dateFinReelle, 'yyyy-MM-dd')],
          dateDebutRelle: [this.datepipe.transform(this.projet.dateDebutReelle, 'yyyy-MM-dd')],
          dateFinPrevue: [this.datepipe.transform(this.projet.dateFinPrevue, 'yyyy-MM-dd')],
          priorite: [p.priorite],
          avancement: [p.avancement],
          coutInitial: [p.coutInitial],
          coutReel: [p.coutReel],
          statut: [p.statut],
          familleProjet: [p.familleProjet],
          predecesseurs: [p.predecesseurs],
          chefProjet: [p.chefProjet],
          intervenants: [p.intervenants],
        });
        this.imageJavaScript();
        this.avancement=p.avancement;
        this.coutInitial=p.coutInitial;
        this.coutReel=p.coutReel;
        this.chef=p.chefProjet;
        this.portefeuille=p.familleProjet;
        this.statut={nom:this.Statuts[(Object.keys(StatutMapping)).find(key => StatutMapping[key] === p.statut)],valeur:this.StatutMapping[(Object.keys(StatutMapping)).find(key => StatutMapping[key] === p.statut)]}
        this.priorite={nom:this.Priorite[(Object.keys(PrioriteMapping)).find(key => PrioriteMapping[key] === p.priorite)],valeur:this.PrioriteMapping[(Object.keys(PrioriteMapping)).find(key => PrioriteMapping[key] === p.priorite)]}
        this.titreProjet=p.titreProjet;
        this.description=p.description;
        this.dateDebutPlanifiee=this.datepipe.transform(this.projet.dateDebutPlanifiee, 'yyyy-MM-dd')
        this.dateDebutPrevue=this.datepipe.transform(this.projet.dateDebutPrevue, 'yyyy-MM-dd')
        this.dateFinPlanifiee=this.datepipe.transform(this.projet.dateFinPlanifiee, 'yyyy-MM-dd')
        this.dateFinRelle=this.datepipe.transform(this.projet.dateFinReelle, 'yyyy-MM-dd')
        this.dateDebutRelle=this.datepipe.transform(this.projet.dateDebutReelle, 'yyyy-MM-dd')
        this.dateFinPrevue=this.datepipe.transform(this.projet.dateFinPrevue, 'yyyy-MM-dd')
        this.intervenants=p.intervenants;
        this.dropdownOptionsIntervenantsTache=this.intervenants;
        this.predecesseurs=p.predecesseurs;
        this.initTaches();
        console.log(this.taches)
      }
    )

    this.ressourceService.tousLesChef().subscribe(chefs=>
    {
      this.dropdownOptionsChefProjet=chefs
    })
    this.ressourceService.tous().subscribe(intervenants=>
    {
      this.dropdownOptionsIntervenants=intervenants;
    })
    this.portefeuilleService.tousLesPortefeuilles().subscribe(portefeuilles=>
    {
      this.dropdownOptionsPortefeuille=portefeuilles;
    })
    this.projetsService.tousLesProjets().subscribe(projets=>
    {
      this.dropdownOptionsPredecesseurs=new Array();
      projets.forEach(p=>{
        if(p.codeProjet!=this.codeProjet)
          this.dropdownOptionsPredecesseurs.push(p);
      })
    })
    this.authService.getUserbyEmail(this.authService.getEmail()).subscribe(user=>
    {
      this.user=user;
      if(this.authService.estChefDeProjet())
        this.chef=user;
    })

    console.log(this.StatutMapping[0])
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
    });
    // this.imageJavaScript()
  }
  initTaches()
  {
    this.taches=[];
    this.nbTaches=new Array();
    this.nbInterventionParTaches=new Array();
    this.projet.taches.forEach(tache=>
    {
      tache.dateDebutPlanifiee=this.datepipe.transform(tache.dateDebutPlanifiee, 'yyyy-MM-dd');
      tache.dateFinPlanifiee=this.datepipe.transform(tache.dateFinPlanifiee, 'yyyy-MM-dd');
      tache.dateDebutPrevue=this.datepipe.transform(tache.dateDebutPrevue, 'yyyy-MM-dd');
      tache.dateFinPrevue=this.datepipe.transform(tache.dateFinPrevue, 'yyyy-MM-dd');
      tache.dateDebutRelle=this.datepipe.transform(tache.dateDebutRelle, 'yyyy-MM-dd');
      tache.dateFinRelle=this.datepipe.transform(tache.dateFinRelle, 'yyyy-MM-dd');
      this.addRow(tache);
    })
    this.taches.forEach(t=>
    {

      t.dependances.forEach(d=>{
        if(d!=null)
          d.idTache=this.ditionnaireIdTaches.get(d.idTache);
      })
      if(t.tacheMere!=null)
        t.tacheMere.idTache=this.ditionnaireIdTaches.get(t.tacheMere.idTache);
    })
  }
  datesChangePlanifiee() {
    if(this.dateRelle.startDate==null)
      this.datePrevue=this.datePlanifiee;
  }
  datesChangeRelle() {
    if(this.dateRelle.startDate!=null)
    {
      this.datePrevue=this.dateRelle;
      this.avancement=100;
    }
  }
  datesChangePrevue() {
    if(this.avancement==100&&this.datePrevue.startDate!=null)
      this.dateRelle=this.datePrevue;
  }
  avancementChange()
  {
    if(this.avancement==100&&this.datePrevue.startDate!=null)
      this.dateRelle=this.datePrevue;
  }
  onSelectedFile(event) {
    this.selectedFiles=event.target.files;
  }
  enregistrer() {
    this.piecesJointesValid=true;
    this.infoGeneralesValid=true;
    for(let i=0;i<this.piecesJointes.length;i++)
    {
      if(this.piecesJointes[i]==undefined||((this.piecesJointes[i].pieceJointe==null||this.piecesJointes[i].desc=='')&&this.piecesJointes[i].deleted==false))
      {
        var validationPieceJointe=$("<p id='validationPJ"+i+"' style='color:red;font-size: 0.9rem;'>*Remplissez les champs ou supprimez la piece jointe !</p>")
        $("#pieceJointeC"+i).append(validationPieceJointe);
        this.piecesJointesValid=false;
      }
    }

    this.submitted=true;
    if(this.projetFormGroup.invalid||
      this.piecesJointesValid==false||
      this.datePrevue.startDate==null||
      this.datePlanifiee.startDate==null||
      this.avancement==null||
      this.chef==null||
      this.statut==null||
      this.priorite==null||
      this.portefeuille==null)
    {
      this.infoGeneralesValid=false;
      return;
    }

    else{
      this.projetFormGroup.controls.dateDebutPlanifiee.setValue(this.datePlanifiee.startDate.toDate());
      if(this.dateRelle.startDate!=null)
        this.projetFormGroup.controls.dateDebutRelle.setValue(this.dateRelle.startDate.toDate());
      this.projetFormGroup.controls.dateDebutPrevue.setValue(this.datePrevue.startDate.toDate());
      this.projetFormGroup.controls.dateFinPlanifiee.setValue(this.datePlanifiee.endDate.toDate());
      this.projetFormGroup.controls.dateFinPrevue.setValue(this.datePrevue.endDate.toDate());
      if(this.dateRelle.endDate!=null)
        this.projetFormGroup.controls.dateFinRelle.setValue(this.dateRelle.endDate.toDate());
      this.projetFormGroup.controls.avancement.setValue(this.avancement);
      this.projetFormGroup.controls.coutInitial.setValue(this.coutInitial);
      this.projetFormGroup.controls.coutReel.setValue(this.coutReel);
      this.projetFormGroup.controls.chefProjet.setValue(this.chef);
      this.projetFormGroup.controls.intervenants.setValue(this.intervenants);
      this.projetFormGroup.controls.statut.setValue(this.statut.valeur);
      this.projetFormGroup.controls.priorite.setValue(this.priorite.valeur);
      this.projetFormGroup.controls.familleProjet.setValue(this.portefeuille);
      this.projetFormGroup.controls.predecesseurs.setValue(this.predecesseurs);
      this.projetsService.save(this.projetFormGroup.value).subscribe(
        data=>{
          //logo------------------------------------------------------------------------------
          if(this.selectedFiles!=undefined)
          {
            this.progress = 0;
            this.currentFileUpload = this.selectedFiles.item(0)
            this.projetsService.uploadLogo(this.currentFileUpload, this.projetFormGroup.controls.codeProjet.value).subscribe(event => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round(100 * event.loaded / event.total);
              } else if (event instanceof HttpResponse) {
                //console.log(this.router.url);
                //this.getProducts(this.currentRequest);
                //this.refreshUpdatedProduct();
                this.currentTime=Date.now();
              }
            },err=>{
              alert("Problème de chargement");
            })
            // this.selectedFiles = undefined
          }
          //pieces jointes------------------------------------------------------------------------------
          this.piecesJointes.forEach(p=>{
            if(p.deleted==false)
            {
              this.projetsService.addPieceJointe(p, this.projetFormGroup.controls.codeProjet.value).subscribe(event => {
                if (event.type === HttpEventType.UploadProgress) {
                  // this.progress = Math.round(100 * event.loaded / event.total);
                } else if (event instanceof HttpResponse) {
                  // this.currentTime=Date.now();
                }
              },err=>{
                alert("Problème de chargement");
              })
            }
          })

          //Risques-------------------------------------------------------------------------------
          this.risquesF.forEach(rf=>
          {
            if(rf!=undefined)
            {
              this.projetsService.addRisque(rf,this.projetFormGroup.controls.codeProjet.value).subscribe(
                data=>
                {
                  // alert("done !");
                }
              )
            }
          })
          this.risquesM.forEach(rf=>
          {
            if(rf!=undefined)
            {
              this.projetsService.addRisque(rf,this.projetFormGroup.controls.codeProjet.value).subscribe(
                data=>
                {
                  // alert("done !");
                }
              )
            }
          })
          this.risquesE.forEach(rf=>
          {
            if(rf!=undefined)
            {
              this.projetsService.addRisque(rf,this.projetFormGroup.controls.codeProjet.value).subscribe(
                data=>
                {
                  // alert("done !");
                }
              )
            }
          })
          //taches--------------------------------------------------------------------------------
          let taches:Tache[]=new Array();
          this.taches.forEach(t=>
          {
            if(t!=null)
              taches.push(t);
          })
          this.projetsService.ajouterTaches(this.projetFormGroup.controls.codeProjet.value,taches).subscribe();
        }
      );
    }
  }


  annulerEdit()
  {
    this.editMode=false;
    this.avancement=this.projet.avancement;
    this.coutInitial=this.projet.coutInitial;
    this.coutReel=this.projet.coutReel;
    this.chef=this.projet.chefProjet;
    this.portefeuille=this.projet.familleProjet;
    this.statut={nom:this.Statuts[(Object.keys(StatutMapping)).find(key => StatutMapping[key] === this.projet.statut)],valeur:this.StatutMapping[(Object.keys(StatutMapping)).find(key => StatutMapping[key] === this.projet.statut)]}
    this.priorite={nom:this.Priorite[(Object.keys(PrioriteMapping)).find(key => PrioriteMapping[key] === this.projet.priorite)],valeur:this.PrioriteMapping[(Object.keys(PrioriteMapping)).find(key => PrioriteMapping[key] === this.projet.priorite)]}
    this.titreProjet=this.projet.titreProjet;
    this.description=this.projet.description;
    this.dateDebutPlanifiee=this.datepipe.transform(this.projet.dateDebutPlanifiee, 'yyyy-MM-dd')
    this.dateDebutPrevue=this.datepipe.transform(this.projet.dateDebutPrevue, 'yyyy-MM-dd')
    this.dateFinPlanifiee=this.datepipe.transform(this.projet.dateFinPlanifiee, 'yyyy-MM-dd')
    this.dateFinRelle=this.datepipe.transform(this.projet.dateFinReelle, 'yyyy-MM-dd')
    this.dateDebutRelle=this.datepipe.transform(this.projet.dateDebutReelle, 'yyyy-MM-dd')
    this.dateFinPrevue=this.datepipe.transform(this.projet.dateFinPrevue, 'yyyy-MM-dd')
    var alert=$("<div class=\"alert alert-secondary alert-dismissible\">\n" +
      "             <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n" +
      "             <strong>Annulé !</strong> Vos modifications ont été annulées.\n" +
      "           </div>");
    $("#alerts-container2").append(alert);
  }
  saveEdit(){
    this.submitted=true;
    console.log(this.chef)
    if(this.avancement==null
        ||this.coutInitial==null
        ||this.chef==null
        ||this.portefeuille==null
        ||this.titreProjet==null
        ||this.description==null
        ||this.titreProjet==""
        ||this.description==""
        ||this.dateDebutPlanifiee==null
        ||this.dateDebutPrevue==null
        ||this.dateFinPlanifiee==null
        ||this.dateFinPrevue==null
        ||this.dateDebutPlanifiee==""
        ||this.dateDebutPrevue==""
        ||this.dateFinPlanifiee==""
        ||this.dateFinPrevue==""
        ||this.statut.valeur==null
        ||this.priorite.valeur==null)
    {
      console.log('invalid')
      console.log(this.coutInitial==null);
      console.log(this.coutReel==null);
      console.log(this.chef==null);
      console.log(this.portefeuille==null);
      console.log(this.titreProjet==null);
      console.log(this.description==null);
      console.log(this.dateDebutPlanifiee==null);
      console.log(this.dateDebutPrevue==null);
      console.log(this.dateFinPlanifiee==null);
      console.log(this.dateFinPrevue==null);
      console.log(this.statut.value==null);
      console.log(this.priorite.value==null);
      return;
    }
    else {
      this.editMode=false;
      this.projet.avancement = this.avancement;
      this.projet.coutInitial = this.coutInitial;
      this.projet.coutReel = this.coutReel;
      this.projet.chefProjet = this.chef;
      this.projet.familleProjet = this.portefeuille;
      this.projet.titreProjet = this.titreProjet;
      this.projet.description = this.description;
      this.projet.dateDebutPlanifiee = this.dateDebutPlanifiee;
      this.projet.dateDebutPrevue = this.dateDebutPrevue;
      this.projet.dateFinPlanifiee = this.dateFinPlanifiee;
      this.projet.dateFinReelle = this.dateFinRelle;
      this.projet.dateDebutReelle = this.dateDebutRelle;
      this.projet.dateFinPrevue = this.dateFinPrevue;
      this.projet.statut = this.statut.valeur;
      this.projet.priorite = this.priorite.valeur;
      this.submitted=false;
      console.log("projetsave")
      console.log(this.projet)

      this.projetsService.update(this.projet).subscribe(
        data=> {
          console.log("here")
          //logo------------------------------------------------------------------------------
          if (this.selectedFiles != undefined) {
            this.progress = 0;
            this.currentFileUpload = this.selectedFiles.item(0)
            this.projetsService.uploadLogo(this.currentFileUpload, this.projetFormGroup.controls.codeProjet.value).subscribe(event => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round(100 * event.loaded / event.total);
              } else if (event instanceof HttpResponse) {
                //console.log(this.router.url);
                //this.getProducts(this.currentRequest);
                //this.refreshUpdatedProduct();
                this.currentTime = Date.now();
              }
            }, err => {
              alert("Problème de chargement");
            })
            // this.selectedFiles = undefined
          }
          var alert=$("<div class=\"alert alert-success alert-dismissible\">\n" +
            "             <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n" +
            "             <strong>Succès !</strong> Vos modifications ont bien été entregistées.\n" +
            "           </div>");
          $("#alerts-container2").append(alert);
        }
      );
    }
  }
  saveEditPlanning(){
      this.editModePlanning=false;
      this.projetService.deleteAllTaches(this.codeProjet).subscribe(data=>{
        let taches:Tache[]=new Array();
        this.taches.forEach(t=>
        {
          if(t!=null)
            taches.push(t);
        })
        this.projetsService.ajouterTaches(this.projetFormGroup.controls.codeProjet.value,taches).subscribe(
          data=>{
            this.projetService.getProjetByCode(this.codeProjet).subscribe(p=>{
              this.projet=p;
              this.initTaches();
              this.dropdownOptionsIntervenantsTache=this.projet.intervenants;
              var alert=$("<div class=\"alert alert-success alert-dismissible\">\n" +
                "             <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n" +
                "             <strong>Succès !</strong> Vos modifications ont bien été entregistées.\n" +
                "           </div>");
              $("#alerts-container").append(alert);
            })
          }
        );
      })
  }
  downloadPieceJointe(p:PieceJointe){
    window.open(this.host+"/pieceJointe/"+p.idPieceJointe);
  }

  deletePieceJointe(p: PieceJointe) {
    if(window.confirm('Etes-vous sûr de vouloir supprimer la piece jointe ?')){
      this.projetService.deletePiceJointe(p.idPieceJointe).subscribe(data=>
      {
        this.projetService.getProjetByCode(this.codeProjet).subscribe(
          p=> {
            console.log(p)
            this.projet = p;
          });
      })
    }
  }

  enregistrerPiecesJointes() {
    this.piecesJointesValid=true;
    for(let i=0;i<this.piecesJointes.length;i++)
    {
      if(this.piecesJointes[i]==undefined||((this.piecesJointes[i].pieceJointe==null||this.piecesJointes[i].desc=='')&&this.piecesJointes[i].deleted==false))
      {
        var validationPieceJointe=$("<p id='validationPJ"+i+"' style='color:red;font-size: 0.9rem;'>*Remplissez les champs ou supprimez la piece jointe !</p>")
        $("#pieceJointeC"+i).append(validationPieceJointe);
        this.piecesJointesValid=false;
      }
    }
    if(!this.piecesJointesValid)
      return;
    else {
      this.piecesJointes.forEach(p => {
        if (p.deleted == false) {
          this.projetsService.addPieceJointe(p, this.codeProjet).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              // this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              // this.currentTime=Date.now();
            }
            this.projetService.getProjetByCode(this.codeProjet).subscribe(
              p=> {
                console.log(p)
                this.projet = p;
              });
            this.piecesJointes=[];
            $(".piecesJointes-container").empty();
          }, err => {
            alert("Problème de chargement");
          })
        }
      })
    }
  }

  deleteRisque(idRisque: any) {
    if(window.confirm('Etes-vous sûr de vouloir supprimer le risque ?')){
      this.projetService.deleteRisque(idRisque).subscribe(data=>
      {
        this.projetService.getProjetByCode(this.codeProjet).subscribe(
          p=> {
            console.log(p)
            this.projet = p;
          });
      })
    }
  }

  annulerEditPlanning() {
    this.initTaches();
    this.editModePlanning=false;
    var alert=$("<div class=\"alert alert-secondary alert-dismissible\">\n" +
      "             <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n" +
      "             <strong>Annulé !</strong> Vos modifications ont été annulées.\n" +
      "           </div>");
    $("#alerts-container").append(alert);
  }

  saveEditIntervenants() {
    let impossible=false;
    this.projet.taches.forEach(t=>{
      t.interventions.forEach(i=>{
        let found=false;
        this.intervenants.forEach(intervenant=>{
          if(i.intervenant.codeRessource==intervenant.codeRessource)
            found=true;
        })
        if(found==false)
          impossible=true;
      })
    })
    if(impossible)
    {
      var alert=$("<div class=\"alert alert-danger alert-dismissible\">\n" +
        "             <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n" +
        "             <strong>Echec !</strong> L'un des intervenants que vous essayez de supprmier intervient dans l'une des taches du projet.\n" +
        "           </div>");
      $("#alerts-container-intervenants").append(alert);
      this.projetService.getProjetByCode(this.codeProjet).subscribe(p=>
      {
        this.projet=p;
        this.intervenants=this.projet.intervenants;
      })
    }
    else{
      this.projet.intervenants=this.intervenants;
      this.projetService.update(this.projet).subscribe(
        p=>{
          this.projet=p;
          var alert=$("<div class=\"alert alert-success alert-dismissible\">\n" +
            "             <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n" +
            "             <strong>Succès !</strong> Vos Modifications ont bien été enregistrées.\n" +
            "           </div>");
          $("#alerts-container-intervenants").append(alert);
        }
      )
    }
  }

  annulerEditIntervenants() {
    this.projetService.getProjetByCode(this.codeProjet).subscribe(p=>
    {
      this.projet=p;
      this.intervenants=this.projet.intervenants;
      var alert=$("<div class=\"alert alert-secondary alert-dismissible\">\n" +
        "             <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n" +
        "             <strong>Annulé !</strong> Vos modifications ont été annulées.\n" +
        "           </div>");
      $("#alerts-container-intervenants").append(alert);
    })
  }

  saveEditPredecesseurs() {
    this.projet.predecesseurs=this.predecesseurs;
    this.projetService.update(this.projet).subscribe(
      p=>{
        this.projet=p;
        var alert=$("<div class=\"alert alert-success alert-dismissible\">\n" +
          "             <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n" +
          "             <strong>Succès !</strong> Vos Modifications ont bien été enregistrées.\n" +
          "           </div>");
        $("#alerts-container-predecesseurs").append(alert);
        this.projetService.getProjetByCode(this.codeProjet).subscribe(p=> {
          this.projet = p;
          this.predecesseurs = this.projet.predecesseurs;
        });
        this.editModePredecesseurs=false;
      }
    )
  }

  annulerEditPredecesseurs() {
    this.editModePredecesseurs=false;
    this.projetService.getProjetByCode(this.codeProjet).subscribe(p=>
    {
      this.projet=p;
      this.predecesseurs=this.projet.predecesseurs;
      var alert=$("<div class=\"alert alert-secondary alert-dismissible\">\n" +
        "             <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n" +
        "             <strong>Annulé !</strong> Vos modifications ont été annulées.\n" +
        "           </div>");
      $("#alerts-container-predecesseurs").append(alert);
    })
  }
}
