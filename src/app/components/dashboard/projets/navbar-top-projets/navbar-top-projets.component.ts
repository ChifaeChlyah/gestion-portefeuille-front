import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar-top-projets',
  templateUrl: './navbar-top-projets.component.html',
  styleUrls: ['./navbar-top-projets.component.css']
})
export class NavbarTopProjetsComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  getUrl() {
    return this.router.url;
  }
}
