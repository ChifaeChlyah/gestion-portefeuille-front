import { Component, OnInit } from '@angular/core';
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-nouvel-employe',
  templateUrl: './nouvel-employe.component.html',
  styleUrls: ['./nouvel-employe.component.css']
})
export class NouvelEmployeComponent implements OnInit {
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
    //alert($event.value);
  }
  //dropdown Roles-----------------------------------
  constructor() { }

  ngOnInit(): void {
  }

}
