import {Component, OnInit, ViewChild} from '@angular/core';
import {RessourcesService} from "../../services/ressources.service";
import {Tache} from "../../model/Tache.model";
import {Ressource} from "../../model/Ressource.model";
import {AuthentificationService} from "../../services/authentification.service";
import {MatAccordion} from "@angular/material/expansion";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {Intervention} from "../../model/Intervention.model";
import {MatDialog} from "@angular/material/dialog";
import {DialogAvancementComponent} from "./dialog-avancement/dialog-avancement.component";
import {DialogDateFinPrevueComponent} from "./dialog-date-fin-prevue/dialog-date-fin-prevue.component";
import {MessageService} from "primeng/api";
import {ProjetsService} from "../../services/projets.service";
declare var $:any;
@Component({
  selector: 'app-mes-taches',
  templateUrl: './mes-taches.component.html',
  styleUrls: ['./mes-taches.component.css']
})
export class MesTachesComponent implements OnInit {
  @ViewChild("paginator") paginator: MatPaginator;
  taches:Tache[]=new Array();
  user:Ressource;
  length = 100;
  p: number = 1;
  target :any;
  options  = {
    floor: 0,
    ceil: 100
  };
  interventions:Intervention[]=new Array()
  mesTachesPage=false;
  constructor(private ressourcesService:RessourcesService,private authService:AuthentificationService,
              public datepipe: DatePipe,private router:Router,private route:ActivatedRoute,
              public dialog: MatDialog, private messageService: MessageService,
              private projetService:ProjetsService) { }

  ngOnInit(): void {
    if(this.router.url =="/mes-taches")
    {
      this.mesTachesPage=true;
    }

    this.loadTaches();
  }
  loadTaches() {
    if (this.mesTachesPage) {
      this.authService.getUserbyEmail(this.authService.getEmail()).subscribe(
        user => {
          this.user = user;
          this.ressourcesService.tachesAffectes(user.codeRessource).subscribe(
            taches => {
              this.taches = taches;
              console.log("taches")
              console.log(taches)
              this.taches.forEach(
                t => {
                  if(t.interventions)
                  t.interventions.forEach(i=>{
                    if(i.intervenant.codeRessource==user.codeRessource)
                      this.interventions.push(i);
                  })
                  this.ressourcesService.projetParTache(t.idTache).subscribe(
                    projet => {
                      t.projet = projet;
                      console.log(t)
                    }
                  )
                }
              )
            })
        });
    }
    else{
      this.ressourcesService.tachesAffectes(this.route.snapshot.paramMap.get('codeRessource')).subscribe(
        taches => {
          this.taches = taches;
          this.taches.forEach(
            t => {
              if(t.interventions)
                t.interventions.forEach(i=>{
                  if(i.intervenant.codeRessource+''==this.route.snapshot.paramMap.get('codeRessource'))
                    this.interventions.push(i);
                })
              this.ressourcesService.projetParTache(t.idTache).subscribe(
                projet => {
                  t.projet = projet;
                  console.log(t)
                }
              )
            }
          )
        })
    }
  }
  addSingleSuccess(summary,detail) {
    this.messageService.add({severity:'success', summary:summary, detail:detail});
  }

  addSingleDanger(summary,detail) {
    this.messageService.add({severity:'error', summary:summary, detail:detail});
  }
  openDialogAvancement(i): void {
    const dialogRef = this.dialog.open(DialogAvancementComponent, {
      width: '250px',
      data:  this.interventions[i].avancement
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result==null||result>=0&&result<=100) {
        this.interventions[i].avancement = result;
        this.projetService.updateInterventionAvancement(this.interventions[i],this.taches[i].idTache).subscribe(
          result=>{
            this.addSingleSuccess("Succès !","Vos modifications ont bien été enregistrées.")
            this.loadTaches2();
          }
        )
      }
      else{
        this.addSingleDanger("Erreur" ,"L'avancement doit être compris entre 0 et 100 !")
      }
    });
  }
  openDialogDatesPrevues(i): void {
    const dialogRef = this.dialog.open(DialogDateFinPrevueComponent, {
      width: '250px',
      data: 0
    });

    dialogRef.afterClosed().subscribe(result => {
        if(result) {
          if (result < 0)
            this.addSingleDanger("Erreur", "Le glissement doit être compris supérieur à 0 !")
          else {
            this.projetService.updateTache(this.taches[i], result).subscribe(
              t => {
                this.addSingleSuccess("Succès !", "Vos modifications ont bien été enregistrées.")
                this.loadTaches2()
              }
            )
          }
        }
    });
  }
  loadTaches2()
  {
    this.ressourcesService.tachesAffectes(this.user.codeRessource).subscribe(
      taches => {
        for(let i=0;i<taches.length;i++)
        {
        let t=taches[i];
          this.taches[i].avancement=t.avancement;
          this.taches[i].dateFinPrevue=t.dateFinPrevue;
          this.taches[i].dateFinRelle=t.dateFinRelle;
          this.taches[i].dateDebutRelle=t.dateDebutRelle;
        }
  });
  }
}
