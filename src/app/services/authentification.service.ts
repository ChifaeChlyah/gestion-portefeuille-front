import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Ressource} from "../model/Ressource.model";
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  host:string;
  ressources:Ressource[];
  userAuthentife:Ressource;
  roles:Array<any>
  constructor(private http:HttpClient,private router:Router) {
    this.host=environment.host;
  }


  public login(email:string,password:string){
    let user={"email":email,"password":password};
    console.log(user);
    return this.http.post(this.host+"/login",user,{observe:"response"});
  }
  public saveToken(jwt:string)
  {
    localStorage.setItem('token',jwt);
    let jwtHelper=new JwtHelperService();
    this.roles=jwtHelper.decodeToken(this.getToken()).roles;
  }

  getRoles(){
    let jwtHelper=new JwtHelperService();
    return jwtHelper.decodeToken(this.getToken()).roles;
  }
  getToken()
  {
    return localStorage.getItem('token');
  }
  estAdmin()
  {
    let roles=this.getRoles()
    for(let r of roles)
    {
      if(r.authority==environment.ADMIN_ROLE) return true;
    }
    return false;
  }
  estGestionnairePortefeuille()
  {
    let roles=this.getRoles()
    for(let r of roles)
    {
      if(r.authority==environment.GESTIONNAIRE_PORTEFEUILLES_ROLE) return true;
    }
    return false;
  }
  estChefDeProjet()
  {
    let roles=this.getRoles()
    for(let r of roles)
    {
      if(r.authority==environment.CHEF_PROJET_ROLE) return true;
    }
    return false;
  }
  estDeveloppeur()
  {
    let roles=this.getRoles()
    for(let r of roles)
    {
      if(r.authority==environment.INTERVENANT_DEVELOPPEUR_ROLE) return true;
    }
    return false;
  }
  getUser()
  {
    let jwtHelper=new JwtHelperService();
    try {
      return jwtHelper.decodeToken(this.getToken()).sub;
    } catch(e) {
      return null;
    }
  }
  estAuthentifie(){
  }
}
