import { Component, OnInit } from '@angular/core';
import {AuthentificationService} from "../../services/authentification.service";
import {Ressource} from "../../model/Ressource.model";
import {RessourcesService} from "../../services/ressources.service";
import {Priorite, PrioriteMapping, Projet, Statut, StatutMapping} from "../../model/Projet.model";
import {environment} from "../../../environments/environment";
import {ProjetsService} from "../../services/projets.service";
import {DatePipe} from "@angular/common";
declare var $:any;
import * as FileSaver from 'file-saver';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-mes-projets-geres',
  templateUrl: './mes-projets-geres.component.html',
  styleUrls: ['./mes-projets-geres.component.css']
})
export class MesProjetsGeresComponent implements OnInit {
  exportColumns: any[];
  rows = 10;
  private cols: ({ field: string; header: string; customExportHeader: string } | { field: string; header: string } | { field: string; header: string })[];

  constructor(private authService:AuthentificationService,private ressourcesService:RessourcesService,
              private serviceProjets:ProjetsService,public datepipe: DatePipe,
              private ressourceService:RessourcesService
    ,private messageService: MessageService) { }
  user:Ressource;
  projetsGeres:Projet[];
  host=environment.host;
  edit:boolean[]=new Array();
  priorite:any[]=new Array();
  statut:any[]=new Array();
  submitted:boolean[]=new Array();
  projetASupprimer:Projet;

  addSingleSuccess(summary,detail) {
    this.messageService.add({severity:'success', summary:summary, detail:detail});
  }
  addSingleInfo(summary,detail) {
    this.messageService.add({severity:'info', summary:summary, detail:detail});
  }
  addSingleDanger(summary,detail) {
    this.messageService.add({severity:'error', summary:summary, detail:detail});
  }
  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default();

        (doc as any).autoTable(this.exportColumns, this.projetsGeres);
        doc.save('projets gérés.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.projetsGeres);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "projets gérés");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  ngOnInit(): void {
    this.tousLesProjets();
    this.javaScriptForm();
    this.imageJavaScript();
    this.ressourceService.tousLesChef().subscribe(chefs=>
    {
      this.dropdownOptionsChefProjet=chefs
    })
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
  tousLesProjets() {
    this.authService.getUserbyEmail(this.authService.getEmail()).subscribe(
      user => {
        this.user = user;
        this.ressourcesService.projetsGeres(user.codeRessource).subscribe(projets=>{
          this.projetsGeres=projets;
          this.cols = [
            { field: 'codeProjet', header: 'Code'},
            { field: 'titreProjet', header: 'Titre' },
            { field: 'description', header: 'description' },
            { field: 'dateDebutPlanifiee', header: 'Date de début Planifiée'},
            { field: 'dateFinPlanifiee', header: 'Date de fin Planifiée' },
            { field: 'dateDebutPrevue', header: 'Date de début Prévue' },
            { field: 'dateDebutReelle', header: 'Date de début Réelle'},
            { field: 'dateFinReelle', header: 'Date de fin Réelle' },
            { field: 'priorite', header: 'Priorité' },
            { field: 'avancement', header: 'Avancement' },
            { field: 'statut', header: 'Statut'},
            { field: 'coutInitial', header: 'Coût Initial' },
            { field: 'coutReel', header: 'Coût Réel' },
            { field: 'chefProjet', header: 'Chef de projet' },
          ];
          this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
          for(let i=0;i<projets.length;i++)
          {
            this.edit[i]=false;
            this.priorite[i]={nom:this.Priorite[(Object.keys(PrioriteMapping)).find(key => PrioriteMapping[key] === projets[i].priorite)],valeur:this.PrioriteMapping[(Object.keys(PrioriteMapping)).find(key => PrioriteMapping[key] === projets[i].priorite)]}
            this.statut[i]={nom:this.Statuts[(Object.keys(StatutMapping)).find(key => StatutMapping[key] === projets[i].statut)],valeur:this.StatutMapping[(Object.keys(StatutMapping)).find(key => StatutMapping[key] === projets[i].statut)]}
          }
        })
      }
    );
  }

  titreChanged($event, i) {
    this.projetsGeres[i].titreProjet=$event.target.value;
  }

  DescriptionChanged($event, i: number) {
    this.projetsGeres[i].description=$event.target.value;
  }

  DateDebutPlanifieeChanged($event, i: number) {
    this.projetsGeres[i].dateDebutPlanifiee=$event.target.value;
  }

  DateFinPlanifieeChanged($event, i: number) {
    this.projetsGeres[i].dateFinPlanifiee=$event.target.value;
  }

  DateDebutPrevueChanged($event, i: number) {
    this.projetsGeres[i].dateDebutPrevue=$event.target.value;
  }

  DateFinPrevueChanged($event, i: number) {
    this.projetsGeres[i].dateFinPrevue=$event.target.value;
  }

  DateDebutReelleChanged($event, i: number) {
    this.projetsGeres[i].dateDebutReelle=$event.target.value;
  }

  DateFinReelleChanged($event, i: number) {
    this.projetsGeres[i].dateFinReelle=$event.target.value;
  }

  avancementChanged($event, i: number) {
    this.projetsGeres[i].avancement=$event.target.value;
  }

  coutInitialChanged($event, i: number) {
    this.projetsGeres[i].coutInitial=$event.target.value;
  }

  coutReelChanged($event, i: number) {
    this.projetsGeres[i].coutReel=$event.target.value;
  }
  //dropdown priorité-----------------------------------

  public PrioriteMapping = PrioriteMapping;
  public Priorite = Object.values(Priorite);
  configDropdownPriorite={
    placeholder:'Priorité',
    displayFn:(item: any) => { return item.valeur } ,//to support flexible text displaying for each item
  }
  dropdownOptionsPriorite=[
    {nom:this.Priorite[0],valeur:this.PrioriteMapping[0]},
    {nom:this.Priorite[1],valeur:this.PrioriteMapping[1]},
    {nom:this.Priorite[2],valeur:this.PrioriteMapping[2]},
  ];
  selectionChangedPriorite($event: any,i) {
    if(Array.isArray($event.value))
      this.priorite[i]=null;
    else
      this.priorite[i]=$event.value;
  }

  //dropdown priorité-----------------------------------
//dropdown Statut-----------------------------------
  public StatutMapping = StatutMapping;
  public Statuts = Object.values(Statut);
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
  selectionChangedStatut($event: any,i) {
    if(Array.isArray($event.value))
      this.statut[i]=null;
    else
      this.statut[i]=$event.value;
  }
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
  selectionChangedChefProjet($event: any,i) {
    console.log("Array.isArray($event.value)")
    console.log(Array.isArray($event.value))
    if(Array.isArray($event.value))
      this.projetsGeres[i].chefProjet=null;
    else
      this.projetsGeres[i].chefProjet=$event.value;
  }
  //dropdown ChefProjet-----------------------------------
  updateProjet(i: any) {
    this.submitted[i]=true;
    if(this.projetsGeres[i].titreProjet==''
      ||this.projetsGeres[i].description==''
      ||this.projetsGeres[i].dateDebutPlanifiee==null
      ||this.projetsGeres[i].dateFinPlanifiee==null
      ||this.projetsGeres[i].dateDebutPrevue==null
      ||this.projetsGeres[i].dateFinPrevue==null
      ||this.projetsGeres[i].chefProjet==null
      ||this.projetsGeres[i].dateDebutPlanifiee.toString()==''
      ||this.projetsGeres[i].dateFinPlanifiee.toString()==''
      ||this.projetsGeres[i].dateDebutPrevue.toString()==''
      ||this.projetsGeres[i].dateFinPrevue.toString()==''
      ||this.priorite[i]==null
      ||this.statut[i]==null)
    {
      var alert=$("<div class=\"alert alert-danger alert-dismissible\">\n" +
        "             <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n" +
        "             <strong>Echec !</strong> Veuillez remplir tous les champs obligatoires.\n" +
        "           </div>");
      $("#alerts-container").append(alert);
      return;
    }
    else{
      this.projetsGeres[i].priorite=this.priorite[i].valeur;
      this.projetsGeres[i].statut=this.statut[i].valeur;
      this.serviceProjets.update(this.projetsGeres[i]).subscribe(
        projet=>{
          this.projetsGeres[i]=projet;
          this.edit[i]=false;
          this.addSingleSuccess("Succès !","Vos modifications ont bien été enregistrées.")
        }
      );

    }
  }

  annulerUpdate(i: number) {
    this.serviceProjets.getProjetByCode(this.projetsGeres[i].codeProjet).subscribe(
      projet=>{
        this.projetsGeres[i]=projet;
        this.priorite[i]={nom:this.Priorite[(Object.keys(PrioriteMapping)).find(key => PrioriteMapping[key] === projet.priorite)],valeur:this.PrioriteMapping[(Object.keys(PrioriteMapping)).find(key => PrioriteMapping[key] === projet.priorite)]}
        this.statut[i]={nom:this.Statuts[(Object.keys(StatutMapping)).find(key => StatutMapping[key] === projet.statut)],valeur:this.StatutMapping[(Object.keys(StatutMapping)).find(key => StatutMapping[key] === projet.statut)]}
        this.edit[i]=false;
        this.addSingleDanger("Annulé !","Vos modifications ont été annulées.")
      }
    )
  }

  supprimerProjet() {
    this.serviceProjets.deleteProjet(this.projetASupprimer.codeProjet).subscribe(
      data=>{
        this.tousLesProjets();
        this.addSingleSuccess("Succès !","Le projet a bien été supprimé.")

      }
    )
  }
}
