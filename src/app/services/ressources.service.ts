import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from "@angular/common/http";
import {AuthentificationService} from "./authentification.service";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {FamilleProjet} from "../model/FamilleProjet.model";
import {Ressource} from "../model/Ressource.model";
import {Role} from "../model/Role.model";

@Injectable({
  providedIn: 'root'
})
export class RessourcesService {
  host:string;
  roles:Role[]
  constructor(private http:HttpClient,private authService:AuthentificationService) {
    this.host=environment.host;
    this.getAllRoles();
  }

  tous():Observable<Ressource[]>{
    return this.http.get<Ressource[]>(this.host+"/toutesLesRessources",
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
  }
  getRoles(nomsRoles:string[]):Role[]{
    this.getAllRoles();
    let roles:Role[]=[];
    let roles2=this.roles;
    console.log(nomsRoles)
    console.log(roles2);
    for (let index = 0; index < nomsRoles.length; ++index) {
      for (let index2 = 0; index2 < roles2.length; ++index2)
      {
        if(roles2[index2].nomRole==nomsRoles[index])
        {
          let role:Role=new Role();
          role.nomRole=nomsRoles[index];
          role.codeRole=roles2[index2].codeRole;
          roles.push(role);
        }
      }
    }
    return roles;
  }
  getAllRoles(){
    this.http.get<Role[]>(this.host+"/tousLesRoles",
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})}).subscribe(
        roles=>
        {
          console.log("AllRoles");
          console.log(roles);
          this.roles=roles;

        }
    )
  }
  save(ressource:Ressource):Observable<Ressource> {
    let host = environment.host;
    return this.http.post<Ressource>(host + "/nouvelle-ressource/", ressource,
      {headers: new HttpHeaders({'Authorization': this.authService.getToken()})});
  }
  get(code?:string):Observable<Ressource>{
    let host=environment.host;
    return this.http.get<Ressource>(host+"/ressources/"+code,
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
  }

  update(ressource:Ressource):Observable<Ressource>{
    let host=environment.host;
    let roles=[];
    let rs=ressource.roles;
    for(const r of rs)
    {
      let role=new Role();
      role.codeRole=r.codeRole;
      role.nomRole=r.nomRole;
      roles.push(role);
    }
    ressource.roles=roles;
    return this.http.put<Ressource>(host+"/update-ressource/"+ressource.codeRessource,ressource,
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
  }
  updateWithoutRoles(ressource:Ressource):Observable<Ressource>{
    let host=environment.host;
    return this.http.put<Ressource>(host+"/update-ressource-sans-roles/"+ressource.codeRessource,ressource,
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
  }
  changePassword(changePasswordForm:any, code:bigint):Observable<boolean>{
    let host=environment.host;
    return this.http.post<boolean>(host+"/change_password/"+code,changePasswordForm,
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
  }
  delete(code:bigint):Observable<Ressource>{
    let host=environment.host;
    return this.http.delete<Ressource>(host+"/ressources/"+code,
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
  }

  tousLesChef():Observable<Ressource[]> {
    let host=environment.host;
    return this.http.get<Ressource[]>(host+"/tousLesChef/",
      {headers:new HttpHeaders({'Authorization':this.authService.getToken()})});
  }

  uploadPhoto(file: File, codeUser): Observable<HttpEvent<{}>>  {
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    const req = new HttpRequest('POST', this.host+'/upload-user-photo/'+codeUser, formdata, {
      reportProgress: true,
      responseType: 'text',
      headers:new HttpHeaders({'Authorization':this.authService.getToken()})
    });
    return this.http.request(req);
  }
}
