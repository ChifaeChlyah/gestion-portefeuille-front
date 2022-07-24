import {Projet} from "./Projet.model";

export interface FamilleProjet{
  codeFamille:string;
  titreFamille:string;
  description:string;
  projets:Projet[];
}
