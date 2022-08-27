import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-avancement',
  templateUrl: './dialog-avancement.component.html',
  styleUrls: ['./dialog-avancement.component.css']
})
export class DialogAvancementComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogAvancementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }
}
