import {FamilleProjet} from "./FamilleProjet.model";
import {Risque} from "./Risque.model";
import {Tache} from "./Tache.model";
import {Ressource} from "./Ressource.model";

export class Projet {
  codeProjet:string;
  titreProjet:string;
  description:string;
  dateDebutPlanifiee:Date;
  dateDebutPrevue:Date;
  dateDebutReelle:Date;
  dateFinPlanifiee:Date;
  dateFinPrevue:Date;
  dateFinReelle:Date;
  priorite:Priorite;
  avancement:number;
  coutInitial:number;
  coutReel:number;
  logo:string;
  statut:Statut;
  chefProjet:Ressource;
  intervenants:Ressource[];
  famillesProjets:FamilleProjet[];
  predecesseurs:Projet[];
  risques:Risque[];
  taches:Tache[]
}
export enum Statut {
  Attente,
  Pre_lancement,
  Lancement,
  Execution,
  Cloture,
  Arret,
  Garantie
}
export enum Priorite {
  Basse,
  Moyenne,
  Eleve
}
export const StatutMapping: Record<Statut, string> = {
  [Statut.Attente]: "Attente (planifié)",
  [Statut.Pre_lancement]: "Pré - Lancement",
  [Statut.Lancement]: "Lancement",
  [Statut.Execution]: "Exécution",
  [Statut.Cloture]: "Clôturé",
  [Statut.Arret]: "Arrêt",
  [Statut.Garantie]: "Garantie",
};
export const PrioriteMapping: Record<Priorite, string> = {
  [Priorite.Basse]: "Basse",
  [Priorite.Moyenne]: "Moyenne",
  [Priorite.Eleve]: "Elevé",
};
