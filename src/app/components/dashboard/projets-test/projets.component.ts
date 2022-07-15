import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ProjetModel} from "../../../model/Projet.model";
import {ProjetsService} from "../../../services/projets.service";

@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.css']
})
export class ProjetsComponent implements OnInit {
  projets$?: Observable<ProjetModel[]>;

  constructor(private projetsService:ProjetsService) { }

  ngOnInit(): void {
    this.projets$=this.projetsService.tousLesProjets();
  }

}
