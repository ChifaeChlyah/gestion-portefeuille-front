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
import {AuthGuard} from "./core/gards/auth.guard";
import {environment} from "../environments/environment";
import {RoleGuard} from "./core/gards/role.guard";
import {ForbiddenComponent} from "./components/forbidden/forbidden.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {MesProjetsGeresComponent} from "./components/mes-projets-geres/mes-projets-geres.component";
import {MesProjetsAffecteComponent} from "./components/mes-projets-affecte/mes-projets-affecte.component";
import {ReportsBugsComponent} from "./components/reports-bugs/reports-bugs.component";
import {DetailsProjetComponent} from "./components/dashboard/projets/details-projet/details-projet.component";

const routes: Routes = [
  // {path:"tousLesProjets",component:ProjetsComponent},
  {path:"forbidden",component:ForbiddenComponent},
  {path:"connexion",component:ConnexionComponent},
  {path:"mes-projets-geres",component:MesProjetsGeresComponent,
    canActivate:[AuthGuard,RoleGuard],
    data:{
      RolesPermis:[environment.CHEF_PROJET_ROLE
      ]
    },},
  {path:"mes-projets-affectes",component:MesProjetsAffecteComponent,
    canActivate:[AuthGuard,RoleGuard],
    data:{
      RolesPermis:[environment.INTERVENANT_DEVELOPPEUR_ROLE
      ]
    },},
  {path:"reporter-un-bug",component:ReportsBugsComponent,
    canActivate:[AuthGuard,RoleGuard],
    data:{
      RolesPermis:[environment.INTERVENANT_DEVELOPPEUR_ROLE,
        environment.GESTIONNAIRE_PORTEFEUILLES_ROLE,
        environment.CHEF_PROJET_ROLE
      ],
      RolesNonPermis:[environment.ADMIN_ROLE
      ]
    },},
  {path:"",component:DashboardComponent,

    children: [
      {path:"accueil",component:AccueilComponent,
        canActivate:[AuthGuard,RoleGuard],
        data:{
          RolesPermis:[environment.ADMIN_ROLE,
            environment.GESTIONNAIRE_PORTEFEUILLES_ROLE
          ]
        },},
      {path:"",component:AccueilComponent,
        canActivate:[AuthGuard,RoleGuard],
        data:{
          RolesPermis:[environment.ADMIN_ROLE,
            environment.GESTIONNAIRE_PORTEFEUILLES_ROLE
          ]
        },},
      {path:"ressources",component:EmployesComponent,
        canActivate:[AuthGuard,RoleGuard],
        data:{
          RolesPermis:[environment.ADMIN_ROLE,
            environment.GESTIONNAIRE_PORTEFEUILLES_ROLE
          ]
        },
        children: [
          {
            path: 'liste-ressources',
            component:ListeEmployesComponent,
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
            canActivate:[AuthGuard,RoleGuard],
            data:{
              RolesPermis:[environment.ADMIN_ROLE,
                environment.GESTIONNAIRE_PORTEFEUILLES_ROLE
              ]
            },
          },
          {
            path: 'liste-portefeuilles',
            component:ListePortefeuillesComponent,
            canActivate:[AuthGuard,RoleGuard],
            data:{
              RolesPermis:[environment.ADMIN_ROLE,
                environment.GESTIONNAIRE_PORTEFEUILLES_ROLE
              ]
            },
          },
          {
            path: 'gantt',
            component:GanttComponent,
            canActivate:[AuthGuard,RoleGuard],
            data:{
              RolesPermis:[environment.ADMIN_ROLE,
                environment.GESTIONNAIRE_PORTEFEUILLES_ROLE,
                environment.CHEF_PROJET_ROLE
              ]
            },
          },
          {
            path: 'statistiques',
            component:StatistiquesComponent,
            canActivate:[AuthGuard,RoleGuard],
            data:{
              RolesPermis:[environment.ADMIN_ROLE,
                environment.GESTIONNAIRE_PORTEFEUILLES_ROLE
              ]
            },
          },
          {
            path: 'intervenants',
            component:IntervenantsComponent,
            canActivate:[AuthGuard,RoleGuard],
            data:{
              RolesPermis:[environment.ADMIN_ROLE,
                environment.GESTIONNAIRE_PORTEFEUILLES_ROLE
              ]
            },
          },
          {
            path: 'nouveau-projet',
            component:NouveauProjetComponent,
            canActivate:[AuthGuard,RoleGuard],
            data:{
              RolesPermis:[environment.ADMIN_ROLE,
                environment.GESTIONNAIRE_PORTEFEUILLES_ROLE,
                environment.CHEF_PROJET_ROLE
              ]
            },
          },
          {
            path: 'details-projet/:codeProjet',
            component:DetailsProjetComponent,
            canActivate:[AuthGuard,RoleGuard],
            data:{
              RolesPermis:[environment.ADMIN_ROLE,
                environment.GESTIONNAIRE_PORTEFEUILLES_ROLE,
                environment.CHEF_PROJET_ROLE,
                environment.INTERVENANT_DEVELOPPEUR_ROLE
              ]
            },
          },
          {
            path: 'nouveau-portefeuille',
            component:NouveauPortefeuilleComponent,
            canActivate:[AuthGuard,RoleGuard],
            data:{
              RolesPermis:[environment.ADMIN_ROLE,
                environment.GESTIONNAIRE_PORTEFEUILLES_ROLE
              ]
            },
          },
        ]}
    ]},
  {
    path: 'mes-taches',
    component:MesTachesComponent,
    canActivate:[AuthGuard,RoleGuard],
    data:{
      RolesPermis:[environment.INTERVENANT_DEVELOPPEUR_ROLE
      ]
    },

  },
  {
    path: 'mon-emploi',
    component: MonEmploiComponent,
    canActivate: [AuthGuard,RoleGuard],
    data: {
      RolesPermis: [environment.INTERVENANT_DEVELOPPEUR_ROLE
      ]
    },
  },
  {
    path: 'mes-infos',
    canActivate:[AuthGuard],
    component:MesInfosComponent
  },
  {path: '**', component:NotFoundComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
