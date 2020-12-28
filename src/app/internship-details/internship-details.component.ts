import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-internship-details',
  templateUrl: './internship-details.component.html',
  styleUrls: ['./internship-details.component.css']
})
export class InternshipDetailsComponent implements OnInit {

  internshipID: number
  internshipDeets$;
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) { }

 ngOnInit() {
   
  }
}

