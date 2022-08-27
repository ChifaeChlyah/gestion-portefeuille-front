import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {MatDialog} from "@angular/material/dialog";
import {DialogGanttComponent} from "./dialog-gantt/dialog-gantt.component";
import {ConfirmationService, MessageService} from "primeng/api";

declare var $:any;
@Component({
  selector: 'app-details-projet',
  templateUrl: './details-projet.component.html',
  styleUrls: ['./details-projet.component.css']
})
export class DetailsProjetComponent implements OnInit {
  @ViewChild('popup') popupElement: ElementRef;
  tachesValid:boolean=true;
  textErreurDependancesTaches:string[]=[]
  risqueErr:boolean=false;
  planningSubmitted:boolean=false;
  ditionnaireIdTaches = new Map<number, number>();
  predecesseursValid: boolean = true;
  predecesseursValidPlanifiee: boolean = true;
  predecesseursValidPrevue: boolean = true;
  predecesseursValidReelle: boolean = true;
  predecesseursInvalid: string = '';
  predecesseursInvalidPlanifiee: string = '';
  predecesseursInvalidPrevue: string = '';
  predecesseursInvalidReelle: string = '';
  codeProjet: string;
  description: string;
  titreProjet: string;
  editMode: boolean = false;
  editModePlanning: boolean = false;
  editModeIntervenants: boolean = false;
  editModePredecesseurs: boolean = false;
  dateDebutPlanifiee;
  dateFinPlanifiee;
  dateDebutPrevue;
  dateFinPrevue;
  dateDebutRelle;
  dateFinRelle;
  projet: Projet;
  host = environment.host;
  nbTaches: number[] = [];
  nbInterventionParTaches: any[] = new Array();
  taches: Tache[] = new Array(1);
  piecesJointesValid: boolean = true;
  infoGeneralesValid: boolean = true;
  risquesF: Risque[] = new Array();
  risquesM: Risque[] = new Array();
  risques: Risque[] = new Array();
  selectedFiles;
  progress;
  currentFileUpload;
  private currentTime: number;
  user: Ressource;
  datePlanifiee;
  dateRelle;
  datePrevue;
  avancement: number;
  projetFormGroup: FormGroup;
  submitted = false;
  chef: Ressource = undefined;
  intervenants: Ressource[] = null;
  statut = null;
  priorite = null;
  portefeuille = null;
  predecesseurs: Projet[] = null;
  coutInitial: number;
  coutReel: number;
  piecesJointes: any[] = new Array();
  public StatutMapping = StatutMapping;
  public Statuts = Object.values(Statut);
  public PrioriteMapping = PrioriteMapping;
  public Priorite = Object.values(Priorite);

  constructor(public fb: FormBuilder, private ressourceService: RessourcesService
    , private portefeuilleService: PortefeuilleService, private projetsService: ProjetsService,
              public authService: AuthentificationService,
              private projetService: ProjetsService,
              private route: ActivatedRoute,
              public datepipe: DatePipe,
              public dialog: MatDialog,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) {

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

  openDialog() {
    this.dialog.open(DialogGanttComponent, {
      data: {
        taches: this.taches,
        isDiagrammeDeTache: true
      },
    });
  }

  //dropdown priorité-----------------------------------
  configDropdownPriorite = {
    placeholder: 'Priorité',
    displayFn: (item: any) => {
      return item.valeur
    },//to support flexible text displaying for each item
  }
  dropdownOptionsPriorite = [
    {nom: this.Priorite[0], valeur: this.PrioriteMapping[0]},
    {nom: this.Priorite[1], valeur: this.PrioriteMapping[1]},
    {nom: this.Priorite[2], valeur: this.PrioriteMapping[2]},
  ];

  selectionChangedPriorite($event: any) {
    if (Array.isArray($event.value))
      this.priorite = null;
    else
      this.priorite = $event.value;
  }

  //dropdown priorité-----------------------------------

  //dropdown Statut-----------------------------------
  configDropdownStatut = {
    placeholder: 'Statut',
    displayFn: (item: any) => {
      return item.valeur
    },//to support flexible text displaying for each item
  }
  dropdownOptionsStatut = [
    {nom: this.Statuts[0], valeur: this.StatutMapping[0]},
    {nom: this.Statuts[1], valeur: this.StatutMapping[1]},
    {nom: this.Statuts[2], valeur: this.StatutMapping[2]},
    {nom: this.Statuts[3], valeur: this.StatutMapping[3]},
    {nom: this.Statuts[4], valeur: this.StatutMapping[4]},
    {nom: this.Statuts[5], valeur: this.StatutMapping[5]},
    {nom: this.Statuts[6], valeur: this.StatutMapping[6]},
  ];

  selectionChangedStatut($event: any) {
    if (Array.isArray($event.value))
      this.statut = null;
    else
      this.statut = $event.value;
  }

  //dropdown Statut-----------------------------------

  //dropdown ChefProjet-----------------------------------
  configDropdownChefProjet = {
    placeholder: 'Chef de projet',
    search: true,
    displayFn: (item: any) => {
      return item.nom + " " + item.prenom;
    },//to support flexible text displaying for each item
    displayKey: "display", //if objects array passed which key to be displayed defaults to description
    height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    customComparator: () => {
    }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    // limitTo:2, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
    moreText: 'autres',// text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'Aucun résultat obtenu !',// text to be displayed when no items are found while searching
    searchPlaceholder: 'Rechercher',// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
  }
  dropdownOptionsChefProjet;

  selectionChangedChefProjet($event: any) {
    console.log("Array.isArray($event.value)")
    console.log(Array.isArray($event.value))
    if (Array.isArray($event.value))
      this.chef = null;
    else
      this.chef = $event.value;
  }

  //dropdown ChefProjet-----------------------------------

  //dropdown Tache mère-----------------------------------
  configDropdownTacheMere = {
    placeholder: 'Tâche mère',
    search: true,
    displayFn: (item: any) => {
      return item.titre
    },//to support flexible text displaying for each item
    displayKey: "display", //if objects array passed which key to be displayed defaults to description
    height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    customComparator: () => {
    }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    // limitTo:2, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
    moreText: 'autres',// text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'Aucun résultat obtenu !',// text to be displayed when no items are found while searching
    searchPlaceholder: 'Rechercher',// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
  }
  dropdownOptionsTacheMere: any[] = new Array();
  //dropdown Tache mère-----------------------------------

  //dropdown Intervenants Tache-----------------------------------
  configDropdownIntervenantsTache = {
    placeholder: 'Intervenants',
    search: true,
    displayFn: (item: any) => {
      return item.nom + " " + item.prenom
    },//to support flexible text displaying for each item
    displayKey: "display", //if objects array passed which key to be displayed defaults to description
    height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    customComparator: () => {
    }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    // limitTo:2, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
    moreText: 'autres',// text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'Aucun résultat obtenu !',// text to be displayed when no items are found while searching
    searchPlaceholder: 'Rechercher',// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
  }
  dropdownOptionsIntervenantsTache: Ressource[] = this.intervenants;
  //dropdown Intervenants Tache-----------------------------------

  //dropdown Tache mère-----------------------------------
  configDropdownTacheDependances = {
    placeholder: 'Dépendances',
    search: true,
    displayFn: (item: any) => {
      return item.titre
    },//to support flexible text displaying for each item
    displayKey: "display", //if objects array passed which key to be displayed defaults to description
    height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    customComparator: () => {
    }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    // limitTo:2, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
    moreText: 'autres',// text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'Aucun résultat obtenu !',// text to be displayed when no items are found while searching
    searchPlaceholder: 'Rechercher',// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
  }
  dropdownOptionsTacheDependances: any[] = new Array();
  //dropdown Tache mère-----------------------------------

  //dropdown Intervenants-----------------------------------
  configDropdownIntervenants = {
    multiple: true,
    placeholder: 'Intervenants',
    search: true,
    displayFn: (item: any) => {
      return item.nom + " " + item.prenom;
    },//to support flexible text displaying for each item
    displayKey: "display", //if objects array passed which key to be displayed defaults to description
    height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    customComparator: () => {
    }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    moreText: 'autres',// text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'Aucun résultat obtenu !',// text to be displayed when no items are found while searching
    searchPlaceholder: 'Rechercher',// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
    scroll: true,
  }
  dropdownOptionsIntervenants;

  selectionChangedIntervenants($event: any) {
    this.intervenants = $event.value;
    this.dropdownOptionsIntervenantsTache = this.intervenants;
    console.log(this.intervenants)
    this.taches.forEach(t => {
      t.interventions.forEach(i => {
        let found = false;
        this.intervenants.forEach(intervenant => {
          if (i.intervenant.codeRessource == intervenant.codeRessource)
            found = true;
        })
        if (found == false) {
          this.addSingleDanger("Erreur", "L'intervenant \"" + i.intervenant.nom + " " + i.intervenant.prenom + "\" que vous essayez de supprimer intervient dans la tâche \"" + t.titre + "\"")
          this.intervenants.push(i.intervenant)
        }
      })
    })
  }
  //dropdown Intervenants-----------------------------------

  //dropdown Portefeuille-----------------------------------
  configDropdownPortefeuille = {
    placeholder: 'Portefeuille',
    search: true,
    displayFn: (item: any) => {
      return item.titreFamille
    },//to support flexible text displaying for each item
    displayKey: "display", //if objects array passed which key to be displayed defaults to description
    height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    customComparator: () => {
    }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    moreText: 'autres',// text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'Aucun résultat obtenu !',// text to be displayed when no items are found while searching
    searchPlaceholder: 'Rechercher',// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
    scroll: true,
  }
  dropdownOptionsPortefeuille;

  selectionChangedPortefeuille($event: any) {
    if (Array.isArray($event.value))
      this.portefeuille = null;
    else
      this.portefeuille = $event.value;
  }

  //dropdown Portefeuille-----------------------------------

  //dropdown Predecesseurs-----------------------------------
  configDropdownPredecesseurs = {
    placeholder: 'Predecesseurs',
    search: true,
    multiple: true,
    displayFn: (item: any) => {
      return item.titreProjet
    },//to support flexible text displaying for each item
    displayKey: "display", //if objects array passed which key to be displayed defaults to description
    height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    customComparator: () => {
    }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    moreText: 'autres',// text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'Aucun résultat obtenu !',// text to be displayed when no items are found while searching
    searchPlaceholder: 'Rechercher',// label thats displayed in search input,
    // searchOnKey: 'nom', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
    scroll: true,
  }
  dropdownOptionsPredecesseurs;

  selectionChangedPredecesseurs($event: any) {
    this.predecesseurs = $event.value;
    this.predecesseursValid = true;
    this.predecesseursInvalid = '';
    if (this.predecesseurs != null) {
      this.predecesseursInvalid = '';
      this.predecesseurs.forEach(p => {
        if (p.dateFinPlanifiee > this.dateDebutPlanifiee) {
          this.predecesseursValid = false;
          this.predecesseursInvalid += p.titreProjet + "(dates planifiées), "
          return;
        } else if (p.dateFinPrevue > this.dateDebutPrevue) {
          this.predecesseursValid = false;
          this.predecesseursInvalid += p.titreProjet + "(dates prévues), "
          return;
        } else if (p.dateFinReelle > this.dateDebutRelle) {
          this.predecesseursValid = false;
          this.predecesseursInvalid += p.titreProjet + "(dates réelles), "
          return;
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
        this.addSingleDanger("Erreur !", "Veuillez fournir un format de pièces jointe valide:\n 'jpg', 'png', 'jpeg', 'doc', 'docx', 'pdf', 'text', 'csv','xls', 'xlsx!")
        this.piecesJointes[number].pieceJointe=null;
        $("#pieceJointe"+number).val(null);
        $("#custom-file-label"+number).text("Glissez la pièce jointe");
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
      "<i  id=\"deletePieceJointe"+this.nbPiecesJointes+"\" data-toggle='tooltip' title='Supprimer la pièce jointe' class=\"fa-solid fa-rectangle-xmark\"></i>"+
      "          <div class=\"custom-file\">\n"+
      "            <input  accept=\"image/x-png,image/gif,image/jpeg,application/pdf,.csv,s application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +
      " application/vnd.ms-excel,text/plain,.doc,.docx,application/vnd.ms-powerpoint\" " +
      "id=\"pieceJointe"+this.nbPiecesJointes+"\" name=\"pieceJointe"+this.nbPiecesJointes+"\" type=\"file\"  class=\"custom-file-input\" >\n" +
      "            <label class=\"custom-file-label\" id='custom-file-label"+this.nbPiecesJointes+"' for=\"pieceJointe"+this.nbPiecesJointes+"\">Glissez la pièce jointe</label>\n" +
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
  titreRisqueF: string = '';
  probaRisqueF: number;
  descriptionRisqueF: string = '';
  nbRisquesFaibles: number = 0;

  ajoutRisqueF() {
    let r = new Risque();
    r.titre = this.titreRisqueF;
    r.probabilite = this.probaRisqueF;
    r.severite = 'Faible';
    r.description = this.descriptionRisqueF;
    this.projetsService.addRisque(r, this.codeProjet).subscribe(
      data => {
        this.projetService.getProjetByCode(this.codeProjet).subscribe(
          p => {
            this.projet = p;
          }
        )
      }
    )
    $("#modalRisqueFaible").close();
    this.titreRisqueF = null;
    this.probaRisqueF = null;
    this.descriptionRisqueF = null;
  }

  //Risque Faible--------------------------------------------------------

  //Risque Moyen--------------------------------------------------------
  titreRisqueM: string = '';
  probaRisqueM: number;
  descriptionRisqueM: string = '';
  nbRisquesMoyens: number = 0;

  ajoutRisqueM() {
    let r = new Risque();
    r.titre = this.titreRisqueM;
    r.probabilite = this.probaRisqueM;
    r.severite = 'Moyen';
    r.description = this.descriptionRisqueM;
    this.projetsService.addRisque(r, this.codeProjet).subscribe(
      data => {
        this.projetService.getProjetByCode(this.codeProjet).subscribe(
          p => {
            this.projet = p;
          }
        )
      }
    )
    $("#modalRisqueMoyen").close();
    this.titreRisqueM = null;
    this.probaRisqueM = null;
    this.descriptionRisqueM = null;
  }

  //Risque Moyen--------------------------------------------------------


  //Risque élevé--------------------------------------------------------
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
    this.projetsService.addRisque(r, this.codeProjet).subscribe(
      data => {
        this.projetService.getProjetByCode(this.codeProjet).subscribe(
          p => {
            this.projet = p;
          }
        )
      }
    )
    $("#modalRisque").close();
    this.titreRisque=null;
    this.probaRisque=null;
    this.descriptionRisque=null;
    this.sevRisque=null;
  }

  //Risque Eleve--------------------------------------------------------
  javaScriptForm() {
    $(document).ready(function () {
      // Test for placeholder support
      $.support.placeholder = (function () {
        var i = document.createElement('input');
        return 'placeholder' in i;
      })();

      // Hide labels by default if placeholders are supported
      if ($.support.placeholder) {
        $('.form-label').each(function () {
          $(this).addClass('js-hide-label');
        });

        // Code for adding/removing classes here
        $('.form-group').find('input, textarea').on('keyup blur focus', function (e) {

          // Cache our selectors
          var $this = $(this),
            $label = $this.parent().find("label");

          switch (e.type) {
            case 'keyup': {
              $label.toggleClass('js-hide-label', $this.val() == '');
            }
              break;
            case 'blur': {
              if ($this.val() == '') {
                $label.addClass('js-hide-label');
              } else {
                $label.removeClass('js-hide-label').addClass('js-unhighlight-label');
              }
            }
              break;
            case 'focus': {
              if ($this.val() !== '') {
                $label.removeClass('js-unhighlight-label');
              }
            }
              break;
            default:
              break;
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

  imageJavaScript() {
    $(document).ready(function () {
// Prepare the preview for profile picture
      $("#wizard-picture").change(function () {
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

  addRow(tache = new Tache()) {
    this.nbTaches.push(this.nbTaches.length)
    this.taches[this.nbTaches.length - 1] = tache;
    this.nbInterventionParTaches[this.nbTaches.length - 1] = new Array();
    if (tache.idTache == null) {
      this.taches[this.nbTaches.length - 1].interventions = new Array();
    }
    this.ditionnaireIdTaches.set(tache.idTache, this.nbTaches.length);
    this.taches[this.nbTaches.length - 1].idTache = this.nbTaches.length;
    if (tache.interventions.length > 0) {
      for (let i = 0; i < tache.interventions.length; i++)
        this.nbInterventionParTaches[this.nbTaches.length - 1].push(i)
    }
    for (let j = 0; j < this.taches.length; j++) {
      let t = new Array()
      for (let i = 0; i < j; i++) {
        if (this.nbTaches[i] != null)
          t.push(this.taches[i])
      }
      this.dropdownOptionsTacheMere[j] = t;
      this.dropdownOptionsTacheDependances[j] = t;
    }
  }

  removeRow(event, n) {
    let dep;
    dep = false;
    this.taches.forEach(t => {

      if (t.tacheMere != null && t.tacheMere.idTache == this.taches[n].idTache)
        dep = true;
      t.dependances.forEach(d => {
        if (d.idTache == this.taches[n].idTache)
          dep = true;
      });
    });
    if (dep == true) {
      var alert = $("<div class=\"alert alert-danger alert-dismissible\">\n" +
        "             <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n" +
        "             <strong>Suppression impossible !</strong> Veuillez d'abord supprimer les dépendances liées à la taches .\n" +
        "           </div>");
      $("#alerts-container").append(alert);
    } else
      this.taches[n] = null;
  }

  titreTacheChange(event, number) {
    this.taches[number].titre = event.target.value;
  }

  descTacheChange(event, number) {
    this.taches[number].description = event.target.value;
  }

  avancementTacheChange(event, number) {
    this.taches[number].avancement = event.target.value;
    if(this.taches[number].dateDebutRelle==null||this.taches[number].dateDebutRelle=='')
      this.taches[number].dateDebutRelle = this.taches[number].dateDebutPrevue;
    if(event.target.value==100)
      this.taches[number].dateFinRelle=this.taches[number].dateFinPrevue;
  }

  coutInitialTacheChange(event, number) {
    this.taches[number].coutInitial = event.target.value;
  }

  coutReelTacheChange(event, number) {
    this.taches[number].coutReel = event.target.value;
    this.checkDependancesTaches();
  }

  dateDebutPlanifieeTacheChange(event, number) {
    this.taches[number].dateDebutPlanifiee = event.target.value;
    if(!this.taches[number].dateDebutPrevue)
      this.taches[number].dateDebutPrevue = event.target.value;
    this.checkDependancesTaches();
  }

  dateFinPlanifieeTacheChange(event, number) {
    this.taches[number].dateFinPlanifiee = event.target.value;
    if(!this.taches[number].dateFinPrevue)
      this.taches[number].dateFinPrevue = event.target.value;
    this.checkDependancesTaches();
  }

  dateDebutPrevueTacheChange(event, number) {
    this.taches[number].dateDebutPrevue = event.target.value;
    this.checkDependancesTaches();
  }

  dateFinPrevueTacheChange(event, number) {
    this.taches[number].dateFinPrevue = event.target.value;
    this.checkDependancesTaches();
  }

  dateDebutRelleTacheChange(event, number) {
    this.taches[number].dateDebutRelle = event.target.value;
    this.checkDependancesTaches();
  }

  dateFinRelleTacheChange(event, number) {
    this.taches[number].dateFinRelle = event.target.value;
    if(event.target.value)
    this.taches[number].avancement=100;
    this.checkDependancesTaches();
  }

  selectionChangedTacheMere($event, number) {
    if (Array.isArray($event.value))
      this.taches[number].tacheMere = null;
    else
      this.taches[number].tacheMere = $event.value;
  }

  selectionChangedTacheDependances($event, number) {
    this.taches[number].dependances = $event.value;
    this.checkDependancesTaches();
  }

  selectionChangedIntervenantTache($event, indiceTache, indiceIntervention) {
    this.taches[indiceTache].interventions[indiceIntervention].intervenant = $event.value;
  }

  addIntervention(n) {
    this.nbInterventionParTaches[n].push(this.nbInterventionParTaches[n].length)
    this.taches[n].interventions[this.nbInterventionParTaches[n].length - 1] = new Intervention();
  }

  removeIntervention(event, indiceTache, indiceIntervention) {
    // $("#intervention"+indiceTache+"-"+indiceIntervention).remove();
    this.taches[indiceTache].interventions[indiceIntervention] = null;

  }

  affectationTacheChange(event, indiceTache, indiceIntervention) {
    this.taches[indiceTache].interventions[indiceIntervention].affectation = event.target.value;
  }

  ngOnInit(): void {
    this.javaScriptForm();
    this.codeProjet = this.route.snapshot.paramMap.get('codeProjet')
    this.projetService.getProjetByCode(this.codeProjet).subscribe(
      p => {
        console.log(p)
        this.projet = p;
        console.log("projetdebut")
        console.log(this.projet)
        this.projetFormGroup = this.fb.group({
          codeProjet: [p.codeProjet, Validators.required],
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
        this.avancement = p.avancement;
        this.coutInitial = p.coutInitial;
        this.coutReel = p.coutReel;
        this.chef = p.chefProjet;
        this.portefeuille = p.familleProjet;
        this.statut = {
          nom: this.Statuts[(Object.keys(StatutMapping)).find(key => StatutMapping[key] === p.statut)],
          valeur: this.StatutMapping[(Object.keys(StatutMapping)).find(key => StatutMapping[key] === p.statut)]
        }
        this.priorite = {
          nom: this.Priorite[(Object.keys(PrioriteMapping)).find(key => PrioriteMapping[key] === p.priorite)],
          valeur: this.PrioriteMapping[(Object.keys(PrioriteMapping)).find(key => PrioriteMapping[key] === p.priorite)]
        }
        this.titreProjet = p.titreProjet;
        this.description = p.description;
        this.dateDebutPlanifiee = this.datepipe.transform(this.projet.dateDebutPlanifiee, 'yyyy-MM-dd')
        this.dateDebutPrevue = this.datepipe.transform(this.projet.dateDebutPrevue, 'yyyy-MM-dd')
        this.dateFinPlanifiee = this.datepipe.transform(this.projet.dateFinPlanifiee, 'yyyy-MM-dd')
        this.dateFinRelle = this.datepipe.transform(this.projet.dateFinReelle, 'yyyy-MM-dd')
        this.dateDebutRelle = this.datepipe.transform(this.projet.dateDebutReelle, 'yyyy-MM-dd')
        this.dateFinPrevue = this.datepipe.transform(this.projet.dateFinPrevue, 'yyyy-MM-dd')
        this.intervenants = p.intervenants;
        this.dropdownOptionsIntervenantsTache = this.intervenants;
        this.projetsService.tousLesProjets().subscribe(projets => {
          this.dropdownOptionsPredecesseurs = new Array();
          projets.forEach(p => {
            let flag = true;
            if (p.codeProjet == this.codeProjet)
              flag = false;
            p.predecesseurs.forEach(pred => {
              if (pred.codeProjet == this.codeProjet)
                flag = false;
            })
            if (flag)
              this.dropdownOptionsPredecesseurs.push(p);

          })
          this.predecesseurs = new Array()
          this.dropdownOptionsPredecesseurs.forEach(pd => {
            this.projet.predecesseurs.forEach(p => {
              if (p.codeProjet == pd.codeProjet)
                this.predecesseurs.push(pd);
            })
          })
        })
        this.initTaches();
        console.log(this.taches)
      }
    )

    this.ressourceService.tousLesChef().subscribe(chefs => {
      this.dropdownOptionsChefProjet = chefs
    })
    this.ressourceService.tous().subscribe(intervenants => {
      this.dropdownOptionsIntervenants = intervenants;
    })
    this.portefeuilleService.tousLesPortefeuilles().subscribe(portefeuilles => {
      this.dropdownOptionsPortefeuille = portefeuilles;
    })

    this.authService.getUserbyEmail(this.authService.getEmail()).subscribe(user => {
      this.user = user;
      if (this.authService.estChefDeProjet())
        this.chef = user;
    })

    console.log(this.StatutMapping[0])
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
    // this.imageJavaScript()
  }

  initTaches() {
    this.taches = [];
    this.nbTaches = new Array();
    this.nbInterventionParTaches = new Array();
    this.projet.taches.forEach(tache => {
      tache.dateDebutPlanifiee = this.datepipe.transform(tache.dateDebutPlanifiee, 'yyyy-MM-dd');
      tache.dateFinPlanifiee = this.datepipe.transform(tache.dateFinPlanifiee, 'yyyy-MM-dd');
      tache.dateDebutPrevue = this.datepipe.transform(tache.dateDebutPrevue, 'yyyy-MM-dd');
      tache.dateFinPrevue = this.datepipe.transform(tache.dateFinPrevue, 'yyyy-MM-dd');
      tache.dateDebutRelle = this.datepipe.transform(tache.dateDebutRelle, 'yyyy-MM-dd');
      tache.dateFinRelle = this.datepipe.transform(tache.dateFinRelle, 'yyyy-MM-dd');
      this.addRow(tache);
    })
    this.taches.forEach(t => {
      for(let i=0;i<t.dependances.length;i++){
        let id=this.ditionnaireIdTaches.get(t.dependances[i].idTache);
        this.taches.forEach(t1=>{
          if(t1.idTache==id)
            t.dependances[i]=t1;
        })
      }
      t.dependances.forEach(d => {
        if (d != null)
          d.idTache = this.ditionnaireIdTaches.get(d.idTache);
      })
      if (t.tacheMere != null)
      {
        let id=this.ditionnaireIdTaches.get(t.tacheMere.idTache);
        this.taches.forEach(t1=>{
          if(t1.idTache==id)
            t.tacheMere=t1;
        })
      }
    })
  }

  datesChangePlanifiee() {
    if (this.dateRelle.startDate == null)
      this.datePrevue = this.datePlanifiee;
  }

  datesChangeRelle() {
    if (this.dateRelle.startDate != null) {
      this.datePrevue = this.dateRelle;
      this.avancement = 100;
    }
  }

  datesChangePrevue() {
    if (this.avancement == 100 && this.datePrevue.startDate != null)
      this.dateRelle = this.datePrevue;
  }

  avancementChange() {
    if (this.avancement == 100 && this.datePrevue.startDate != null)
      this.dateRelle = this.datePrevue;
  }

  onSelectedFile(event) {
    this.selectedFiles = event.target.files;
    let filename = this.selectedFiles.item(0).name;
    var extn = filename.split(".").pop();
    if (extn != "png" && extn != "jpg" && extn != "jpeg") {
      this.addSingleDanger("Erreur !", "Veuillez fournir un format d'image valide !")
      this.selectedFiles = null;
      $("#wizard-picture").val(null);
      $('#wizardPicturePreview').attr('src', "")
    }
  }

  // enregistrer() {
  //   this.piecesJointesValid = true;
  //   this.infoGeneralesValid = true;
  //   for (let i = 0; i < this.piecesJointes.length; i++) {
  //     if (this.piecesJointes[i] == undefined || ((this.piecesJointes[i].pieceJointe == null || this.piecesJointes[i].desc == '') && this.piecesJointes[i].deleted == false)) {
  //       var validationPieceJointe = $("<p id='validationPJ" + i + "' style='color:red;font-size: 0.9rem;'>*Remplissez les champs ou supprimez la piece jointe !</p>")
  //       $("#pieceJointeC" + i).append(validationPieceJointe);
  //       this.piecesJointesValid = false;
  //     }
  //   }
  //
  //   this.submitted = true;
  //   if (this.projetFormGroup.invalid ||
  //     this.piecesJointesValid == false ||
  //     this.datePrevue.startDate == null ||
  //     this.datePlanifiee.startDate == null ||
  //     this.avancement == null ||
  //     this.chef == null ||
  //     this.statut == null ||
  //     this.priorite == null ||
  //     this.portefeuille == null) {
  //     this.infoGeneralesValid = false;
  //     return;
  //   } else {
  //     this.projetFormGroup.controls.dateDebutPlanifiee.setValue(this.datePlanifiee.startDate.toDate());
  //     if (this.dateRelle.startDate != null)
  //       this.projetFormGroup.controls.dateDebutRelle.setValue(this.dateRelle.startDate.toDate());
  //     this.projetFormGroup.controls.dateDebutPrevue.setValue(this.datePrevue.startDate.toDate());
  //     this.projetFormGroup.controls.dateFinPlanifiee.setValue(this.datePlanifiee.endDate.toDate());
  //     this.projetFormGroup.controls.dateFinPrevue.setValue(this.datePrevue.endDate.toDate());
  //     if (this.dateRelle.endDate != null)
  //       this.projetFormGroup.controls.dateFinRelle.setValue(this.dateRelle.endDate.toDate());
  //     this.projetFormGroup.controls.avancement.setValue(this.avancement);
  //     this.projetFormGroup.controls.coutInitial.setValue(this.coutInitial);
  //     this.projetFormGroup.controls.coutReel.setValue(this.coutReel);
  //     this.projetFormGroup.controls.chefProjet.setValue(this.chef);
  //     this.projetFormGroup.controls.intervenants.setValue(this.intervenants);
  //     this.projetFormGroup.controls.statut.setValue(this.statut.valeur);
  //     this.projetFormGroup.controls.priorite.setValue(this.priorite.valeur);
  //     this.projetFormGroup.controls.familleProjet.setValue(this.portefeuille);
  //     this.projetFormGroup.controls.predecesseurs.setValue(this.predecesseurs);
  //     this.projetsService.save(this.projetFormGroup.value).subscribe(
  //       data => {
  //         //logo------------------------------------------------------------------------------
  //         if (this.selectedFiles != undefined) {
  //           this.progress = 0;
  //           this.currentFileUpload = this.selectedFiles.item(0)
  //           this.projetsService.uploadLogo(this.currentFileUpload, this.projetFormGroup.controls.codeProjet.value).subscribe(event => {
  //             if (event.type === HttpEventType.UploadProgress) {
  //               this.progress = Math.round(100 * event.loaded / event.total);
  //             } else if (event instanceof HttpResponse) {
  //               //console.log(this.router.url);
  //               //this.getProducts(this.currentRequest);
  //               //this.refreshUpdatedProduct();
  //               this.currentTime = Date.now();
  //             }
  //           }, err => {
  //             alert("Problème de chargement");
  //           })
  //           // this.selectedFiles = undefined
  //         }
  //         //pieces jointes------------------------------------------------------------------------------
  //         this.piecesJointes.forEach(p => {
  //           if (p.deleted == false) {
  //             this.projetsService.addPieceJointe(p, this.projetFormGroup.controls.codeProjet.value).subscribe(event => {
  //               if (event.type === HttpEventType.UploadProgress) {
  //                 // this.progress = Math.round(100 * event.loaded / event.total);
  //               } else if (event instanceof HttpResponse) {
  //                 // this.currentTime=Date.now();
  //               }
  //             }, err => {
  //               alert("Problème de chargement");
  //             })
  //           }
  //         })
  //
  //         //Risques-------------------------------------------------------------------------------
  //         // this.risquesF.forEach(rf => {
  //         //   if (rf != undefined) {
  //         //     this.projetsService.addRisque(rf, this.projetFormGroup.controls.codeProjet.value).subscribe(
  //         //       data => {
  //         //         // alert("done !");
  //         //       }
  //         //     )
  //         //   }
  //         // })
  //         // this.risquesM.forEach(rf => {
  //         //   if (rf != undefined) {
  //         //     this.projetsService.addRisque(rf, this.projetFormGroup.controls.codeProjet.value).subscribe(
  //         //       data => {
  //         //         // alert("done !");
  //         //       }
  //         //     )
  //         //   }
  //         // })
  //         this.risques.forEach(rf => {
  //           if (rf != undefined) {
  //             this.projetsService.addRisque(rf, this.projetFormGroup.controls.codeProjet.value).subscribe(
  //               data => {
  //                 // alert("done !");
  //               }
  //             )
  //           }
  //         })
  //         //taches--------------------------------------------------------------------------------
  //         let taches: Tache[] = new Array();
  //         this.taches.forEach(t => {
  //           if (t != null)
  //             taches.push(t);
  //         })
  //         this.projetsService.ajouterTaches(this.projetFormGroup.controls.codeProjet.value, taches).subscribe();
  //       }
  //     );
  //   }
  // }


  annulerEdit() {
    this.submitted=false;
    this.predecesseursInvalidReelle=''
    this.predecesseursInvalidPrevue=''
    this.predecesseursInvalidPlanifiee =''
    this.predecesseursValidReelle=true;
    this.predecesseursValidPrevue=true;
    this.predecesseursValidPlanifiee=true;
    this.selectedFiles = null;
    $("#wizard-picture").val(null);
    $('#wizardPicturePreview').attr('src', "")
    this.editMode = false;
    this.avancement = this.projet.avancement;
    this.coutInitial = this.projet.coutInitial;
    this.coutReel = this.projet.coutReel;
    this.chef = this.projet.chefProjet;
    this.portefeuille = this.projet.familleProjet;
    this.statut = {
      nom: this.Statuts[(Object.keys(StatutMapping)).find(key => StatutMapping[key] === this.projet.statut)],
      valeur: this.StatutMapping[(Object.keys(StatutMapping)).find(key => StatutMapping[key] === this.projet.statut)]
    }
    this.priorite = {
      nom: this.Priorite[(Object.keys(PrioriteMapping)).find(key => PrioriteMapping[key] === this.projet.priorite)],
      valeur: this.PrioriteMapping[(Object.keys(PrioriteMapping)).find(key => PrioriteMapping[key] === this.projet.priorite)]
    }
    this.titreProjet = this.projet.titreProjet;
    this.description = this.projet.description;
    this.dateDebutPlanifiee = this.datepipe.transform(this.projet.dateDebutPlanifiee, 'yyyy-MM-dd')
    this.dateDebutPrevue = this.datepipe.transform(this.projet.dateDebutPrevue, 'yyyy-MM-dd')
    this.dateFinPlanifiee = this.datepipe.transform(this.projet.dateFinPlanifiee, 'yyyy-MM-dd')
    this.dateFinRelle = this.datepipe.transform(this.projet.dateFinReelle, 'yyyy-MM-dd')
    this.dateDebutRelle = this.datepipe.transform(this.projet.dateDebutReelle, 'yyyy-MM-dd')
    this.dateFinPrevue = this.datepipe.transform(this.projet.dateFinPrevue, 'yyyy-MM-dd')
    this.addSingleDanger("Annulé !", "Vos modifications ont été annulées.")
  }

  saveEdit() {
    this.submitted = true;
    this.predecesseursValidUpdate()
    console.log(this.chef)
    if (this.avancement == null
      || this.coutInitial == null
      || this.chef == null
      || this.portefeuille == null
      || this.titreProjet == null
      || this.description == null
      || this.titreProjet == ""
      || this.description == ""
      || this.dateDebutPlanifiee == null
      || this.dateDebutPrevue == null
      || this.dateFinPlanifiee == null
      || this.dateFinPrevue == null
      || this.dateDebutPlanifiee == ""
      || this.dateDebutPrevue == ""
      || this.dateFinPlanifiee == ""
      || this.dateFinPrevue == ""
      || this.statut.valeur == null
      || this.priorite.valeur == null
      || this.dateDebutPlanifiee > this.dateFinPlanifiee
      || this.dateDebutPrevue > this.dateFinPrevue
      || this.dateDebutRelle&&this.dateFinRelle&&this.dateDebutRelle > this.dateFinRelle
      || !this.predecesseursValidPlanifiee
      || !this.predecesseursValidPrevue
      || !this.predecesseursValidReelle
    ) {
      return;
    } else {
      this.editMode = false;
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
      this.submitted = false;
      console.log("projetsave")
      console.log(this.projet)

      this.projetsService.update(this.projet).subscribe(
        data => {
          this.projetService.getProjetByCode(this.codeProjet).subscribe(
            p => {
              console.log(p)
              this.projet = p;
              this.avancement = p.avancement;
              this.coutInitial = p.coutInitial;
              this.coutReel = p.coutReel;
              this.chef = p.chefProjet;
              this.portefeuille = p.familleProjet;
              this.titreProjet = p.titreProjet;
              this.description = p.description;
              this.dateDebutPlanifiee = this.datepipe.transform(this.projet.dateDebutPlanifiee, 'yyyy-MM-dd')
              this.dateDebutPrevue = this.datepipe.transform(this.projet.dateDebutPrevue, 'yyyy-MM-dd')
              this.dateFinPlanifiee = this.datepipe.transform(this.projet.dateFinPlanifiee, 'yyyy-MM-dd')
              this.dateFinRelle = this.datepipe.transform(this.projet.dateFinReelle, 'yyyy-MM-dd')
              this.dateDebutRelle = this.datepipe.transform(this.projet.dateDebutReelle, 'yyyy-MM-dd')
              this.dateFinPrevue = this.datepipe.transform(this.projet.dateFinPrevue, 'yyyy-MM-dd')
            });
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
          this.addSingleSuccess("Succès !", "Vos modifications ont bien été enregistrées.")
        }
      );
    }
  }

  saveEditPlanning() {
    this.tachesValid = true;
    this.planningSubmitted = true;
    this.taches.forEach(
      t => {
        console.log("this.toDate(t.dateDebutPlanifiee)")
        console.log(this.toDate(t.dateDebutPlanifiee))
        console.log("this.toDate(this.dateDebutPlanifiee)")
        console.log(this.toDate(this.dateDebutPlanifiee))
        if (t.titre == null || t.titre == ''
          || t.description == null || t.description == ''
          || t.avancement > 100 || t.avancement < 0
          || t.dateDebutPlanifiee == null || t.dateDebutPlanifiee == ''
          || t.dateFinPlanifiee == null || t.dateFinPlanifiee == ''
          || this.toDate(t.dateDebutPlanifiee) > this.toDate(t.dateFinPlanifiee)
          || this.toDate(t.dateDebutPlanifiee) < this.toDate(this.dateDebutPlanifiee)
          || this.toDate(t.dateFinPlanifiee) > this.toDate(this.dateFinPlanifiee)
          || t.dateDebutPrevue == null || t.dateDebutPrevue == ''
          || t.dateFinPrevue == null || t.dateFinPrevue == ''
          || this.toDate(t.dateDebutPrevue) > this.toDate(t.dateFinPrevue)
          || this.toDate(t.dateDebutPrevue) < this.toDate(this.dateDebutPrevue)
          || this.toDate(t.dateFinPrevue) > this.toDate(this.dateFinPrevue)
          || t.dateDebutRelle&&t.dateFinRelle&&this.toDate(t.dateDebutRelle) > this.toDate(t.dateFinRelle)
          || t.dateDebutRelle&&this.dateDebutRelle&&this.toDate(t.dateDebutRelle) < this.toDate(this.dateDebutRelle)
          || t.dateFinRelle&&this.dateFinRelle&&this.toDate(t.dateFinRelle) > this.toDate(this.dateFinRelle)
          || t.tacheMere != null && (this.toDate(t.dateDebutPlanifiee) < this.toDate(t.tacheMere.dateDebutPlanifiee))
          || t.tacheMere != null && (this.toDate(t.dateDebutPrevue) < this.toDate(t.tacheMere.dateDebutPrevue))
          || t.tacheMere != null &&t.dateDebutRelle!=null&&t.dateDebutRelle!=''&&t.tacheMere.dateDebutRelle!=null&&t.tacheMere.dateDebutRelle!='' && (this.toDate(t.dateDebutRelle) < this.toDate(t.tacheMere.dateDebutRelle))
          || t.tacheMere != null && (this.toDate(t.dateFinPlanifiee) > this.toDate(t.tacheMere.dateFinPlanifiee))
          || t.tacheMere != null && (this.toDate(t.dateFinPrevue) > this.toDate(t.tacheMere.dateFinPrevue))
          || t.tacheMere != null&& t.dateFinRelle!=null&&t.dateFinRelle!=''&&t.tacheMere.dateFinRelle!=null&&t.tacheMere.dateFinRelle!='' && (this.toDate(t.dateFinRelle) > this.toDate(t.tacheMere.dateFinRelle))
          || t.avancement==100 && (t.dateFinRelle==null||t.dateFinRelle=='')
          || t.avancement>0 && (t.dateDebutRelle==null||t.dateDebutRelle=='')
          || t.avancement!=100 && t.dateFinRelle
          ) {
          this.tachesValid = false;
        }
      }
    );
    this.checkDependancesTaches();
    if (this.tachesValid) {
      this.projetService.deleteAllTaches(this.codeProjet).subscribe(data => {
        let taches: Tache[] = new Array();
        this.taches.forEach(t => {
          if (t != null)
            taches.push(t);
        })
        this.projetsService.ajouterTaches(this.projetFormGroup.controls.codeProjet.value, taches).subscribe(
          data => {
            this.projetService.getProjetByCode(this.codeProjet).subscribe(p => {
              this.projet = p;
              this.initTaches();
              this.dropdownOptionsIntervenantsTache = this.projet.intervenants;
              this.addSingleSuccess("Succès !", "Vos modifications ont bien été enregistrées.")
              this.editModePlanning = false;
              this.planningSubmitted = false;
              this.projetService.getProjetByCode(this.codeProjet).subscribe(
                projet=>{
                  this.projet=projet;
                  this.dateDebutRelle = this.datepipe.transform(this.projet.dateDebutReelle, 'yyyy-MM-dd')
                  this.dateFinRelle = this.datepipe.transform(this.projet.dateFinReelle, 'yyyy-MM-dd')
                  this.avancement = this.projet.avancement
                }
              )
            })
          }
        );
      })
    }
  }

  downloadPieceJointe(p: PieceJointe) {
    window.open(this.host + "/pieceJointe/" + p.idPieceJointe);
  }

  deletePieceJointe(p: PieceJointe) {
    this.confirmationService.confirm({
      message: 'Etes-vous sûr de vouloir supprimer la pièce jointe ?',
      accept: () => {
        this.projetService.deletePiceJointe(p.idPieceJointe).subscribe(data => {
          this.addSingleSuccess("Succès !", "La pièce jointe a bien été supprimée.")
          this.projetService.getProjetByCode(this.codeProjet).subscribe(
            p => {
              console.log(p)
              this.projet = p;
            });
        })
      }
    })
  }

  enregistrerPiecesJointes() {
    this.piecesJointesValid = true;
    for (let i = 0; i < this.piecesJointes.length; i++) {
      if (this.piecesJointes[i] == undefined || ((this.piecesJointes[i].pieceJointe == null || this.piecesJointes[i].desc == '') && this.piecesJointes[i].deleted == false)) {
        var validationPieceJointe = $("<p id='validationPJ" + i + "' style='color:red;font-size: 0.9rem;'>*Remplissez les champs ou supprimez la piece jointe !</p>")
        $("#pieceJointeC" + i).append(validationPieceJointe);
        this.piecesJointesValid = false;
      }
    }
    if (!this.piecesJointesValid)
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
              p => {
                console.log(p)
                this.projet = p;
              });
            this.piecesJointes = [];
            $(".piecesJointes-container").empty();
          }, err => {
            alert("Problème de chargement");
          })
        }
        this.addSingleSuccess("Succès !", "Les pièces jointes ont bien été ajoutées.")
      })
    }
  }

  deleteRisque(idRisque: any) {
    this.confirmationService.confirm({
      message: 'Etes-vous sûr de vouloir supprimer le risque ?',
      accept: () => {
        this.projetService.deleteRisque(idRisque).subscribe(data => {
          this.addSingleSuccess("Succès !", "Le risque a bien été supprimé.")
          this.projetService.getProjetByCode(this.codeProjet).subscribe(
            p => {
              console.log(p)
              this.projet = p;
            });
        })
      }
    });

  }


  annulerEditPlanning() {
    this.initTaches();
    this.editModePlanning = false;
    this.planningSubmitted=false;
    this.addSingleDanger("Annulé !", "Vos modifications ont été annulées.")
  }

  saveEditIntervenants() {
      this.projet.intervenants = this.intervenants;
      this.projetService.update(this.projet).subscribe(
        p => {
          this.projet = p;
          this.addSingleSuccess("Succès !", "Vos modifications ont bien été enregistrées.")
          this.editModeIntervenants=false;

        }
      )
  }

  annulerEditIntervenants() {
    this.projetService.getProjetByCode(this.codeProjet).subscribe(p => {
      this.projet = p;
      this.intervenants = this.projet.intervenants;
      this.addSingleDanger("Annulé !", "Vos modifications ont été annulées.")
      this.editModeIntervenants = false;
    })
  }

  saveEditPredecesseurs() {
    this.predecesseursInvalid = '';
    this.predecesseursValid = true;
    if (this.predecesseurs != null) {
      this.predecesseurs.forEach(p => {
        if (p.dateFinPlanifiee > this.dateDebutPlanifiee) {
          this.predecesseursValid = false;
          this.predecesseursInvalid += p.titreProjet + "(dates planifiées), "
        } else if (p.dateFinPrevue > this.dateDebutPrevue) {
          this.predecesseursValid = false;
          this.predecesseursInvalid += p.titreProjet + "(dates prévues), "
        } else if (p.dateFinReelle > this.dateDebutRelle) {
          this.predecesseursValid = false;
          this.predecesseursInvalid += p.titreProjet + "(dates réelles), "
        }
      })
    }
    if(!this.predecesseursValid)
    {
      this.addSingleDanger("Erreur","*Les prédécesseurs doivent être terminés avant la date de début du projet: "+this.predecesseursInvalid)
    }
    else
    {
      this.projet.predecesseurs = this.predecesseurs;
      this.projetService.update(this.projet).subscribe(
        p => {
          this.projet = p;
          this.addSingleSuccess("Succès !", "Vos modifications ont bien été enregistrées.")
          this.projetService.getProjetByCode(this.codeProjet).subscribe(p => {
            this.projet = p;
            this.predecesseurs = this.projet.predecesseurs;
          });
          this.editModePredecesseurs = false;
        }
      )
    }
  }

  annulerEditPredecesseurs() {
    this.predecesseursInvalid = '';
    this.predecesseursValid = true;
    this.editModePredecesseurs = false;
    this.projetService.getProjetByCode(this.codeProjet).subscribe(p => {
      this.projet = p;
      this.predecesseurs = this.projet.predecesseurs;
      this.addSingleDanger("Annulé !", "Vos modifications ont été annulées.")
    })
  }

  toDate(date): Date {
    return new Date(date);
  }

  predecesseursValidUpdate() {
    this.predecesseursValidPlanifiee = true;
    this.predecesseursValidPrevue = true;
    this.predecesseursValidReelle = true;
    this.predecesseursInvalidPlanifiee = '';
    this.predecesseursInvalidPrevue = '';
    this.predecesseursInvalidReelle = '';
    if (this.predecesseurs != null) {
      this.predecesseurs.forEach(p => {
        if (p.dateFinPlanifiee > this.dateDebutPlanifiee) {
          this.predecesseursValidPlanifiee = false;
          this.predecesseursInvalidPlanifiee += p.titreProjet + ", "
          return;
        } else if (p.dateFinPrevue > this.dateDebutPrevue) {
          this.predecesseursValidPrevue = false;
          this.predecesseursInvalidPrevue += p.titreProjet + ", "
          return;
        } else if (p.dateFinReelle > this.dateDebutRelle) {
          this.predecesseursValidReelle = false;
          this.predecesseursInvalidReelle += p.titreProjet + ", "
          return;
        }
      })
    }
  }
  checkDependancesTaches()
  {
    this.taches.forEach(t=>{
    let nbDep: number = 0;
    this.textErreurDependancesTaches[t.idTache-1] = ''
    if (t.dependances != null) {
      t.dependances.forEach(d => {
        let td=''
        if (new Date(t.dateDebutPlanifiee) < new Date(d.dateFinPlanifiee))
            td+=' (date planifiée';
        if(new Date(t.dateDebutPrevue) < new Date(d.dateFinPrevue)) {
          if (td == '')
            td += (' (date prévue');
          else
            td += ', date prévue'
        }
        if(new Date(t.dateDebutRelle) < new Date(d.dateFinRelle)) {
          if (td == '')
            td += (' (date réelle');
          else
            td += ', date réelle';
        }
          td+=')';
        if (new Date(t.dateDebutPlanifiee) < new Date(d.dateFinPlanifiee)
          ||new Date(t.dateDebutPrevue) < new Date(d.dateFinPrevue)
          ||new Date(t.dateDebutRelle) < new Date(d.dateFinRelle)) {
          nbDep++;
          if (nbDep == 1) {
            this.textErreurDependancesTaches[t.idTache-1] = d.titre+td;
          } else if (nbDep == 2) {
            this.textErreurDependancesTaches[t.idTache-1] = "*Les dépendances : \"" + this.textErreurDependancesTaches[t.idTache-1] + "\", \"" + d.titre+td;
          } else {
            this.textErreurDependancesTaches[t.idTache-1] = this.textErreurDependancesTaches[t.idTache-1] + ", \"" + d.titre+td;
          }
        }
      })
      if (nbDep == 1) {
        this.textErreurDependancesTaches[t.idTache-1] = "*La dépendance : " + this.textErreurDependancesTaches[t.idTache-1] +
          " ne peut pas débuter avant la tâche dépendante: " + t.titre + " !";
        this.tachesValid = false;
      } else if (nbDep > 0) {
        this.textErreurDependancesTaches[t.idTache-1] = this.textErreurDependancesTaches[t.idTache-1] +
          "\" ne peuvent pas débuter avant la tâche dépendante: \"" + t.titre + "\" !";
        this.tachesValid = false;
      }
    }
  })
  }

  changeDateFinReelle() {
    if(this.toDate(this.dateFinRelle)>new Date()) {
      this.addSingleDanger("Erreur", "La date de fin réelle ne peut pas être une date future")
      this.dateFinRelle=null;
    }
  }
}
