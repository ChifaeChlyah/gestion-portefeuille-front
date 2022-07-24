import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-projets',
  templateUrl: './table-projets.component.html',
  styleUrls: ['./table-projets.component.css']
})
export class TableProjetsComponent implements OnInit {
  projets=[
    {
      "codeProjet": "SIONEP",
      "titreProjet": "A11 - Mise en œuvre du SIONEP",
      "description": "Mise en œuvre intégrée des domaines CFI (sous SAP) et PEQ (sous Oracle)",
      "dateFinCible": "2003-12-01",
      "dateFinEffective": "2007-02-07",
      "pourcentageProgres": 0,
      "budget": 70333937.96,
      "cout": 0,
      "logo": "default.png",
      "familleProjet": {
        "codeFamille": "PSIN",
        "titreFamille": "PROJETS SYSTEMES D'INFORMATION",
        "description": "Cette famille comprend tout projet ayant comme objectif la refonte des composants du SI  de l'ONEP, ainsi que les AMO accompagnant l'exécution de ces projets font parti également de cette famille",

      }
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
