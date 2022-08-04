import { Component, OnInit } from '@angular/core';
import {AuthentificationService} from "../../../services/authentification.service";

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  active:string|null=null;
  constructor(private authService:AuthentificationService) { }
  prenom:string;
  ngOnInit(): void {
    this.prenomUser()
  }

  clickFamille(famille:string) {
    if(this.active==famille)
      this.active=null;
    else
      this.active=famille;
  }
  prenomUser()
  {
    this.authService.getUserbyEmail(this.authService.getEmail()).subscribe(
      user=>{
        this.prenom=user.prenom;
        console.log(this.prenom);
      }
    )
  }
}
