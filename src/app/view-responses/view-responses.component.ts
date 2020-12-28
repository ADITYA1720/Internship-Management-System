import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router'
import { StudentProfileDialogComponent } from '../student-profile-dialog/student-profile-dialog.component';

export interface studentData {
  id: string;
  rollNumber: string;
  name: string;
  class: string;
}

@Component({
  selector: 'app-view-responses',
  templateUrl: './view-responses.component.html',
  styleUrls: ['./view-responses.component.css']
})
export class ViewResponsesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'company', 'viewDetails'];
  dataSource: MatTableDataSource<studentData>;
  sortedData: studentData[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private _Activatedroute:ActivatedRoute, public dialog: MatDialog) { }
  internshipID: string = "";

  ngOnInit() {
    const self = this
    this.internshipID=this._Activatedroute.snapshot.paramMap.get("internshipID")
    var request = new XMLHttpRequest()
    var req_url = 'http://127.0.0.1:5000/api/view-responses/' + this.internshipID 
    request.open('GET', req_url, true)
    request.onload = function() {
      var data = JSON.parse(this.response)
      if(data.valid_request === 'True') 
        self.dataSource = new MatTableDataSource(data.studentResponses)
      else {
        console.log('Flash error message')
      }
    self.dataSource.paginator = self.paginator;
    self.dataSource.sort = self.sort;
    }
    request.setRequestHeader('Access-Control-Allow-Credentials', 'true')
    request.withCredentials = true
    request.send()

  }

  viewStudentProfile(studentID) {
    const self = this
    var request = new XMLHttpRequest()
    var req_url = 'http://127.0.0.1:5000/api/view-applicant-profile/' + studentID 
    request.open('GET', req_url, true)
    request.onload = function() {
      var res = JSON.parse(this.response)
      console.log(res)
      if(res.valid_request === 'True') {
        const dialog_ref  = self.dialog.open(StudentProfileDialogComponent, { width: "450px",
          data: { studentDetails: res, internshipID: self.internshipID } } );
      }
      else {
        console.log('Flash error message')
      }
    }
    request.setRequestHeader('Access-Control-Allow-Credentials', 'true')
    request.withCredentials = true
    request.send()
  }
}
