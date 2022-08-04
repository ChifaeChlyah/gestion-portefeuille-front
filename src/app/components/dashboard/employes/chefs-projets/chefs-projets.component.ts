import { Component, OnInit } from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {Ressource} from "../../../../model/Ressource.model";
import {RessourcesService} from "../../../../services/ressources.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
declare var $:any;
@Component({
  selector: 'app-chefs-projets',
  templateUrl: './chefs-projets.component.html',
  styleUrls: ['./chefs-projets.component.css']
})
export class ChefsProjetsComponent implements OnInit {
// Must be declared as "any", not as "DataTables.Settings"
  dtOptions: any = {};
  chefsProjets:Ressource[];

  constructor(private ressourceService:RessourcesService,private fb:FormBuilder) { }

  ngOnInit(): void {
    this.dtOptions = {


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
          "emptyTable":     "Aucun chef de projet disponible",
          "info":           "Total des chefs de projet : _TOTAL_",
          "infoEmpty":      "Total des chefs de projet : 0 ",
          "infoFiltered":   "(filtered from _MAX_ total entries)",
          "infoPostFix":    "",
          "thousands":      ",",
          "lengthMenu":     "Show _MENU_ entries",
          "loadingRecords": "Chargement...",
          "processing":     "",
          "search":         "Rechercher:",
          "zeroRecords":    "Aucun chef de projet retrouvé",
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
    this.tousLesChefs();
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });

  }
  tousLesChefs() {
    this.ressourceService.tousLesChef().subscribe((ret:Ressource[])=>{
      this.chefsProjets=ret;
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
}
