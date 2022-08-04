import { Component, OnInit } from '@angular/core';
import {Projet} from "../../../../model/Projet.model";
import {ProjetsService} from "../../../../services/projets.service";
import {FamilleProjet} from "../../../../model/FamilleProjet.model";
import {PortefeuilleService} from "../../../../services/portefeuille.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthentificationService} from "../../../../services/authentification.service";

@Component({
  selector: 'app-liste-portefeuilles',
  templateUrl: './liste-portefeuilles.component.html',
  styleUrls: ['./liste-portefeuilles.component.css']
})
export class ListePortefeuillesComponent implements OnInit {
  dtOptions: any = {};
  portefeuilles$:FamilleProjet[]
  constructor(private portefeuilleService:PortefeuilleService,private fb:FormBuilder,private authService:AuthentificationService) { }

  ngOnInit(): void {
    this.tousLesPortefeuilles();
    this.dtOptions = {
      // Declare the use of the extension in the dom parameter
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
        // 'columnsToggle',
        { "extend": 'excel', "text":'Excel  <i style="margin-left:5px" class="fa-solid fa-file-excel"></i>',"className": 'btn btn-default btn-xs' },
        { "extend": 'colvis', "text":'Filtrer <i class="fa-solid fa-filter"></i>',"className": 'btn btn-default btn-xs' },
        { "extend": 'copy', "text":'Copier <i class="fa-solid fa-copy"></i>',"className": 'btn btn-default btn-xs' },
        // 'print',
      ],
      language:
        {
          "decimal":        "",
          "emptyTable":     "Aucun Projet disponible",
          "info":           "Total des projets : _TOTAL_",
          "infoEmpty":      "Total des projets : 0 ",
          "infoFiltered":   "(filtered from _MAX_ total entries)",
          "infoPostFix":    "",
          "thousands":      ",",
          "lengthMenu":     "Show _MENU_ entries",
          "loadingRecords": "Chargement...",
          "processing":     "",
          "search":         "Rechercher:",
          "zeroRecords":    "Aucun projet retrouvé",
          "paginate": {
            "first":      "Premier",
            "last":       "Dernier",
            "next":       "Suivant",
            "previous":   "Précédant"
          },
          "aria": {
            "sortAscending":  ": activate to sort column ascending",
            "sortDescending": ": activate to sort column descending"
          }
        },
      pagingType:'full_numbers'
    };
  }

  tousLesPortefeuilles() {
    this.portefeuilleService.tousLesPortefeuilles().subscribe((ret:FamilleProjet[])=>{
      this.portefeuilles$=ret;
      console.log(ret)
    },error => {
      console.log(error)
    })
  }

  //modifier un portefeuille
  portefeuilleFormGroup: FormGroup;
  submitted: boolean;
  editPortefeuille(p: FamilleProjet) {
    this.portefeuilleFormGroup=this.fb.group({
        codeFamille: [p.codeFamille,Validators.required],
        titreFamille: [p.titreFamille, Validators.required],
        description: [p.description, Validators.required],
      }
    )
  }
  onSavePortefeuille() {
    this.submitted=true;
    this.portefeuilleService.update(this.portefeuilleFormGroup.value).subscribe(data=> {
      this.tousLesPortefeuilles();
      alert("success projet update");

    }
  );
  }


  //supprimer un portefeuille
  codePortefeuille:string;
  titrePortefeuille:string;
  descPortefeuille:string;
  confirmDeletePortefeuille(p:FamilleProjet){
    this.codePortefeuille=p.codeFamille;
    this.titrePortefeuille=p.titreFamille;
    this.descPortefeuille=p.description;
  }

  onDeletePortefeuille() {
    this.portefeuilleService.delete(this.codePortefeuille).subscribe(
      data=>{
        this.tousLesPortefeuilles()
      }
    )
  }
}
