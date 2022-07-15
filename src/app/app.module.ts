import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { NavBarTopComponent } from './components/nav-bar-top/nav-bar-top.component';
import {SidebarComponent} from "./components/dashboard/sidebar/sidebar.component";
import { AccueilComponent } from './components/dashboard/accueil/accueil.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BugsComponent } from './components/dashboard/bugs/bugs.component';
import { PortefeuilleComponent } from './components/dashboard/portefeuille/portefeuille.component';
import { EmployesComponent } from './components/dashboard/employes/employes.component';
import { HistoriqueComponent } from './components/dashboard/historique/historique.component';
import {
  RisquesParProjetsBarChartComponent
} from "./components/dashboard/accueil/charts/risques-par-projets-bar-chart/risques-par-projets-bar-chart.component";
import { StatutsProjetsRadarChartComponent } from './components/dashboard/accueil/charts/statuts-projets-radar-chart/statuts-projets-radar-chart.component';
import { TableProjetsComponent } from './components/dashboard/table-projets/table-projets.component';
import {ProjetsComponent} from "./components/dashboard/projets/projets.component";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxSliderModule} from "@angular-slider/ngx-slider";

import {DataTablesModule} from "angular-datatables";
import {NgxDateRangeModule} from "ngx-daterange";
import {DurationPickerModule} from "ngx-duration-picker";
import { ListeProjetsComponent } from './components/dashboard/projets/liste-projets/liste-projets.component';
import { ListePortefeuillesComponent } from './components/dashboard/projets/liste-portefeuilles/liste-portefeuilles.component';
import { GanttComponent } from './components/dashboard/projets/gantt/gantt.component';
import { StatistiquesComponent } from './components/dashboard/projets/statistiques/statistiques.component';
import { IntervenantsComponent } from './components/dashboard/projets/intervenants/intervenants.component';
import { NouveauProjetComponent } from './components/dashboard/projets/nouveau-projet/nouveau-projet.component';
import { NouveauPortefeuilleComponent } from './components/dashboard/projets/nouveau-portefeuille/nouveau-portefeuille.component';
import { MesTachesComponent } from './components/mes-taches/mes-taches.component';
import { MonEmploiComponent } from './components/mon-emploi/mon-emploi.component';
import { MesInfosComponent } from './components/mes-infos/mes-infos.component';


@NgModule({
  declarations: [
    AppComponent,
    ProjetsComponent,
    NavBarTopComponent,
    SidebarComponent,
    AccueilComponent,
    DashboardComponent,
    BugsComponent,
    PortefeuilleComponent,
    EmployesComponent,
    HistoriqueComponent,
    RisquesParProjetsBarChartComponent,
    StatutsProjetsRadarChartComponent,
    TableProjetsComponent,
    ListeProjetsComponent,
    ListePortefeuillesComponent,
    GanttComponent,
    StatistiquesComponent,
    IntervenantsComponent,
    NouveauProjetComponent,
    NouveauPortefeuilleComponent,
    MesTachesComponent,
    MonEmploiComponent,
    MesInfosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    NgxSliderModule,
    DurationPickerModule,
    NgxDateRangeModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
