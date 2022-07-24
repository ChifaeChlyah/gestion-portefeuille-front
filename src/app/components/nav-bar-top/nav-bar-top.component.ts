import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
declare var $:any;
@Component({
  selector: 'app-nav-bar-top',
  templateUrl: './nav-bar-top.component.html',
  styleUrls: ['./nav-bar-top.component.css']
})
export class NavBarTopComponent implements OnInit {

  constructor(private router:Router) { }
  initTooltipe(){
    $(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
    });
  }
  ngOnInit(): void {
    this.initTooltipe();
  }
  getUrl():string{
    return this.router.url;
  }
}
