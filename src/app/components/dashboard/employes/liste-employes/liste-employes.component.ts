import { Component, OnInit } from '@angular/core';
import {FamilleProjet} from "../../../../model/FamilleProjet.model";
import {Ressource} from "../../../../model/Ressource.model";
import {FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {RessourcesService} from "../../../../services/ressources.service";
import {environment} from "../../../../../environments/environment";
declare var $:any;
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-liste-employes',
  templateUrl: './liste-employes.component.html',
  styleUrls: ['./liste-employes.component.css']
})
export class ListeEmployesComponent implements OnInit {
  exportColumns: any[];
  rows = 10;
  private cols: ({ field: string; header: string; customExportHeader: string } | { field: string; header: string } | { field: string; header: string })[];

// Must be declared as "any", not as "DataTables.Settings"
  ressources:Ressource[];
  //form invalid si aucun role n'est selectionné
  rolesSelected: string[]=[];
  host=environment.host;
  noRoleSelected:boolean;
  //form invalid si aucun role n'est selectionné
  //dropdown Roles-----------------------------------
  configDropdownRoles={
    placeholder:'Roles',
    search:false,
  }
  dropdownOptionsRoles=[
    environment.ADMIN_ROLE,
    environment.GESTIONNAIRE_PORTEFEUILLES_ROLE,
    environment.CHEF_PROJET_ROLE,
    environment.INTERVENANT_DEVELOPPEUR_ROLE,
  ];
  selectionChangedRoles($event: any) {
    this.noRoleSelected=(this.rolesSelected.length==0);
  }
  //dropdown Roles-----------------------------------
  constructor(private ressourceService:RessourcesService,private fb:FormBuilder) { }
  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default();

        (doc as any).autoTable(this.exportColumns, this.ressources);
        doc.save('ressources.pdf');
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.ressources);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "ressources");
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
    this.toutesLesRessources();
  }
  toutesLesRessources() {
    this.ressourceService.tous().subscribe((ret:Ressource[])=>{
      this.ressources=ret;
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
  editRessource(p: Ressource) {
    let nomsRoles:string[]=[];
    p.roles.forEach(r=>
    {
      nomsRoles.push(r.nomRole)
    });
    this.rolesSelected=nomsRoles;
    this.noRoleSelected=(this.rolesSelected.length==0);
      console.log(nomsRoles);
    this.ressourceFormGroup=this.fb.group({
        codeRessource: [p.codeRessource,Validators.required],
        nom: [p.nom, Validators.required],
        prenom: [p.prenom, Validators.required],
        email: [p.email, Validators.required],
        tel: [p.tel, Validators.required],
        emploi: [p.emploi, Validators.required],
        roles: [nomsRoles],
      },
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
        this.toutesLesRessources();
        // alert("success ressource update");
      }
    );
  }
  estDeveloppeur(r:Ressource)
  {
    let estdev=false;
    r.roles.forEach(
      r=>{
        if(r.nomRole==environment.INTERVENANT_DEVELOPPEUR_ROLE)
          estdev=true;
      }
    )
    return estdev
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
        this.toutesLesRessources()
      }
    )
  }
}
