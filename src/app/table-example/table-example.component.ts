import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';

export interface applicationData {
  id: string;
  company: string;
  typeOfApplication: string;
  status: string;
}

@Component({
  selector: 'app-table-example',
  templateUrl: './table-example.component.html',
  styleUrls: ['./table-example.component.css']
})

export class TableExampleComponent implements OnInit {
  displayedColumns: string[] = ['id', 'company', 'typeOfApplication', 'status'];
  dataSource: MatTableDataSource<applicationData>;
  sortedData: applicationData[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor() {}

  ngOnInit() {
    const self = this
    var request = new XMLHttpRequest()
    var req_url = 'http://127.0.0.1:5000/api/studentviewstatus' 
    request.open('GET', req_url, true)
    request.onload = function() {
      var data = JSON.parse(this.response)
      if(data.valid_request === 'True') 
        self.dataSource = new MatTableDataSource(data.internshipStatuses)
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
  
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

