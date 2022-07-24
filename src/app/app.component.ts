import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'gestionPortefeuilles_front';
  constructor(private router:Router) {
  }
  getUrl():string{
    return this.router.url;
  }

  ngOnInit(): void {
  }
}
