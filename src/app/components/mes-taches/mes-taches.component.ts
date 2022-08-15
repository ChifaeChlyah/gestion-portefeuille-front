import {Component, OnInit, ViewChild} from '@angular/core';
import {RessourcesService} from "../../services/ressources.service";
import {Tache} from "../../model/Tache.model";
import {Ressource} from "../../model/Ressource.model";
import {AuthentificationService} from "../../services/authentification.service";
import {MatAccordion} from "@angular/material/expansion";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {DatePipe} from "@angular/common";
declare var $:any;
@Component({
  selector: 'app-mes-taches',
  templateUrl: './mes-taches.component.html',
  styleUrls: ['./mes-taches.component.css']
})
export class MesTachesComponent implements OnInit {
  // @ViewChild("paginator") paginator: MatPaginator;
  // taches:Tache[]=new Array();
  // user:Ressource;
  // length = 100;
  // p: number = 1;
  // target :any
  // constructor(private ressourcesService:RessourcesService,private authService:AuthentificationService,
  //             public datepipe: DatePipe) { }

  ngOnInit(): void {
    // this.loadTaches();
  }
  // loadTaches(){
  //   this.authService.getUserbyEmail(this.authService.getEmail()).subscribe(
  //     user=>{
  //       this.user=user;
  //       this.ressourcesService.tachesAffectes(user.codeRessource).subscribe(
  //         taches=>{
  //            this.taches=taches;
  //
  //           })
  //         });
  //     }
}
