import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

import {FamilleProjet} from "../model/FamilleProjet.model";

@Injectable({
  providedIn: 'root'
})
export class PortefeuilleService {
  host:string;
  constructor(private http:HttpClient) {
    this.host=environment.host;
  }

  tousLesPortefeuilles():Observable<FamilleProjet[]>{
    return this.http.get<FamilleProjet[]>(this.host+"/tousLesPortefeuilles");
  }

  save(portefeuille:FamilleProjet):Observable<FamilleProjet> {
    let host = environment.host;
    return this.http.post<FamilleProjet>(host + "/familleProjets/", portefeuille);
  }

  get(code?:string):Observable<FamilleProjet>{
    let host=environment.host;
    return this.http.get<FamilleProjet>(host+"/familleProjets/"+code);
  }

  update(portefeuille:FamilleProjet):Observable<FamilleProjet>{
    let host=environment.host;
    return this.http.put<FamilleProjet>(host+"/familleProjets/"+portefeuille.codeFamille,portefeuille);
  }
  delete(code:string):Observable<FamilleProjet>{
    let host=environment.host;
    return this.http.delete<FamilleProjet>(host+"/familleProjets/"+code);
  }

}
