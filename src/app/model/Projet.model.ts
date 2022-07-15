import {FamilleProjetModel} from "./FamilleProjet.model";

export interface ProjetModel {
  codeProjet:string;
  titreProjet:string;
  description:string;
  dateFinCible:Date;
  dateFinEffective:Date;
  //priorité;-->enum
  //chefProjet;-->relation
  pourcentageProgres:number;
  budget:number;
  cout:number;
  logo:string;
  //satut;-->enum
  familleProjet:FamilleProjetModel;
}
