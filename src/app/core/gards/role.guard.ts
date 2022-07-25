import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthentificationService} from "../../services/authentification.service";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService:AuthentificationService) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(this.isAuthorised(route))
    return this.isAuthorised(route);
  }
  private isAuthorised(route:ActivatedRouteSnapshot):boolean
  {
    let authorised:boolean=false;
    const roles=[];
    console.log(this.authService.userAuthentife);
    this.authService.userAuthentife.roles.forEach(r=>
    {
      roles.push(r.nomRole);
    })
    const expectedRoles=route.data['expectedRoles'];
    roles.forEach(role=>
    {
      expectedRoles.forEach(expectedRole=>
      {
        if(role==expectedRole)
          authorised=true;
      })
    })
    return authorised;
  }
}
