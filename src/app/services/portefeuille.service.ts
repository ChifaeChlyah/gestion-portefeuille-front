import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

import {FamilleProjet} from "../model/FamilleProjet.model";
import {AuthentificationService} from "./authentification.service";

@Injectable({
  providedIn: 'root'
})
export class PortefeuilleService {
  host:string;
  constructor(private http:HttpClient,private authService:AuthentificationService) {
    this.host=environment.host;
  }

  tousLesPortefeuilles():Observable<FamilleProjet[]>{
    return this.http.get<FamilleProjet[]>(this.host+"/tousLesPortefeuilles",
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
  }

  save(portefeuille:FamilleProjet):Observable<boolean> {
    let host = environment.host;
    return this.http.post<boolean>(host + "/add-portefeuille/", portefeuille,
      {headers: new HttpHeaders({'Authorization': this.authService.getToken()})});
  }
  get(code?:string):Observable<FamilleProjet>{
    let host=environment.host;
    return this.http.get<FamilleProjet>(host+"/familleProjets/"+code,
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
  }

  update(portefeuille:FamilleProjet):Observable<FamilleProjet>{
    let host=environment.host;
    return this.http.put<FamilleProjet>(host+"/familleProjets/"+portefeuille.codeFamille,portefeuille,
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
  }
  delete(code:string):Observable<FamilleProjet>{
    let host=environment.host;
    return this.http.delete<FamilleProjet>(host+"/familleProjets/"+code,
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
  }

}
