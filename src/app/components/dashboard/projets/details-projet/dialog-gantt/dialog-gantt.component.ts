import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Tache} from "../../../../../model/Tache.model";
export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}
@Component({
  selector: 'app-dialog-gantt',
  templateUrl: './dialog-gantt.component.html',
  styleUrls: ['./dialog-gantt.component.css']
})

export class DialogGanttComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {taches: Tache[]}) {}

  ngOnInit(): void {
  }

}
