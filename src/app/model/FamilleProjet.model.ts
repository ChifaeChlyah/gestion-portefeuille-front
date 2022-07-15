import {ProjetModel} from "./Projet.model";

export interface FamilleProjetModel{
  codeFamille:string;
  titreFamille:string;
  description:string;
  projets:ProjetModel[];
}
