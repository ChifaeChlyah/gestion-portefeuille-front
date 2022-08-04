import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthentificationService} from "../../services/authentification.service";
import {Observable} from "rxjs";
declare var $:any;
@Component({
  selector: 'app-nav-bar-top',
  templateUrl: './nav-bar-top.component.html',
  styleUrls: ['./nav-bar-top.component.css']
})
export class NavBarTopComponent implements OnInit {
  prenom:string;
  constructor(private router:Router, public authService:AuthentificationService) { }
  initTooltipe(){
    // $(document).ready(function(){
    //   $('[data-toggle="tooltip"]').tooltip();
    // });
  }
  ngOnInit(): void {
    this.initTooltipe();
    this.prenomUser();
  }
  getUrl():string{
    return this.router.url;
  }

  logout() {
    localStorage.setItem('token',null)
    this.router.navigateByUrl("/connexion");
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
