import { Component, OnInit } from '@angular/core';
import {FamilleProjet} from "../../../../model/FamilleProjet.model";
import {Ressource} from "../../../../model/Ressource.model";
import {FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {RessourcesService} from "../../../../services/ressources.service";
import {environment} from "../../../../../environments/environment";
declare var $:any;
@Component({
  selector: 'app-liste-employes',
  templateUrl: './liste-employes.component.html',
  styleUrls: ['./liste-employes.component.css']
})
export class ListeEmployesComponent implements OnInit {
// Must be declared as "any", not as "DataTables.Settings"
  dtOptions: any = {};
  ressources:Ressource[];
  //form invalid si aucun role n'est selectionné
  rolesSelected: string[]=[];
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

  ngOnInit(): void {
    this.toutesLesRessources();
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
          "emptyTable":     "Aucune ressource disponible",
          "info":           "Total des ressources : _TOTAL_",
          "infoEmpty":      "Total des ressources : 0 ",
          "infoFiltered":   "(filtered from _MAX_ total entries)",
          "infoPostFix":    "",
          "thousands":      ",",
          "lengthMenu":     "Show _MENU_ entries",
          "loadingRecords": "Chargement...",
          "processing":     "",
          "search":         "Rechercher:",
          "zeroRecords":    "Aucune ressource retrouvée",
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
  toutesLesRessources() {
    this.ressourceService.tous().subscribe((ret:Ressource[])=>{
      this.ressources=ret;
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
