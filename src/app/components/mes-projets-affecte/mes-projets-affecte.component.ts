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
import {MessageService} from "primeng/api";

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
              private ressourceService:RessourcesService,
              private messageService: MessageService) { }
  user:Ressource;
  projetsGeres:Projet[];
  host=environment.host;
  ngOnInit(): void {
    this.tousLesProjets();

  }

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
        doc.save('Projets affect??s.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.projetsGeres);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Projets affect??s");
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
            { field: 'dateDebutPlanifiee', header: 'Date de d??but Planifi??e'},
            { field: 'dateFinPlanifiee', header: 'Date de fin Planifi??e' },
            { field: 'dateDebutPrevue', header: 'Date de d??but Pr??vue' },
            { field: 'dateDebutReelle', header: 'Date de d??but R??elle'},
            { field: 'dateFinReelle', header: 'Date de fin R??elle' },
            { field: 'priorite', header: 'Priorit??' },
            { field: 'avancement', header: 'Avancement' },
            { field: 'statut', header: 'Statut'},
            { field: 'coutInitial', header: 'Co??t Initial' },
            { field: 'coutReel', header: 'Co??t R??el' },
            { field: 'chefProjet', header: 'Chef de projet' },
          ];
          this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
        })
      }
    );
  }




}
