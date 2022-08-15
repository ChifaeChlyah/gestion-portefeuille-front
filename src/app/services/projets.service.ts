import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Projet} from "../model/Projet.model";
import {AuthentificationService} from "./authentification.service";
import {FamilleProjet} from "../model/FamilleProjet.model";
import {Risque} from "../model/Risque.model";
import {Tache} from "../model/Tache.model";
import {PieceJointe} from "../model/PieceJointe.model";

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
  getProjetByCode(codeProjet):Observable<Projet>{
    let p=this.http.get<Projet>(this.host+"/projet-by-code/" +codeProjet,
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
    return p;
  }

  deletePiceJointe(idPieceJointe):Observable<PieceJointe>{
     return this.http.delete<PieceJointe>(this.host+"/delete-piece-jointe/" +idPieceJointe,
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
  }

  deleteProjet(codeProjet):Observable<Projet>{
     return this.http.delete<Projet>(this.host+"/delete-projet/" +codeProjet,
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
  }
  deleteRisque(idRisque):Observable<Risque>{
     return this.http.delete<Risque>(this.host+"/delete-risque/" +idRisque,
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
  }
  deleteAllTaches(idProjet):Observable<Projet>{
     return this.http.delete<Projet>(this.host+"/delete-all-taches/" +idProjet,
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
  }
  save(projet:Projet):Observable<Projet> {
    let host = environment.host;
    let proj=this.http.post<Projet>(host + "/add-projet", projet,
      {headers: new HttpHeaders({'Authorization': this.authService.getToken()})});
    return proj;
  }
  update(projet:Projet):Observable<Projet> {
    let host = environment.host;
    let proj=this.http.post<Projet>(host + "/update-projet", projet,
      {headers: new HttpHeaders({'Authorization': this.authService.getToken()})});
    return proj;
  }
  ajouterTaches(codeProjet,taches:Tache[]):Observable<Projet> {
    let host = environment.host;
    let proj=this.http.post<Projet>(host + "/add-tache/"+codeProjet, taches,
      {headers: new HttpHeaders({'Authorization': this.authService.getToken()})});
    return proj;
  }
  uploadLogo(file: File, codeProjet): Observable<HttpEvent<{}>>  {
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    const req = new HttpRequest('POST', this.host+'/upload-logo/'+codeProjet, formdata, {
      reportProgress: true,
      responseType: 'text',
      headers:new HttpHeaders({'Authorization':this.authService.getToken()})
    });
    return this.http.request(req);
  }

  addPieceJointe(p, codeProjet) {
    let formdata: FormData = new FormData();
    formdata.append('file', p.pieceJointe);
    formdata.append('desc', p.desc);
    let pieceJointe={pieceJointe:formdata,description:p.desc}
    const req = new HttpRequest('POST', this.host+'/upload-piece-jointe/'+codeProjet, formdata, {
      reportProgress: true,
      responseType: 'text',
      headers:new HttpHeaders({'Authorization':this.authService.getToken()})
    });
    return this.http.request(req);
  }
  addRisque(r:Risque,codeProjet)
  {
    let host = environment.host;
    return this.http.post<Risque>(host + "/add-risque/"+codeProjet, r,
      {headers: new HttpHeaders({'Authorization': this.authService.getToken()})});
  }
}
