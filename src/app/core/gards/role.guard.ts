import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthentificationService} from "../../services/authentification.service";
import {RessourcesService} from "../../services/ressources.service";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService:AuthentificationService,private router:Router,private ressourcesService:RessourcesService) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(state)
    return this.isAuthorised(route,state);
  }
  private isAuthorised(route:ActivatedRouteSnapshot,state):boolean
  {
    let accept=false;
    const RolesPermis=route.data['RolesPermis'];
    let roles=this.authService.getRoles();
    roles.forEach(role=>{
      RolesPermis.forEach(r=>{
        if(r==role.authority)
          accept=true;
      });
    });
    let rolesNonPermis=route.data['RolesNonPermis']
    if(rolesNonPermis!=undefined)
      roles.forEach(role=>{
        rolesNonPermis.forEach(r=>{
          if(r==role.authority)
            accept=false;
        });
      });
    // this.codeProjet = this.route.snapshot.paramMap.get('codeProjet')
    if(accept==false)
    {
      if(state.url=="/") {
        if (this.authService.estChefDeProjet())
          this.router.navigateByUrl("/mes-projets-geres")
        else
          this.router.navigateByUrl("/mes-projets-affectes")
      }
      else
        this.router.navigateByUrl("/forbidden")
    }

    return accept;
  }
}
