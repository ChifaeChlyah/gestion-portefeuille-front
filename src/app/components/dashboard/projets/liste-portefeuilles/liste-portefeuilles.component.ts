import {Component, OnInit, ViewChild} from '@angular/core';
import {Projet} from "../../../../model/Projet.model";
import {ProjetsService} from "../../../../services/projets.service";
import {FamilleProjet} from "../../../../model/FamilleProjet.model";
import {PortefeuilleService} from "../../../../services/portefeuille.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthentificationService} from "../../../../services/authentification.service";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import * as FileSaver from 'file-saver';
import {MessageService} from "primeng/api";
import {EventDrivenService} from "../../../../services/event-driven.service";
import {ActionEvent, ProjectActionTypes} from "../../../../state/appData.state";
declare var $:any;
@Component({
  selector: 'app-liste-portefeuilles',
  templateUrl: './liste-portefeuilles.component.html',
  styleUrls: ['./liste-portefeuilles.component.css']
})
export class ListePortefeuillesComponent implements OnInit {
  exportColumns: any[];
  rows = 10;
  projetsFiltres:Projet[];
  private cols: ({ field: string; header: string; customExportHeader: string } | { field: string; header: string } | { field: string; header: string })[];

  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default();

        (doc as any).autoTable(this.exportColumns, this.portefeuilles$);
        doc.save('portefeuilles.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.portefeuilles$);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "portefeuilles");
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
  portefeuilles$:FamilleProjet[]
  tousPortefeuilles$:FamilleProjet[]
  constructor(private portefeuilleService:PortefeuilleService,private fb:FormBuilder,private authService:AuthentificationService
  ,private messageService: MessageService,private eventDrivenService:EventDrivenService) { }

  ngOnInit(): void {
    this.tousLesPortefeuilles();
  }

  tousLesPortefeuilles() {
    this.portefeuilleService.tousLesPortefeuilles().subscribe(portefeuilles => {
      this.portefeuilles$ = portefeuilles;
      this.tousPortefeuilles$ = portefeuilles;
    })
    this.eventDrivenService.sourceEventSubjectObservable.subscribe(
      (actionEvent: ActionEvent) => {
        let ret: FamilleProjet[] = []
        let projets: Projet[] = actionEvent.payload;
          if (actionEvent.type != ProjectActionTypes.Filtre_Non_Projets) {
            projets.forEach(p => {
              let found = false;
              ret.forEach(r => {
                if (r.codeFamille == p.familleProjet.codeFamille)
                  found = true;
              })
              if (!found)
                ret.push(p.familleProjet);
            })

            this.portefeuilles$ = ret;
          }else{
            this.portefeuilles$=this.tousPortefeuilles$;
          }

          console.log("actionEvent.type")
          console.log(actionEvent.type)

        this.cols = [
          { field: 'codeFamille', header: 'Code'},
          { field: 'titreFamille', header: 'Titre' },
          { field: 'description', header: 'description' },
        ];
        this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
        console.log(ret)
      },error => {
        console.log(error)
      })

      }



  //modifier un portefeuille
  portefeuilleFormGroup: FormGroup;
  submitted: boolean;
  editPortefeuille(p: FamilleProjet) {
    this.portefeuilleFormGroup=this.fb.group({
        codeFamille: [p.codeFamille,Validators.required],
        titreFamille: [p.titreFamille, Validators.required],
        description: [p.description, Validators.required],
      }
    )
  }
  addSingleSuccess(summary,detail) {
    this.messageService.add({severity:'success', summary:summary, detail:detail});
  }
  onSavePortefeuille() {
    this.submitted=true;
    this.portefeuilleService.update(this.portefeuilleFormGroup.value).subscribe(data=> {
      this.tousLesPortefeuilles();
      this.addSingleSuccess("Succ??s !","Vos modifications ont bien ??t?? enregistr??es.")
    }
  );
  }

  //supprimer un portefeuille
  codePortefeuille:string;
  titrePortefeuille:string;
  descPortefeuille:string;
  dtTrigger: any;

  confirmDeletePortefeuille(p:FamilleProjet){
    this.codePortefeuille=p.codeFamille;
    this.titrePortefeuille=p.titreFamille;
    this.descPortefeuille=p.description;
  }

  onDeletePortefeuille() {
    this.portefeuilleService.delete(this.codePortefeuille).subscribe(
      data=>{
        this.tousLesPortefeuilles()
        this.addSingleSuccess("Succ??s !","Le portefeuille a bien ??t?? supprim??.")

      }
    )
  }
}
