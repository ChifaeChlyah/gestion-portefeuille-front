import {FamilleProjet} from "./FamilleProjet.model";
import {Risque} from "./risque.model";
import {Tache} from "./Tache.model";

export interface Projet {
  codeProjet:string;
  titreProjet:string;
  description:string;
  dateDebutPlanifiee:Date;
  dateDebutPrevue:Date;
  dateDebutReelle:Date;
  dateFinPlanifiee:Date;
  dateFinPrevue:Date;
  dateFinReelle:Date;
  priorite:string;
  avancement:number;
  coutInitial:number;
  coutReel:number;
  logo:string;
  statut:string;
  famillesProjets:FamilleProjet[];
  predecesseurs:Projet[];
  risques:Risque[];
  taches:Tache[]
}
