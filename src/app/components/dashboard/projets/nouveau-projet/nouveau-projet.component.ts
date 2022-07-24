import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import htmlString = JQuery.htmlString;
declare var $:any
@Component({
  selector: 'app-nouveau-projet',
  templateUrl: './nouveau-projet.component.html',
  styleUrls: ['./nouveau-projet.component.css']
})
export class NouveauProjetComponent implements OnInit {

  //dropdown priorité-----------------------------------
  configDropdownPriorite={
    placeholder:'Priorité'
  }
  dropdownOptionsPriorite=[
    'Basse',
    'Moyenne',
    'Elevée'
  ];
  selectionChangedPriorite($event: any) {
   // alert($event.value);
  }
  //dropdown priorité-----------------------------------

  //dropdown Statut-----------------------------------
  configDropdownStatut={
    placeholder:'Statut'
  }
  dropdownOptionsStatut=[
    'Attente (planifié)',
    'Pré-Lancement',
    'Lancement',
    'Exécution',
    'Clôturé',
    'Arrêt',
    'Garantie',
  ];
  selectionChangedStatut($event: any) {
   // alert($event.value);
  }
  //dropdown Statut-----------------------------------

  //dropdown ChefProjet-----------------------------------
  configDropdownChefProjet={
    placeholder:'Chef de projet',
    search:true
  }
  dropdownOptionsChefProjet=[
    'chef1',
    'chef2',
    'chef3',
    'chef4',
  ];
  selectionChangedChefProjet($event: any) {
    //alert($event.value);
  }
  //dropdown ChefProjet-----------------------------------

  //dropdown Intervenants-----------------------------------
  configDropdownIntervenants={
    placeholder:'Intervenants',
    search:true
  }
  dropdownOptionsIntervenants=[
    'inter1',
    'inter2',
    'inter3',
    'inter4',
  ];
  selectionChangedIntervenants($event: any) {
    //alert($event.value);
  }
  //dropdown Intervenants-----------------------------------

  //dropdown Portefeuille-----------------------------------
  configDropdownPortefeuille={
    placeholder:'Portefeuille',
    search:true
  }
  dropdownOptionsPortefeuille=[
    'Portefeuille1',
    'Portefeuille2',
    'Portefeuille3',
    'Portefeuille4',
  ];
  selectionChangedPortefeuille($event: any) {
    //alert($event.value);
  }
  //dropdown Portefeuille-----------------------------------

  //dropdown Predecesseurs-----------------------------------
  configDropdownPredecesseurs={
    placeholder:'Predecesseurs',
    search:true,
    multiple:true
  }
  dropdownOptionsPredecesseurs=[
    'Predecesseurs1',
    'Predecesseurs2',
    'Predecesseurs3',
    'Predecesseurs4',
  ];
  selectionChangedPredecesseurs($event: any) {
    //alert($event.value);
  }
  //dropdown Portefeuille-----------------------------------

  constructor(public fb: FormBuilder) {
    this.myForm = this.fb.group({
      img: [null],
      filename: ['']
    })
  }

//logo -------------------------------------

  filePath: string;
  myForm: FormGroup;
  imagePreview(e) {

    const file = (e.target as HTMLInputElement).files[0];

    this.myForm.patchValue({
      img: file
    });

    this.myForm.get('img').updateValueAndValidity()

    const reader = new FileReader();
    reader.onload = () => {
      this.filePath = reader.result as string;
    }
    reader.readAsDataURL(file)
    var fileName = $("#logo").val().split("\\").pop();
    $("#logo").siblings(".custom-file-label").addClass("selected").html(fileName);
  }

  submit() {
    console.log(this.myForm.value)
  }


  //logo -------------------------------------





  //piece jointe---------------------------------------------------------
  nbPiecesJointes=0;
  JavaScriptShowNameOfFile(number:number) {
    $('.piecesJointes-container').on('change', '#pieceJointe' + number, function () {
      var fileName = $("#pieceJointe" + number).val().split("\\").pop();
      $("#pieceJointe" + number).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
  }
  DeletePiecejointe(number:number) {
    $('.piecesJointes-container').on('click', '#deletePieceJointe' + number, function () {
      $("#pieceJointeC" + number).remove();
    });
  }
  // changePieceJointe(number: number) {
  //   alert('test')
  //     var fileName = $("#pieceJointe"+number).val().split("\\").pop();
  //     $("#pieceJointe"+number).siblings(".custom-file-label").addClass("selected").html(fileName);
  // }

  addPieceJointe() {
    var pieceJointe=$("<div id=\"pieceJointeC"+this.nbPiecesJointes+"\" class=\"pieceJointe\">\n" +
      "<i  id=\"deletePieceJointe"+this.nbPiecesJointes+"\" data-toggle='tooltip' title='Supprimer la pièce jointe' class=\"fa-solid fa-rectangle-xmark\"></i>"+
      "          <div class=\"custom-file\">\n" +
      "            <input id=\"pieceJointe"+this.nbPiecesJointes+"\" (change)=\"changePieceJointe("+this.nbPiecesJointes+")\" name=\"pieceJointe"+this.nbPiecesJointes+"\" type=\"file\"  class=\"custom-file-input\" >\n" +
      "            <label class=\"custom-file-label\" for=\"pieceJointe"+this.nbPiecesJointes+"\">Glissez la pièce jointe</label>\n" +
      "          </div>\n" +
      "          <div class=\"form-group desc-pieceJointe\">\n" +
      "          <textarea rows=\"2\" placeholder=\"Description de la pièce jointe\" class=\"form-control \"\n" +
      "                name=\"descriptionPieceJointe"+this.nbPiecesJointes+"\"></textarea>\n" +
      "          </div>\n" +
      "          </div>");
    $(".piecesJointes-container").append(pieceJointe);
    this.nbPiecesJointes++;
    for (let i = 0; i < this.nbPiecesJointes; i++) {
      this.JavaScriptShowNameOfFile(i);
      this.DeletePiecejointe(i);
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
    var risque=$("<div id=\"risqueFaible-"+this.nbRisquesFaibles+"\" class=\"ligne-risque-container\">\n" +
      "              <i id=\"deleteRisqueFaible"+this.nbRisquesFaibles+"\" class=\"fa-solid fa-x\"></i>\n" +
      "              <div id=\"ligne-risque-btn\" class=\"ligne-risque-btn\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapseRisqueFaible"+this.nbRisquesFaibles+"\" aria-expanded=\"false\">\n" +
      "                <button  data-toggle=\"Tooltip\" titre=\"Détails\" id=\"ligne-risque\" class=\"ligne-risque btn form-control\">\n" +
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
    this.titreRisqueF=null;
    this.probaRisqueF=null;
    this.descriptionRisqueF=null;
    deleteButton.addEventListener('click', () => {
      deleteButton.parentElement.remove();

      //alert(deleteButton.parentElement.id.split("-").pop());
      // !!!!!!!! --> pour avoir le numéro du risque utile pour un usage dans un tableau
    });
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
    var risqueM=$("<div id=\"risqueMoyen-"+this.nbRisquesMoyens+"\" class=\"ligne-risque-container\">\n" +
      "              <i data-toggle='tooltip' title='Supprimer le risque' id=\"deleteRisqueMoyen"+this.nbRisquesMoyens+"\" class=\"fa-solid fa-x\"></i>\n" +
      "              <div id=\"ligne-risque-btn\" class=\"ligne-risque-btn ligne-risqueM-btn\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapseRisqueMoyen"+this.nbRisquesMoyens+"\" aria-expanded=\"false\">\n" +
      "                <button  data-toggle=\"Tooltip\" titre=\"Détails\" id=\"ligne-risqueM\" class=\"ligne-risqueM btn form-control\">\n" +
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
    this.titreRisqueM=null;
    this.probaRisqueM=null;
    this.descriptionRisqueM=null;
    deleteButton.addEventListener('click', () => {
      deleteButton.parentElement.remove();
      //alert(deleteButton.parentElement.id.split("-").pop());
      // !!!!!!!! --> pour avoir le numéro du risque utile pour un usage dans un tableau
    });
  }
  //Risque Moyen--------------------------------------------------------


  //Risque élevé--------------------------------------------------------
  probaRisqueE:number;
  titreRisqueE:string='';
  descriptionRisqueE:string='';
  nbRisquesEleves:number=0;
  ajoutRisqueE(){
    this.nbRisquesEleves++;
    this.titreRisqueE=$("#titreRisqueE").val();
    this.probaRisqueE=$("#probaRisqueE").val();
    this.descriptionRisqueE=$("#descriptionRisqueE").val();
    var risqueE=$("<div id=\"risqueEleve-"+this.nbRisquesEleves+"\" class=\"ligne-risque-container\">\n" +
      "              <i data-toggle='tooltip' title='Supprimer le risque' id=\"deleteRisqueEleve"+this.nbRisquesEleves+"\" class=\"fa-solid fa-x\"></i>\n" +
      "              <div id=\"ligne-risque-btn\" class=\"ligne-risque-btn ligne-risqueE-btn\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapseRisqueEleve"+this.nbRisquesEleves+"\" aria-expanded=\"false\">\n" +
      "                <button  data-toggle=\"Tooltip\" titre=\"Détails\" id=\"ligne-risqueE\" class=\"ligne-risqueE btn form-control\">\n" +
      "                  <span id=\"titre-risque-btn\" class=\"titre-risque-btn\"> "+this.titreRisqueE+"</span><span id=\"proba-risque-btn\" class=\"proba-risque-btn\">\n" +
      "                  "+this.probaRisqueE +"% <i class=\"fa-solid fa-angle-down\"></i></span>\n" +
      "                </button>\n" +
      "              </div>\n" +
      "            </div>\n" +
      "            <div class=\"collapse\" id=\"collapseRisqueEleve"+this.nbRisquesEleves+"\" >\n" +
      "              <div class=\"card card-body\">\n" +
      this.descriptionRisqueE+
      "              </div>\n" +
      "            </div>")
    $("#risquesEleves").append(risqueE);
    const deleteButton = document.getElementById('deleteRisqueEleve'+this.nbRisquesEleves);
    this.titreRisqueE=null;
    this.probaRisqueE=null;
    this.descriptionRisqueE=null;
    deleteButton.addEventListener('click', () => {
      deleteButton.parentElement.remove();
      //alert(deleteButton.parentElement.id.split("-").pop());
      // !!!!!!!! --> pour avoir le numéro du risque utile pour un usage dans un tableau
    });
  }
  //Risque Moyen--------------------------------------------------------

  ngOnInit(): void {
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
    });
  }
}
