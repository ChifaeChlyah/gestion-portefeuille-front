import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
declare var $:any
@Component({
  selector: 'app-navbar-top-empoyes',
  templateUrl: './navbar-top-empoyes.component.html',
  styleUrls: ['./navbar-top-empoyes.component.css']
})
export class NavbarTopEmpoyesComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
    });
  }
  getUrl() {
    return this.router.url;
  }
}
