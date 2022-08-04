import {FamilleProjet} from "./FamilleProjet.model";
import {Risque} from "./Risque.model";
import {Tache} from "./Tache.model";
import {Role} from "./Role.model";

export class Ressource {
  codeRessource:bigint;
  nom:string;
  prenom:string;
  emploi:string;
  nomPhoto:string;
  email:string;
  tel:string;
  password:string;
  roles:Role[];
}
