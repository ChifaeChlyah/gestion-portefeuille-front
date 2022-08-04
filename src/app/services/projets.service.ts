import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Projet} from "../model/Projet.model";
import {AuthentificationService} from "./authentification.service";
import {FamilleProjet} from "../model/FamilleProjet.model";

@Injectable({
  providedIn: 'root'
})
export class ProjetsService {
  host:string;
  constructor(private http:HttpClient,private authService:AuthentificationService) {
    this.host=environment.host;
  }

  tousLesProjets():Observable<Projet[]>{
    return this.http.get<Projet[]>(this.host+"/tousLesProjets",
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
  }
  save(projet:Projet):Observable<Projet> {
    alert("here")
    let host = environment.host;
    let proj=this.http.post<Projet>(host + "/add-projet", projet,
      {headers: new HttpHeaders({'Authorization': this.authService.getToken()})});
    return proj;
  }

}
