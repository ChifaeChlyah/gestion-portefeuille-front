import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-date-fin-prevue',
  templateUrl: './dialog-date-fin-prevue.component.html',
  styleUrls: ['./dialog-date-fin-prevue.component.css']
})
export class DialogDateFinPrevueComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogDateFinPrevueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit(): void {
  }

}
