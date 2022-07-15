import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {ProjetModel} from "../model/Projet.model";

@Injectable({
  providedIn: 'root'
})
export class ProjetsService {

  constructor(private http:HttpClient) { }

  tousLesProjets():Observable<ProjetModel[]>{
    let host=environment.host;
    return this.http.get<ProjetModel[]>(host+"/tousLesProjets");
  }


}
