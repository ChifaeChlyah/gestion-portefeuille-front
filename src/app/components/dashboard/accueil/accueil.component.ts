import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  active:string|null=null;
  constructor() { }

  ngOnInit(): void {
  }

  clickFamille(famille:string) {
    if(this.active==famille)
      this.active=null;
    else
      this.active=famille;
  }
}
