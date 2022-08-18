import {Tache} from "./Tache.model";
import {Ressource} from "./Ressource.model";

export class Activite {
  idActivite:bigint;
  description:string;
  date:Date;
  tache:Tache;
  intervenant:Ressource;
}
