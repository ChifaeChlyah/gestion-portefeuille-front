import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthentificationService} from "../../services/authentification.service";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService:AuthentificationService,private router:Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(this.isAuthorised(route))
    return this.isAuthorised(route);
  }
  private isAuthorised(route:ActivatedRouteSnapshot):boolean
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
    // if(accept==false)
    // {
    //   if(this.router.url=="/accueil") {
    //     if (this.authService.estChefDeProjet())
    //       this.router.navigateByUrl("/mes-projets-geres")
    //     else
    //       this.router.navigateByUrl("/mes-projets-affectes")
    //   }
    //   else
    //     this.router.navigateByUrl("/forbidden")
    // }
    return accept;
  }
}
