import {FamilleProjet} from "./FamilleProjet.model";
import {Risque} from "./Risque.model";
import {Tache} from "./Tache.model";
import {Role} from "./Role.model";

export interface Ressource {
  codeRessource:bigint;
  nom:string;
  prenom:string;
  emploi:string;
  email:string;
  tel:string;
  password:string;
  roles:Role[];

}
