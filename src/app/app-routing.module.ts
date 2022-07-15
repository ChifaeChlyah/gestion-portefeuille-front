import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AccueilComponent} from "./components/dashboard/accueil/accueil.component";
import {ProjetsComponent} from "./components/dashboard/projets/projets.component";
import {ListeProjetsComponent} from "./components/dashboard/projets/liste-projets/liste-projets.component";
import {
  ListePortefeuillesComponent
} from "./components/dashboard/projets/liste-portefeuilles/liste-portefeuilles.component";
import {GanttComponent} from "./components/dashboard/projets/gantt/gantt.component";
import {StatistiquesComponent} from "./components/dashboard/projets/statistiques/statistiques.component";
import {IntervenantsComponent} from "./components/dashboard/projets/intervenants/intervenants.component";
import {NouveauProjetComponent} from "./components/dashboard/projets/nouveau-projet/nouveau-projet.component";
import {
  NouveauPortefeuilleComponent
} from "./components/dashboard/projets/nouveau-portefeuille/nouveau-portefeuille.component";
import {MesTachesComponent} from "./components/mes-taches/mes-taches.component";
import {MonEmploiComponent} from "./components/mon-emploi/mon-emploi.component";
import {MesInfosComponent} from "./components/mes-infos/mes-infos.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";

const routes: Routes = [
  // {path:"tousLesProjets",component:ProjetsComponent},
  {path:"",component:DashboardComponent,
    children: [
      {path:"accueil",component:AccueilComponent},
      {path:"projets",component:ProjetsComponent,
        children: [
          {
            path: 'liste-projets',
            component:ListeProjetsComponent,
          },
          {
            path: 'liste-portefeuilles',
            component:ListePortefeuillesComponent
          },
          {
            path: 'gantt',
            component:GanttComponent
          },
          {
            path: 'statistiques',
            component:StatistiquesComponent
          },
          {
            path: 'intervenants',
            component:IntervenantsComponent
          },
          {
            path: 'nouveau-projet',
            component:NouveauProjetComponent
          },
          {
            path: 'nouveau-portefeuille',
            component:NouveauPortefeuilleComponent
          },
        ]}
    ]},
  {
    path: 'mes-taches',
    component:MesTachesComponent
  },
  {
    path: 'mon-emploi',
    component:MonEmploiComponent
  },
  {
    path: 'mes-infos',
    component:MesInfosComponent
  }
  ];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
