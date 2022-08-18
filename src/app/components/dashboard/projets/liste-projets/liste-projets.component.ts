import {Component, OnInit, ViewChild} from '@angular/core';
import {ProjetsService} from "../../../../services/projets.service";
import {ProjetsComponent} from "../projets.component";
import {Observable, Subject} from "rxjs";
import {Priorite, PrioriteMapping, Projet, Statut, StatutMapping} from "../../../../model/Projet.model";
import {DataTableDirective} from "angular-datatables";
import {DatePipe} from "@angular/common";
import {environment} from "../../../../../environments/environment";
import {RessourcesService} from "../../../../services/ressources.service";
declare var $ :any;
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-liste-projets',
  templateUrl: './liste-projets.component.html',
  styleUrls: ['./liste-projets.component.css']
})
export class ListeProjetsComponent implements OnInit {
  exportColumns: any[];
  rows = 10;
  private cols: ({ field: string; header: string; customExportHeader: string } | { field: string; header: string } | { field: string; header: string })[];

  projets$:Projet[];
  host=environment.host;
  edit:boolean[]=new Array();
  priorite:any[]=new Array();
  statut:any[]=new Array();
  submitted:boolean[]=new Array();
  projetASupprimer:Projet;
  constructor(private serviceProjets:ProjetsService,public datepipe: DatePipe,
              private ressourceService:RessourcesService) { }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default();

        (doc as any).autoTable(this.exportColumns, this.projets$);
        doc.save('projets.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.projets$);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "projets");
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
    this.ressourceService.tousLesChef().subscribe(chefs=>
    {
      this.dropdownOptionsChefProjet=chefs
    })
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
   this.serviceProjets.tousLesProjets().subscribe((ret:Projet[])=>{
     this.projets$=ret;
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

     for(let i=0;i<ret.length;i++)
     {
       this.edit[i]=false;
       this.priorite[i]={nom:this.Priorite[(Object.keys(PrioriteMapping)).find(key => PrioriteMapping[key] === ret[i].priorite)],valeur:this.PrioriteMapping[(Object.keys(PrioriteMapping)).find(key => PrioriteMapping[key] === ret[i].priorite)]}
       this.statut[i]={nom:this.Statuts[(Object.keys(StatutMapping)).find(key => StatutMapping[key] === ret[i].statut)],valeur:this.StatutMapping[(Object.keys(StatutMapping)).find(key => StatutMapping[key] === ret[i].statut)]}
     }
    })
    }

  titreChanged($event, i) {
    this.projets$[i].titreProjet=$event.target.value;
  }

  DescriptionChanged($event, i: number) {
    this.projets$[i].description=$event.target.value;
  }

  DateDebutPlanifieeChanged($event, i: number) {
    this.projets$[i].dateDebutPlanifiee=$event.target.value;
  }

  DateFinPlanifieeChanged($event, i: number) {
    this.projets$[i].dateFinPlanifiee=$event.target.value;
  }

  DateDebutPrevueChanged($event, i: number) {
    this.projets$[i].dateDebutPrevue=$event.target.value;
  }

  DateFinPrevueChanged($event, i: number) {
    this.projets$[i].dateFinPrevue=$event.target.value;
  }

  DateDebutReelleChanged($event, i: number) {
    this.projets$[i].dateDebutReelle=$event.target.value;
  }

  DateFinReelleChanged($event, i: number) {
    this.projets$[i].dateFinReelle=$event.target.value;
  }

  avancementChanged($event, i: number) {
    this.projets$[i].avancement=$event.target.value;
  }

  coutInitialChanged($event, i: number) {
    this.projets$[i].coutInitial=$event.target.value;
  }

  coutReelChanged($event, i: number) {
    this.projets$[i].coutReel=$event.target.value;
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
      this.projets$[i].chefProjet=null;
    else
      this.projets$[i].chefProjet=$event.value;
  }
  //dropdown ChefProjet-----------------------------------
  updateProjet(i: any) {
    this.submitted[i]=true;
    if(this.projets$[i].titreProjet==''
      ||this.projets$[i].description==''
      ||this.projets$[i].dateDebutPlanifiee==null
      ||this.projets$[i].dateFinPlanifiee==null
      ||this.projets$[i].dateDebutPrevue==null
      ||this.projets$[i].dateFinPrevue==null
      ||this.projets$[i].chefProjet==null
      ||this.projets$[i].dateDebutPlanifiee.toString()==''
      ||this.projets$[i].dateFinPlanifiee.toString()==''
      ||this.projets$[i].dateDebutPrevue.toString()==''
      ||this.projets$[i].dateFinPrevue.toString()==''
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
      this.projets$[i].priorite=this.priorite[i].valeur;
      this.projets$[i].statut=this.statut[i].valeur;
      this.serviceProjets.update(this.projets$[i]).subscribe(
        projet=>{
          this.projets$[i]=projet;
          this.edit[i]=false;
          var alert=$("<div class=\"alert alert-success alert-dismissible\">\n" +
            "             <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n" +
            "             <strong>Succès !</strong> Vos Modifications ont bien été enregistrées.\n" +
            "           </div>");
          $("#alerts-container").append(alert);
        }
      );

    }
  }

  annulerUpdate(i: number) {
    this.serviceProjets.getProjetByCode(this.projets$[i].codeProjet).subscribe(
      projet=>{
        this.projets$[i]=projet;
        this.priorite[i]={nom:this.Priorite[(Object.keys(PrioriteMapping)).find(key => PrioriteMapping[key] === projet.priorite)],valeur:this.PrioriteMapping[(Object.keys(PrioriteMapping)).find(key => PrioriteMapping[key] === projet.priorite)]}
        this.statut[i]={nom:this.Statuts[(Object.keys(StatutMapping)).find(key => StatutMapping[key] === projet.statut)],valeur:this.StatutMapping[(Object.keys(StatutMapping)).find(key => StatutMapping[key] === projet.statut)]}
        this.edit[i]=false;
        var alert=$("<div class=\"alert alert-secondary alert-dismissible\">\n" +
          "             <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n" +
          "             <strong>Annulé !</strong> Vos modifications ont été annulées.\n" +
          "           </div>");
        $("#alerts-container").append(alert);
      }
    )
  }

  supprimerProjet() {
    this.serviceProjets.deleteProjet(this.projetASupprimer.codeProjet).subscribe(
      data=>{
        this.tousLesProjets();
        var alert=$("<div class=\"alert alert-success alert-dismissible\">\n" +
          "             <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n" +
          "             <strong>Succès !</strong> Le projet à bien été suppprimé.\n" +
          "           </div>");
        $("#alerts-container").append(alert);
      }
    )
  }
}
