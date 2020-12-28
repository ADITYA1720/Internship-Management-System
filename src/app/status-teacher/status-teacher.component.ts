import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
export interface studentData {
  id: string;
  studentID: string;
  name: string;
  company: string;
}

@Component({
  selector: 'app-status-teacher',
  templateUrl: './status-teacher.component.html',
  styleUrls: ['./status-teacher.component.css']
})
export class StatusTeacherComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'company', 'viewDetails'];
  dataSource: MatTableDataSource<studentData>;
  sortedData: studentData[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private router: Router) {}

  ngOnInit() {
    const self = this
    var request = new XMLHttpRequest()
    var req_url = 'http://127.0.0.1:5000/api/view-status-teacher' 
    request.open('GET', req_url, true)
    request.onload = function() {
      var data = JSON.parse(this.response)
      if(data.valid_request === 'True') 
        self.dataSource = new MatTableDataSource(data.applications)
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
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewExternalApplicationDetails(formID, studentID) {
    this.router.navigate(['./view-external-application', formID, studentID])
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
