import { Component, OnInit } from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {Ressource} from "../../../../model/Ressource.model";
import {RessourcesService} from "../../../../services/ressources.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Projet} from "../../../../model/Projet.model";
declare var $:any;
import * as FileSaver from 'file-saver';
import {MessageService} from "primeng/api";
@Component({
  selector: 'app-chefs-projets',
  templateUrl: './chefs-projets.component.html',
  styleUrls: ['./chefs-projets.component.css']
})
export class ChefsProjetsComponent implements OnInit {
  exportColumns: any[];
  rows = 10;
  private cols: ({ field: string; header: string; customExportHeader: string } | { field: string; header: string } | { field: string; header: string })[];

  chefsProjets:Ressource[];
  modalChef:Ressource=new Ressource();
  host=environment.host;
  modalProjets:Projet[];
  constructor(private ressourceService:RessourcesService,
              private fb:FormBuilder,
    private messageService: MessageService) { }

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

        (doc as any).autoTable(this.exportColumns, this.chefsProjets);
        doc.save('chefs_de_projets.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.chefsProjets);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "chefs_de_projets");
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


    this.tousLesChefs();
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });

  }
  tousLesChefs() {
    this.ressourceService.tousLesChef().subscribe((ret:Ressource[])=>{
      this.chefsProjets=ret;
      this.cols = [
        { field: 'codeRessource', header: 'Code'},
        { field: 'nom', header: 'Nom' },
        { field: 'prenom', header: 'Prénom' },
        { field: 'email', header: 'Email' },
        { field: 'tel', header: 'Téléphone' },
        { field: 'emploi', header: 'Emploi' },
      ];
      this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));

      console.log(ret)
    },error => {
      console.log(error)
    })
  }

  //modifier une ressource
  ressourceFormGroup: FormGroup;
  submitted: boolean;
  rolesSelected: string[]=[];
  editRessource(p: Ressource) {
    let nomsRoles:string[]=[];
    p.roles.forEach(r=>
    {
      nomsRoles.push(r.nomRole)
    });
    this.rolesSelected=nomsRoles;
    console.log(nomsRoles);
    this.ressourceFormGroup=this.fb.group({
        codeRessource: [p.codeRessource,Validators.required],
        nom: [p.nom, Validators.required],
        prenom: [p.prenom, Validators.required],
        email: [p.email, Validators.required],
        tel: [p.tel, Validators.required],
        emploi: [p.emploi, Validators.required],
        roles: [nomsRoles],
      }
    )
  }
  onSaveRessource() {
    this.submitted=true;
    if(this.ressourceFormGroup.invalid) {
      console.log("invalid")
      const controls = this.ressourceFormGroup.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          console.log(controls[name])
        }
      }
    }
    this.ressourceFormGroup.value.roles=this.ressourceService.getRoles(this.rolesSelected);
    this.ressourceService.update(this.ressourceFormGroup.value).subscribe(data=> {
        this.tousLesChefs();
      this.addSingleSuccess("Succès !","Vos modifications ont bien été enregistrées.")


      // alert("success ressource update");
      }
    );
  }


  //supprimer une ressource
  codeRessource:bigint;
  nom:string;
  prenom:string;
  emploi:string;
  confirmDeleteRessource(p:Ressource){
    this.codeRessource=p.codeRessource;
    this.nom=p.nom;
    this.prenom=p.prenom;
    this.emploi=p.emploi
  }

  onDeleteRessource() {
    this.ressourceService.delete(this.codeRessource).subscribe(
      data=>{
        this.tousLesChefs()
      }

    )
  }

  loadModalChef(chef:Ressource) {
    this.modalChef=chef;
    this.ressourceService.projetsGeres(chef.codeRessource).subscribe(
      projets=>{
        this.modalProjets=projets;
      }
    )
  }
}
