import {Component, OnInit} from "@angular/core";
import {AuthentificationService} from "../../services/authentification.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent implements OnInit {

constructor(public authService:AuthentificationService) {
}

  ngOnInit(): void {}

}
