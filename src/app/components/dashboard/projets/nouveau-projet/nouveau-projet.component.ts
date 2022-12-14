import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import htmlString = JQuery.htmlString;
import {RessourcesService} from "../../../../services/ressources.service";
import {PortefeuilleService} from "../../../../services/portefeuille.service";
import {ProjetsService} from "../../../../services/projets.service";
import {AuthentificationService} from "../../../../services/authentification.service";
import {Ressource} from "../../../../model/Ressource.model";
import {FamilleProjet} from "../../../../model/FamilleProjet.model";
import {Priorite, PrioriteMapping, Projet, Statut, StatutMapping} from "../../../../model/Projet.model";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {Risque} from "../../../../model/Risque.model";
import {NgxSmartModalService} from "ngx-smart-modal";
import {Tache} from "../../../../model/Tache.model";
import {Intervention} from "../../../../model/Intervention.model";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
declare var $:any
@Component({
  selector: 'app-nouveau-projet',
  templateUrl: './nouveau-projet.component.html',
  styleUrls: ['./nouveau-projet.component.css']
})
export class NouveauProjetComponent implements OnInit {
  textErreurDependancesTaches:string[]=new Array(10);
  risqueErr:boolean=false;
  codeExistant:boolean=false;
  nbTaches: number[] = [];
  nbInterventionParTaches: any[]=new Array();
  taches:Tache[]=new Array();
  piecesJointesValid:boolean=true;
  infoGeneralesValid:boolean=true;
  tachesValid:boolean=true;
  predecesseursValid:boolean=true;
  predecesseursInvalid:string='';
  risquesF:Risque[]=new Array();
  risquesM:Risque[]=new Array();
  risques:Risque[]=new Array();
  selectedFiles;
  progress;
  currentFileUpload;
  private currentTime: number;
  user:Ressource;
  dateFinPlanifiee:Date;
  dateDebutPlanifiee:Date;
  dateRelle;
  datePrevue;
  avancement:number;
  projetFormGroup:FormGroup;
  submitted=false;
  chef:Ressource=undefined;
  intervenants:Ressource[]=null;
  statut:string=null;
  priorite:string=null;
  portefeuille:FamilleProjet=null;
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
              private router:Router,
              private messageService: MessageService,) {

  }

  //dropdown priorit??-----------------------------------
  configDropdownPriorite={
    placeholder:'Priorit??',
    displayFn:(item: any) => { return item.valeur } ,//to support flexible text displaying for each item
  }
  dropdownOptionsPriorite=[
    {nom:this.Priorite[0],valeur:this.PrioriteMapping[0]},
    {nom:this.Priorite[1],valeur:this.PrioriteMapping[1]},
    {nom:this.Priorite[2],valeur:this.PrioriteMapping[2]},
  ];
  selectionChangedPriorite($event: any) {
   this.priorite=$event.value.valeur;
  }
  //dropdown priorit??-----------------------------------

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
   this.statut=$event.value.valeur;
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
    noResultsFound: 'Aucun r??sultat obtenu !' ,// text to be displayed when no items are found while searching
    searchPlaceholder:'Rechercher' ,// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false ,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
  }
  dropdownOptionsChefProjet;
  selectionChangedChefProjet($event: any) {
    this.chef=$event.value;
  }
  //dropdown ChefProjet-----------------------------------

  //dropdown Tache m??re-----------------------------------
  configDropdownTacheMere={
    placeholder:'T??che m??re',
    search:true,
    displayFn:(item: any) => { return item.titre } ,//to support flexible text displaying for each item
    displayKey:"display", //if objects array passed which key to be displayed defaults to description
    height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    // limitTo:2, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
    moreText: 'autres' ,// text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'Aucun r??sultat obtenu !' ,// text to be displayed when no items are found while searching
    searchPlaceholder:'Rechercher' ,// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false ,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
  }
  dropdownOptionsTacheMere:any[]=new Array();
  //dropdown Tache m??re-----------------------------------

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
    noResultsFound: 'Aucun r??sultat obtenu !' ,// text to be displayed when no items are found while searching
    searchPlaceholder:'Rechercher' ,// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false ,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
  }
  dropdownOptionsIntervenantsTache:Ressource[]=this.intervenants;
  //dropdown Intervenants Tache-----------------------------------

  //dropdown Tache m??re-----------------------------------
  configDropdownTacheDependances={
    placeholder:'D??pendances',
    search:true,
    displayFn:(item: any) => { return item.titre } ,//to support flexible text displaying for each item
    displayKey:"display", //if objects array passed which key to be displayed defaults to description
    height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    // limitTo:2, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
    moreText: 'autres' ,// text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'Aucun r??sultat obtenu !' ,// text to be displayed when no items are found while searching
    searchPlaceholder:'Rechercher' ,// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false ,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
  }
  dropdownOptionsTacheDependances:any[]=new Array();
  //dropdown Tache m??re-----------------------------------

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
    noResultsFound: 'Aucun r??sultat obtenu !' ,// text to be displayed when no items are found while searching
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
    this.taches.forEach(t => {
      t.interventions.forEach(i => {
        let found = false;
        this.intervenants.forEach(intervenant => {
          if (i.intervenant.codeRessource == intervenant.codeRessource)
            found = true;
        })
        if (found == false) {
          this.addSingleDanger("Erreur", "L'intervenant \"" + i.intervenant.nom + " " + i.intervenant.prenom + "\" que vous essayez de supprimer intervient dans la t??che \"" + t.titre + "\"")
          this.intervenants.push(i.intervenant)
        }
      })
    })
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
    noResultsFound: 'Aucun r??sultat obtenu !' ,// text to be displayed when no items are found while searching
    searchPlaceholder:'Rechercher' ,// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false ,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
    scroll:true,
  }
  dropdownOptionsPortefeuille;
  selectionChangedPortefeuille($event: any) {
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
    noResultsFound: 'Aucun r??sultat obtenu !' ,// text to be displayed when no items are found while searching
    searchPlaceholder:'Rechercher' ,// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false ,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
    scroll:true,
  }
  dropdownOptionsPredecesseurs;
  selectionChangedPredecesseurs($event: any) {
    this.predecesseurs=$event.value;
    this.predecesseursValid=true;
    this.predecesseursInvalid='';
    if(this.predecesseurs!=null) {
      this.predecesseurs.forEach(p => {
        if (p.dateFinPrevue > this.dateDebutPlanifiee) {
          this.predecesseursValid = false;
          this.predecesseursInvalid += p.titreProjet + ", "
        }
      })
    }
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
      let filename=event.target.files[0].name;
      var extn = filename.split(".").pop();
      if(extn!="png"&&extn!="jpg"&&extn!="jpeg"&&extn!="jpeg"&&extn!="doc"&&extn!="docx"&&extn!="pdf"&&extn!="text"&&extn!="csv"&&extn!="xls"&&extn!="xlsx") {
        this.addSingleDanger("Erreur !", "Veuillez fournir un format de pi??ces jointe valide:\n 'jpg', 'png', 'jpeg', 'doc', 'docx', 'pdf', 'text', 'csv','xls', 'xlsx!")
        this.piecesJointes[number].pieceJointe=null;
        $("#pieceJointe"+number).val(null);
        $("#custom-file-label"+number).text("Glissez la pi??ce jointe");
      }
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
      "<i  id=\"deletePieceJointe"+this.nbPiecesJointes+"\" data-toggle='tooltip' title='Supprimer la pi??ce jointe' class=\"fa-solid fa-rectangle-xmark\"></i>"+
      "          <div class=\"custom-file\">\n"+
      "            <input  accept=\"image/x-png,image/gif,image/jpeg,application/pdf,.csv,s application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +
      " application/vnd.ms-excel,text/plain,.doc,.docx,application/vnd.ms-powerpoint\" " +
      "id=\"pieceJointe"+this.nbPiecesJointes+"\" name=\"pieceJointe"+this.nbPiecesJointes+"\" type=\"file\"  class=\"custom-file-input\" >\n" +
      "            <label class=\"custom-file-label\" id='custom-file-label"+this.nbPiecesJointes+"' for=\"pieceJointe"+this.nbPiecesJointes+"\">Glissez la pi??ce jointe</label>\n" +
      "          </div>\n" +
      "          <div class=\"form-group desc-pieceJointe\">\n" +
      "          <textarea rows=\"2\" placeholder=\"Description de la pi??ce jointe\" class=\"form-control \"\n" +
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
    this.nbRisquesFaibles++;
    this.titreRisqueF=$("#titreRisqueF").val();
    this.probaRisqueF=$("#probaRisqueF").val();
    this.descriptionRisqueF=$("#descriptionRisqueF").val();
    let r=new Risque();
    r.titre=this.titreRisqueF;
    r.probabilite=this.probaRisqueF;
    r.severite='Faible';
    r.description=this.descriptionRisqueF;
    this.risquesF[this.nbRisquesFaibles-1]=r;
    console.log(this.risquesF);
    var risque=$("<div id=\"risqueFaible-"+this.nbRisquesFaibles+"\" class=\"ligne-risque-container\">\n" +
      "              <i id=\"deleteRisqueFaible"+this.nbRisquesFaibles+"\" class=\"fa-solid fa-x\"></i>\n" +
      "              <div id=\"ligne-risque-btn\" class=\"ligne-risque-btn\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapseRisqueFaible"+this.nbRisquesFaibles+"\" aria-expanded=\"false\">\n" +
      "                <button  data-toggle=\"Tooltip\" titre=\"D??tails\" id=\"ligne-risque\" class=\"ligne-risque btn form-control\">\n" +
      "                  <span id=\"titre-risque-btn\" class=\"titre-risque-btn\"> "+this.titreRisqueF+"</span><span id=\"proba-risque-btn\" class=\"proba-risque-btn\">\n" +
      "                  "+this.probaRisqueF +"% <i class=\"fa-solid fa-angle-down\"></i></span>\n" +
      "                </button>\n" +
      "              </div>\n" +
      "            </div>\n" +
      "            <div class=\"collapse\" id=\"collapseRisqueFaible"+this.nbRisquesFaibles+"\" >\n" +
      "              <div class=\"card card-body\">\n" +
      this.descriptionRisqueF+
      "              </div>\n" +
      "            </div>")
    $("#risquesFaibles").append(risque);
    const deleteButton = document.getElementById('deleteRisqueFaible'+this.nbRisquesFaibles);
    deleteButton.addEventListener('click', () => {
      deleteButton.parentElement.remove();
      this.risquesF[+(deleteButton.parentElement.id.split("-").pop()) -1]=undefined;
      console.log(this.risquesF);
      //alert(deleteButton.parentElement.id.split("-").pop());
      // !!!!!!!! --> pour avoir le num??ro du risque utile pour un usage dans un tableau
    });
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
    this.nbRisquesMoyens++;
    this.titreRisqueM=$("#titreRisqueM").val();
    this.probaRisqueM=$("#probaRisqueM").val();
    this.descriptionRisqueM=$("#descriptionRisqueM").val();
    let r=new Risque();
    r.titre=this.titreRisqueM;
    r.probabilite=this.probaRisqueM;
    r.severite='Moyen';
    r.description=this.descriptionRisqueM;
    this.risquesM[this.nbRisquesMoyens-1]=r;
    console.log(this.risquesM);
    var risqueM=$("<div id=\"risqueMoyen-"+this.nbRisquesMoyens+"\" class=\"ligne-risque-container\">\n" +
      "              <i data-toggle='tooltip' title='Supprimer le risque' id=\"deleteRisqueMoyen"+this.nbRisquesMoyens+"\" class=\"fa-solid fa-x\"></i>\n" +
      "              <div id=\"ligne-risque-btn\" class=\"ligne-risque-btn ligne-risqueM-btn\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapseRisqueMoyen"+this.nbRisquesMoyens+"\" aria-expanded=\"false\">\n" +
      "                <button  data-toggle=\"Tooltip\" titre=\"D??tails\" id=\"ligne-risqueM\" class=\"ligne-risqueM btn form-control\">\n" +
      "                  <span id=\"titre-risque-btn\" class=\"titre-risque-btn\"> "+this.titreRisqueM+"</span><span id=\"proba-risque-btn\" class=\"proba-risque-btn\">\n" +
      "                  "+this.probaRisqueM +"% <i class=\"fa-solid fa-angle-down\"></i></span>\n" +
      "                </button>\n" +
      "              </div>\n" +
      "            </div>\n" +
      "            <div class=\"collapse\" id=\"collapseRisqueMoyen"+this.nbRisquesMoyens+"\" >\n" +
      "              <div class=\"card card-body\">\n" +
      this.descriptionRisqueM+
      "              </div>\n" +
      "            </div>")
    $("#risquesMoyens").append(risqueM);
    const deleteButton = document.getElementById('deleteRisqueMoyen'+this.nbRisquesMoyens);
    deleteButton.addEventListener('click', () => {
      deleteButton.parentElement.remove();
      this.risquesM[+(deleteButton.parentElement.id.split("-").pop()) -1]=undefined;
      console.log(this.risquesM);
      //alert(deleteButton.parentElement.id.split("-").pop());
      // !!!!!!!! --> pour avoir le num??ro du risque utile pour un usage dans un tableau
    });
    $("#modalRisqueMoyen").close();
    this.titreRisqueM=null;
    this.probaRisqueM=null;
    this.descriptionRisqueM=null;
  }
  //Risque Moyen--------------------------------------------------------


  //Risque --------------------------------------------------------
  probaRisque:number;
  sevRisque:number;
  titreRisque:string='';
  descriptionRisque:string='';
  nbRisques:number=0;
  ajoutRisque(){
    this.nbRisques++;
    let r=new Risque();
    r.titre=this.titreRisque;
    r.probabilite=this.probaRisque;
    r.severity=this.sevRisque;
    r.description=this.descriptionRisque;
    this.risques[this.nbRisques-1]=r;
    console.log(this.risques);
    let niveau=this.probaRisque*this.sevRisque/100
    let n="";
    if(niveau<=33)
      n="F"
    else if(niveau<=66)
      n="M"
    else
      n="E"
    var risque=$("<div id=\"risque-"+this.nbRisques+"\" class=\"ligne-risque-container\">\n" +
      "              <i data-toggle='tooltip' title='Supprimer le risque' id=\"deleteRisque"+this.nbRisques+"\" class=\"fa-solid fa-x\"></i>\n" +
      "              <div id=\"ligne-risque"+n+"-btn\" class=\"ligne-risque"+n+"-btn ligne-risque-btn\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapseRisque"+this.nbRisques+"\" aria-expanded=\"false\">\n" +
      "                <button  data-toggle=\"Tooltip\" titre=\"D??tails\" id=\"ligne-risque\" class=\"ligne-risque"+n+" btn form-control\">\n" +
      "                  <span id=\"titre-risque-btn\" class=\"titre-risque-btn\"> "+this.titreRisque+"</span><span id=\"proba-risque-btn\" class=\"proba-risque-btn\">\n" +
      "                  "+ niveau+"% <i class=\"fa-solid fa-angle-down\"></i></span>\n" +
      "                </button>\n" +
      "              </div>\n" +
      "            </div>\n" +
      "            <div class=\"collapse\" id=\"collapseRisque"+this.nbRisques+"\" >\n" +
      "              <div class=\"card card-body\">\n" +
      this.descriptionRisque+"<p class='risqueproba'>S??v??rit?? du risque: "+this.sevRisque+"%</p>"+
      "<p class='risqueproba'>Probabilit?? du risque: "+this.probaRisque+"%</p>"+
      "              </div>\n" +
      "            </div>")
    if(niveau<=33)
    $("#risquesFaibles").append(risque);
    else if(niveau<=66)
    $("#risquesMoyens").append(risque);
    else
    $("#risquesEleves").append(risque);
    const deleteButton = document.getElementById('deleteRisque'+this.nbRisques);
    deleteButton.addEventListener('click', () => {
      deleteButton.parentElement.remove();
      this.risques[+(deleteButton.parentElement.id.split("-").pop()) -1]=undefined;
      console.log(this.risques);
    });
    $("#modalRisque").close();
    this.titreRisque=null;
    this.probaRisque=null;
    this.descriptionRisque=null;
    this.sevRisque=null;
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

  addRow(){
    this.nbTaches.push(this.nbTaches.length)
    this.taches[this.nbTaches.length-1]=new Tache();
    this.taches[this.nbTaches.length-1].idTache=this.nbTaches.length-1;
    this.nbInterventionParTaches[this.nbTaches.length-1]=[];
    this.taches[this.nbTaches.length-1].interventions=[]
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
    $("#tr"+n).remove();
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
    this.taches[number].tacheMere=$event.value;
  }
  selectionChangedTacheDependances($event,number) {
    this.taches[number].dependances=$event.value;
    this.textErreurDependancesTaches[number]='';
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
    $("#intervention"+indiceTache+"-"+indiceIntervention).remove();
    this.taches[indiceTache].interventions[indiceIntervention]=null;
  }
  affectationTacheChange(event,indiceTache,indiceIntervention){
    this.taches[indiceTache].interventions[indiceIntervention].affectation=event.target.value;
  }
  ngOnInit(): void {
    // this.addRow();

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
      this.dropdownOptionsPredecesseurs=projets;
    })
    this.authService.getUserbyEmail(this.authService.getEmail()).subscribe(user=>
    {
      this.user=user;
      if(this.authService.estChefDeProjet())
        this.chef=user;
    })
    this.projetFormGroup=this.fb.group({
      codeProjet: ["",Validators.required],
      titreProjet: ["", Validators.required],
      description: ["", Validators.required],
      dateDebutPlanifiee: [""],
      dateDebutRelle: [""],
      dateDebutPrevue: [""],
      dateFinPlanifiee: [""],
      dateFinPrevue: [""],
      dateFinRelle: [""],
      priorite: [""],
      avancement: [""],
      coutInitial: [""],
      coutReel: [""],
      statut: [""],
      familleProjet: [""],
      predecesseurs: [""],
      chefProjet: [""],
      intervenants: [""],
    });
    console.log(this.StatutMapping[0])
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
    });
    this.javaScriptForm();
    this.imageJavaScript()
  }
  //
  // datesChangePlanifiee() {
  //   if(this.dateRelle.startDate==null)
  //     this.datePrevue=this.datePlanifiee;
  // }
  // datesChangeRelle() {
  //   if(this.dateRelle.startDate!=null)
  //   {
  //     this.datePrevue=this.dateRelle;
  //     this.avancement=100;
  //   }
  // }
  // datesChangePrevue() {
  //   if(this.avancement==100&&this.datePrevue.startDate!=null)
  //     this.dateRelle=this.datePrevue;
  // }
  // avancementChange()
  // {
  //   if(this.avancement==100&&this.datePrevue.startDate!=null)
  //     this.dateRelle=this.datePrevue;
  // }
  onSelectedFile(event) {
    this.selectedFiles=event.target.files;
    let filename=this.selectedFiles.item(0).name;
    var extn = filename.split(".").pop();
    if(extn!="png"&&extn!="jpg"&&extn!="jpeg") {
      this.addSingleDanger("Erreur !", "Veuillez fournir un format d'image valide !")
      this.selectedFiles=null;
      $("#wizard-picture").val(null);
      $('#wizardPicturePreview').attr('src', "")
    }

  }
  enregistrer() {
    this.piecesJointesValid=true;
    this.infoGeneralesValid=true;
    this.tachesValid=true;
    this.submitted=true;
    for(let i=0;i<this.piecesJointes.length;i++)
    {
      if(this.piecesJointes[i]==undefined||((this.piecesJointes[i].pieceJointe==null||this.piecesJointes[i].desc=='')&&this.piecesJointes[i].deleted==false))
      {
        var validationPieceJointe=$("<p id='validationPJ"+i+"' style='color:red;font-size: 0.9rem;'>*Remplissez les champs ou supprimez la piece jointe !</p>")
        $("#pieceJointeC"+i).append(validationPieceJointe);
        this.piecesJointesValid=false;
      }
    }
    this.taches.forEach(
      t=> {
        console.log("this.toDate(t.dateDebutPlanifiee)")
        console.log(this.toDate(t.dateDebutPlanifiee))
        console.log("this.toDate(this.dateDebutPlanifiee)")
        console.log(this.toDate(this.dateDebutPlanifiee))
        if (t.titre == null || t.titre == ''
          || t.description == null || t.description == ''
          || t.avancement>100 || t.avancement<0
          || t.dateDebutPlanifiee == null || t.dateDebutPlanifiee == ''
          || t.dateFinPlanifiee == null || t.dateFinPlanifiee == ''
          || this.toDate(t.dateDebutPlanifiee) > this.toDate(t.dateFinPlanifiee)
          || this.toDate(t.dateDebutPlanifiee)<this.toDate(this.dateDebutPlanifiee)
          || this.toDate(t.dateFinPlanifiee)>this.toDate(this.dateFinPlanifiee)
          || t.tacheMere != null && (this.toDate(t.dateDebutPlanifiee) < this.toDate(t.tacheMere.dateDebutPlanifiee))) {
          this.tachesValid = false;
        }
        let nbDep: number = 0;
        this.textErreurDependancesTaches[t.idTache]=''
        if (t.dependances != null) {
          t.dependances.forEach(d => {
            if (new Date(t.dateDebutPlanifiee) < new Date(d.dateFinPlanifiee)) {
              nbDep++;
              if (nbDep == 1) {
                this.textErreurDependancesTaches[t.idTache] = d.titre;
              } else if(nbDep==2){
                this.textErreurDependancesTaches[t.idTache] = "*Les d??pendances : \"" + this.textErreurDependancesTaches[t.idTache] + "\", \"" + d.titre;
              } else{
                this.textErreurDependancesTaches[t.idTache] = this.textErreurDependancesTaches[t.idTache] + ", \"" + d.titre;
              }
            }
          })
          if (nbDep == 1) {
            this.textErreurDependancesTaches[t.idTache] = "*La d??pendance : " + this.textErreurDependancesTaches[t.idTache] +
              " ne peut pas d??buter avant la t??che d??pendante: " + t.titre+" !";
            this.tachesValid = false;
          } else if (nbDep > 0) {
            this.textErreurDependancesTaches[t.idTache] = this.textErreurDependancesTaches[t.idTache]+
              "\" ne peuvent pas d??buter avant la t??che d??pendante: \"" + t.titre+"\" !";
            this.tachesValid = false;
          }
        }
      }
    );
    if(this.predecesseurs!=null) {
      this.predecesseursInvalid='';
      this.predecesseurs.forEach(p => {
        if (p.dateFinPrevue > this.dateDebutPlanifiee) {
          this.predecesseursValid = false;
          this.predecesseursInvalid += p.titreProjet + ", "
        }
      })
    }

    if(this.projetFormGroup.invalid||
      // this.datePrevue.startDate==null||
      // this.datePlanifiee.startDate==null||
      // this.avancement==null||
      this.chef==null||
      this.statut==null||
      this.priorite==null||
      this.portefeuille==null||
    this.dateDebutPlanifiee>this.dateFinPlanifiee)
    {
      this.infoGeneralesValid=false;
    }
    if(!this.infoGeneralesValid||!this.piecesJointesValid||!this.tachesValid||!this.predecesseursValid)
      return;
    else{
      this.projetFormGroup.controls.dateDebutPlanifiee.setValue(this.dateDebutPlanifiee);
      // if(this.dateRelle.startDate!=null)
      //   this.projetFormGroup.controls.dateDebutRelle.setValue(this.dateRelle.startDate.toDate());
      // this.projetFormGroup.controls.dateDebutPrevue.setValue(this.datePrevue.startDate.toDate());
      this.projetFormGroup.controls.dateFinPlanifiee.setValue(this.dateFinPlanifiee);
      // this.projetFormGroup.controls.dateFinPrevue.setValue(this.datePrevue.endDate.toDate());
      // if(this.dateRelle.endDate!=null)
      //   this.projetFormGroup.controls.dateFinRelle.setValue(this.dateRelle.endDate.toDate());
      // this.projetFormGroup.controls.avancement.setValue(this.avancement);
      this.projetFormGroup.controls.coutInitial.setValue(this.coutInitial);
      this.projetFormGroup.controls.coutReel.setValue(this.coutReel);
      this.projetFormGroup.controls.chefProjet.setValue(this.chef);
      this.projetFormGroup.controls.intervenants.setValue(this.intervenants);
      this.projetFormGroup.controls.statut.setValue(this.statut);
      this.projetFormGroup.controls.priorite.setValue(this.priorite);
      this.projetFormGroup.controls.familleProjet.setValue(this.portefeuille);
      this.projetFormGroup.controls.predecesseurs.setValue(this.predecesseurs);

      this.projetsService.save(this.projetFormGroup.value).subscribe(
        data=>{
          if(data==false)
          {
            this.codeExistant=true;
            this.infoGeneralesValid=false;
            return;
          }
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
              alert("Probl??me de chargement");
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
                alert("Probl??me de chargement");
              })
            }
          })

          //Risques-------------------------------------------------------------------------------
          // this.risquesF.forEach(rf=>
          // {
          //   if(rf!=undefined)
          //   {
          //     this.projetsService.addRisque(rf,this.projetFormGroup.controls.codeProjet.value).subscribe(
          //       data=>
          //       {
          //         // alert("done !");
          //       }
          //     )
          //   }
          // })
          // this.risquesM.forEach(rf=>
          // {
          //   if(rf!=undefined)
          //   {
          //     this.projetsService.addRisque(rf,this.projetFormGroup.controls.codeProjet.value).subscribe(
          //       data=>
          //       {
          //         // alert("done !");
          //       }
          //     )
          //   }
          // })
          this.risques.forEach(rf=>
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
          console.log(this.taches)
          this.taches.forEach(t=>
          {
            if(t!=null) {
              t.dateDebutPrevue=t.dateDebutPlanifiee;
              t.dateFinPrevue=t.dateFinPlanifiee;
              if(t.avancement>0)
                t.dateDebutRelle=t.dateDebutPlanifiee;
              taches.push(t);
            }

          })
          console.log(taches)
          this.projetsService.ajouterTaches(this.projetFormGroup.controls.codeProjet.value,taches).subscribe();
          this.router.navigateByUrl("/projets/liste-projets")
        }
      );


    }
  }

  dateDebutPlanifieeChange() {
    this.predecesseursValid=true;
    this.predecesseursInvalid='';
    if(this.predecesseurs!=null) {
      this.predecesseurs.forEach(p => {
        if (p.dateFinPrevue > this.dateDebutPlanifiee) {
          this.predecesseursValid = false;
          this.predecesseursInvalid += p.titreProjet + ", "
        }
      })
    }
  }
  toDate(date):Date
  {
    return new Date(date);
  }
  addSingleDanger(summary,detail) {
    this.messageService.add({severity:'error', summary:summary, detail:detail});
  }
}
