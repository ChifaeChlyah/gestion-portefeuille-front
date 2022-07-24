import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Projet} from "../model/Projet.model";

@Injectable({
  providedIn: 'root'
})
export class ProjetsService {
  host:string;
  constructor(private http:HttpClient) {
    this.host=environment.host;
  }

  tousLesProjets():Observable<Projet[]>{
    return this.http.get<Projet[]>(this.host+"/tousLesProjets");
  }


}
