import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
@Component({
  selector: 'app-nav-bar-top',
  templateUrl: './nav-bar-top.component.html',
  styleUrls: ['./nav-bar-top.component.css']
})
export class NavBarTopComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  getUrl():string{
    return this.router.url;
  }
}
