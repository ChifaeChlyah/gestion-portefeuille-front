import {Intervention} from "./Intervention.model";

export class Tache {
  idTache:number;
  titre:string;
  description:string;
  dateDebutPlanifiee:string;
  dateFinPlanifiee:string;
  dateDebutPrevue:string;
  dateFinPrevue:string;
  dateDebutRelle:string;
  dateFinRelle:string;
  avancement:number;
  coutReel:number;
  coutInitial:number;
  tacheMere:Tache;
  dependances:Tache[];
  interventions:Intervention[];
}
