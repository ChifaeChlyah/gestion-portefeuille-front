import { Component, OnInit } from '@angular/core';
import {AuthentificationService} from "../../services/authentification.service";
import {Ressource} from "../../model/Ressource.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {
  mode:number=0;
  constructor(private fb:FormBuilder,private authService:AuthentificationService
  ,private router:Router) { }
  loginFormGroup!:FormGroup;
  submitted: boolean;
  ngOnInit(): void {
    this.loginFormGroup=this.fb.group({
        email: ["",Validators.required],
        password: ["", Validators.required]
      });

  }

  login() {
    this.submitted=true;
    if(this.loginFormGroup?.invalid) return;
    else{
      this.authService.login(this.loginFormGroup.value.email,this.loginFormGroup.value.password).subscribe(
        resp=>{
          let jwtToken=resp.headers.get("Authorization");
          // console.log(jwtToken)
          this.authService.saveToken(jwtToken);
          if(this.authService.estAdmin()||this.authService.estGestionnairePortefeuille())
            this.router.navigateByUrl("/accueil")
          else if(this.authService.estChefDeProjet())
             this.router.navigateByUrl("/projets/sonProjet")//*** à modifier
          else
            this.router.navigateByUrl("/projets/sonProjet")//*** à modifier
        },
        error => {
          this.mode=1;
        }
      )
    }
  }
}
