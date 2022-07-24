import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProjetsService} from "../../../../services/projets.service";
import {PortefeuilleService} from "../../../../services/portefeuille.service";

@Component({
  selector: 'app-nouveau-portefeuille',
  templateUrl: './nouveau-portefeuille.component.html',
  styleUrls: ['./nouveau-portefeuille.component.css']
})
export class NouveauPortefeuilleComponent implements OnInit {
  portefeuilleFormGroup!:FormGroup;
  submitted: boolean;
  constructor(private fb:FormBuilder,private portefeuilleService:PortefeuilleService) { }

  ngOnInit(): void {
    this.portefeuilleFormGroup=this.fb.group({
        codeFamille: ["",Validators.required],
        titreFamille: ["", Validators.required],
        description: ["", Validators.required],
    }
    )
  }

  onSavePortefeuille() {
    this.submitted=true;
    if(this.portefeuilleFormGroup?.invalid) return;
    this.portefeuilleService.save(this.portefeuilleFormGroup.value).subscribe();
  }
}
