import {Component, OnInit, ViewChild} from '@angular/core';
import {RessourcesService} from "../../services/ressources.service";
import {Tache} from "../../model/Tache.model";
import {Ressource} from "../../model/Ressource.model";
import {AuthentificationService} from "../../services/authentification.service";
import {MatAccordion} from "@angular/material/expansion";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
declare var $:any;
@Component({
  selector: 'app-mes-taches',
  templateUrl: './mes-taches.component.html',
  styleUrls: ['./mes-taches.component.css']
})
export class MesTachesComponent implements OnInit {
  @ViewChild("paginator") paginator: MatPaginator;
  taches:Tache[]=new Array();
  user:Ressource;
  length = 100;
  p: number = 1;
  target :any;
  options  = {
    floor: 0,
    ceil: 100
  };
  mesTachesPage=false;
  constructor(private ressourcesService:RessourcesService,private authService:AuthentificationService,
              public datepipe: DatePipe,private router:Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    if(this.router.url =="/mes-taches")
    {
      this.mesTachesPage=true;
    }

    this.loadTaches();
  }
  loadTaches() {
    if (this.mesTachesPage) {
      this.authService.getUserbyEmail(this.authService.getEmail()).subscribe(
        user => {
          this.user = user;
          this.ressourcesService.tachesAffectes(user.codeRessource).subscribe(
            taches => {
              this.taches = taches;
              console.log("taches")
              console.log(taches)
              this.taches.forEach(
                t => {
                  this.ressourcesService.projetParTache(t.idTache).subscribe(
                    projet => {
                      t.projet = projet;
                      console.log(t)
                    }
                  )
                }
              )
            })
        });
    }
    else{
      this.ressourcesService.tachesAffectes(this.route.snapshot.paramMap.get('codeRessource')).subscribe(
        taches => {
          this.taches = taches;
          this.taches.forEach(
            t => {
              this.ressourcesService.projetParTache(t.idTache).subscribe(
                projet => {
                  t.projet = projet;
                  console.log(t)
                }
              )
            }
          )
        })
    }
  }
}
