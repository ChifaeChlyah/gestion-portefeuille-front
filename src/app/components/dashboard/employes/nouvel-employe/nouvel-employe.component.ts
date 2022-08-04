import { Component, OnInit } from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RessourcesService} from "../../../../services/ressources.service";

@Component({
  selector: 'app-nouvel-employe',
  templateUrl: './nouvel-employe.component.html',
  styleUrls: ['./nouvel-employe.component.css']
})
export class NouvelEmployeComponent implements OnInit {
  ressourceFormGroup: FormGroup;
  submitted: boolean;
  private noRoleSelected: boolean=true;
  rolesSelected: string[]=[];

  //dropdown Roles-----------------------------------
  configDropdownRoles={
    placeholder:'Roles',
    search:false
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
    this.ressourceFormGroup=this.fb.group({
        nom: ["", Validators.required],
        prenom: ["", Validators.required],
        email: ["", Validators.required],
      password: ["", Validators.required],
        tel: ["", Validators.required],
        emploi: ["", Validators.required]
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
    this.ressourceService.save(this.ressourceFormGroup.value).subscribe(data=> {
      alert("success");
    });
  }
}
