import { Component, OnInit, Inject, ɵConsole } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-student-profile-dialog',
  templateUrl: './student-profile-dialog.component.html',
  styleUrls: ['./student-profile-dialog.component.css']
})
export class StudentProfileDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {
  }

}
