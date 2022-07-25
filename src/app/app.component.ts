import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthentificationService} from "./services/authentification.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'gestionPortefeuilles_front';
  constructor(private router:Router,private authService:AuthentificationService) {
  }
  getUrl():string{
    return this.router.url;
  }
  ngOnInit(): void {
    if(!this.authService.estAuthentifie)
    {
      this.router.navigateByUrl("/connexion")
    }
  }
}
