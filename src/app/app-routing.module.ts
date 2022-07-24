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
import {ConnexionComponent} from "./components/connexion/connexion.component";
import {EmployesComponent} from "./components/dashboard/employes/employes.component";
import {ListeEmployesComponent} from "./components/dashboard/employes/liste-employes/liste-employes.component";
import {ListeEquipesComponent} from "./components/dashboard/employes/liste-equipes/liste-equipes.component";
import {NouvelleEquipeComponent} from "./components/dashboard/employes/nouvelle-equipe/nouvelle-equipe.component";
import {NouvelEmployeComponent} from "./components/dashboard/employes/nouvel-employe/nouvel-employe.component";
import {ChefsProjetsComponent} from "./components/dashboard/employes/chefs-projets/chefs-projets.component";
import {DetailsEmployeComponent} from "./components/dashboard/employes/details-employe/details-employe.component";

const routes: Routes = [
  // {path:"tousLesProjets",component:ProjetsComponent},
  {path:"connexion",component:ConnexionComponent},
  {path:"",component:DashboardComponent,
    children: [
      {path:"accueil",component:AccueilComponent},
      {path:"",component:AccueilComponent},
      {path:"ressources",component:EmployesComponent,
        children: [
          {
            path: 'liste-ressources',
            component:ListeEmployesComponent,
          },
          {
            path: 'liste-equipes',
            component:ListeEquipesComponent
          },
          {
            path: 'nouvelle-équipe',
            component:NouvelleEquipeComponent
          },
          {
            path: 'nouvelle-ressource',
            component:NouvelEmployeComponent
          },
          {
            path: 'chefs-projets',
            component:ChefsProjetsComponent
          },
          {
            path: 'details-ressource',
            component:DetailsEmployeComponent
          }

    ]},
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
