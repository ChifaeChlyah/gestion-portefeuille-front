import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {ActionEvent} from "../state/appData.state";

@Injectable({
  providedIn: 'root'
})
export class EventDrivenService {
  sourceEventSubject:Subject<ActionEvent>=new Subject<ActionEvent>();
  sourceEventSubjectObservable=this.sourceEventSubject.asObservable();
  publishEvent(event:ActionEvent)
  {
    this.sourceEventSubject.next(event);
    //c'est la méthode qui va être appelé à chaque fois qu'un composant
    // voudra émettre un évènement, il sera donc ajouté à
    // sourceEventSubject
    // Pour que d'autres composants reçoivent l'évènement, il suffit
    // qu'ils fassent un subscribe au "sourceEventSubjectObservable"
  }

}
