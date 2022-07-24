import {Component, OnInit, ViewChild} from '@angular/core';
import {ProjetsService} from "../../../../services/projets.service";
import {ProjetsComponent} from "../projets.component";
import {Observable, Subject} from "rxjs";
import {Projet} from "../../../../model/Projet.model";
import {DataTableDirective} from "angular-datatables";
declare var $ :any;
@Component({
  selector: 'app-liste-projets',
  templateUrl: './liste-projets.component.html',
  styleUrls: ['./liste-projets.component.css']
})
export class ListeProjetsComponent implements OnInit {
  dtOptions: any = {};
  projets$:Projet[]
  constructor(private serviceProjets:ProjetsService) { }

  ngOnInit(): void {
    this.tousLesProjets();
    this.dtOptions = {
      columns: [{
        "title": "Code",
        "data": "codeProjet",
      }, {
        "title": "Titre",
        "data": "titre",
      }, {
        "title": "Description",
        "data": "Description  ",
      }, {
        "title": "Date début prévue",
        "data": "dateDebutPrevue",
      }, {
        "title": "Date fin prévue",
        "data": "dateFinPrevue",
      }, {
        "title": "Priorité",
        "data": "priorite",
      },{
        "title": "% Avancement",
        "data": "avancement",
      }, {
        "title": "Statut",
        "data": "statut",
      }, {
        "title": "Coût Initial",
        "data": "coutInitial",
      }, {
        "title": "Coût réel",
        "data": "coutReel",
      }, {}],
      columnDefs: [
        { "visible": false, "targets": 6 },
        { "visible": false, "targets": 2 },
        { "visible": false, "targets": 3 },
        { "visible": false, "targets": 4 },
        { "visible": false, "targets": 8 },
      ],
      // Declare the use of the extension in the dom parameter
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
        // 'columnsToggle',
        { "extend": 'excel', "text":'Excel  <i style="margin-left:5px" class="fa-solid fa-file-excel"></i>',"className": 'btn btn-default btn-xs' },
        { "extend": 'colvis', "text":'Filtrer <i class="fa-solid fa-filter"></i>',"className": 'btn btn-default btn-xs' },
        { "extend": 'copy', "text":'Copier <i class="fa-solid fa-copy"></i>',"className": 'btn btn-default btn-xs' },
        // 'print',
      ],
      language:
        {
          "decimal":        "",
          "emptyTable":     "Aucun Projet disponible",
          "info":           "Total des projets : _TOTAL_",
          "infoEmpty":      "Total des projets : 0 ",
          "infoFiltered":   "(filtered from _MAX_ total entries)",
          "infoPostFix":    "",
          "thousands":      ",",
          "lengthMenu":     "Show _MENU_ entries",
          "loadingRecords": "Chargement...",
          "processing":     "",
          "search":         "Rechercher:",
          "zeroRecords":    "Aucun projet retrouvé",
          "paginate": {
            "first":      "Premier",
            "last":       "Dernier",
            "next":       "Suivant",
            "previous":   "Précédant"
          },
          "aria": {
            "sortAscending":  ": activate to sort column ascending",
            "sortDescending": ": activate to sort column descending"
          }
        },
      pagingType:'full_numbers'
    };
  }

  tousLesProjets() {
   this.serviceProjets.tousLesProjets().subscribe((ret:Projet[])=>{
     this.projets$=ret;
    })
    }

}
