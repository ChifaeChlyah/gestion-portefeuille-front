import { Component, OnInit } from '@angular/core';
import {AuthentificationService} from "../../services/authentification.service";
import {RessourcesService} from "../../services/ressources.service";
import {ProjetsService} from "../../services/projets.service";
import {DatePipe} from "@angular/common";
import {Ressource} from "../../model/Ressource.model";
import {Priorite, PrioriteMapping, Projet, Statut, StatutMapping} from "../../model/Projet.model";
import {environment} from "../../../environments/environment";
declare var $:any;
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-mes-projets-affecte',
  templateUrl: './mes-projets-affecte.component.html',
  styleUrls: ['./mes-projets-affecte.component.css']
})
export class MesProjetsAffecteComponent implements OnInit {
  exportColumns: any[];
  rows = 10;
  private cols: ({ field: string; header: string; customExportHeader: string } | { field: string; header: string } | { field: string; header: string })[];


  constructor(private authService:AuthentificationService,private ressourcesService:RessourcesService,
              private serviceProjets:ProjetsService,public datepipe: DatePipe,
              private ressourceService:RessourcesService) { }
  user:Ressource;
  projetsGeres:Projet[];
  host=environment.host;
  ngOnInit(): void {
    this.tousLesProjets();

  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default();

        (doc as any).autoTable(this.exportColumns, this.projetsGeres);
        doc.save('Projets affectés.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.projetsGeres);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Projets affectés");
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
  tousLesProjets() {
    this.authService.getUserbyEmail(this.authService.getEmail()).subscribe(
      user => {
        this.user = user;
        this.ressourcesService.projetsAffectes(user.codeRessource).subscribe(projets=>{
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
        })
      }
    );
  }




}
