import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Route, Router} from "@angular/router";
import {RessourcesService} from "../../../../services/ressources.service";
import {Ressource} from "../../../../model/Ressource.model";
import {environment} from "../../../../../environments/environment";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthentificationService} from "../../../../services/authentification.service";
import {Projet} from "../../../../model/Projet.model";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-details-employe',
  templateUrl: './details-employe.component.html',
  styleUrls: ['./details-employe.component.css']
})
export class DetailsEmployeComponent implements OnInit {
  codeRessource;
  ressource:Ressource;
  host=environment.host;
  rolesSelected: string[]=[];
  noRoleSelected:boolean;
  isIntervenant:boolean;
  projetsGeres:Projet[];
  dtOptions: any = {};
  constructor(private route:ActivatedRoute,private ressourcesService:RessourcesService,
              private fb:FormBuilder,public authService: AuthentificationService,
              public datepipe:DatePipe, private router:Router) { }
//modifier une ressource
  ressourceFormGroup: FormGroup;
  submitted: boolean;
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
      return;
    }
    this.ressourceFormGroup.value.roles=this.ressourcesService.getRoles(this.rolesSelected);
    this.ressourcesService.update(this.ressourceFormGroup.value).subscribe(data=> {
      this.ressourcesService.get(this.codeRessource).subscribe(ressource=>{
        this.ressource=ressource;
      })
      }
    );
  }



  ngOnInit(): void {
    this.codeRessource = this.route.snapshot.paramMap.get('codeRessource');
    this.ressourcesService.get(this.codeRessource).subscribe(ressource=>{
      this.ressource=ressource;
      this.ressource.roles.forEach(r=>{
        if(r.nomRole==environment.INTERVENANT_DEVELOPPEUR_ROLE)
          this.isIntervenant=true;
      })
      if(!this.isIntervenant)
      {
        this.router.navigateByUrl("/not-found");
      }
    })
  }

}
