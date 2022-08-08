import {Intervention} from "./Intervention.model";

export class Tache {
  idTache:number;
  titre:string;
  description:string;
  dateDebutPlanifiee:Date;
  dateFinPlanifiee:Date;
  dateDebutPrevue:Date;
  dateFinPrevue:Date;
  dateDebutReelle:Date;
  dateFinReelle:Date;
  avancement:number;
  coutReel:number;
  coutInitial:number;
  tacheMere:Tache;
  dependances:Tache[];
  interventions:Intervention[];
}
