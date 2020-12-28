import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatTableModule } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.css']
})
export class TeacherProfileComponent implements OnInit {
  Docs = [
    { id: 1, name: "doc1", status: "Progressing", remark: "_" },
    { id: 2, name: "doc2", status: "Progressing", remark: "_" }
  ];

  teacherID: string = "";
  teacherName: string = "";
  teacherDepartment: string = "";
  teacherRole: string = "";
  teacherEmail: string = "";

  companyField: string = "";
  positionField: string = "";
  durationField: string = "";
  stipendField: string = "";
  departmentField: string = "";
  imageURLField: string = "";

  startDateField: string = "";
  endDateField: string = "";

  descriptionField: string = "";

  constructor(private router: Router) {

  }

  updateProfile(id, name, department, role, email) {
    this.teacherID = id
    this.teacherName = name
    this.teacherDepartment = department
    this.teacherRole = role
    this.teacherEmail = email
  }

  ngOnInit() {
    const self = this
    var request = new XMLHttpRequest()
    var req_url = 'http://127.0.0.1:5000/api/viewteacherprofile' 
    request.open('GET', req_url, true)
    request.onload = function() {
      var data = JSON.parse(this.response)
      if(data.valid_request === 'True') 
        self.updateProfile(data.id, data.name, data.department, data.role, data.email)
      else
        console.log('Flash error message')
      }
     
    request.setRequestHeader('Access-Control-Allow-Credentials', 'true')
    request.withCredentials = true
    request.send()

  }

  clearFields() {
    this.companyField = ""
    this.positionField = ""
    this.durationField = ""
    this.stipendField = ""
    this.departmentField = ""
    this.imageURLField = ""

    this.startDateField = ""
    this.endDateField = ""

    this.descriptionField = ""

  }

  submitDetails() {
    const self = this
    var request = new XMLHttpRequest()
    var req_url = 'http://127.0.0.1:5000/api/addinternship' 
    request.open('POST', req_url, true)
    request.onload = function() {
      var data = JSON.parse(this.response)
      self.clearFields()
      if(data.message === 'Internship added') 
        console.log('Flash success message')
      else
        console.log('Flash error message')
      }
    
    request.setRequestHeader('Content-Type', 'application/json')  
    request.setRequestHeader('Access-Control-Allow-Credentials', 'true')
    request.withCredentials = true
    request.send(JSON.stringify({
      "company": this.companyField,
      "position": this.positionField,
      "duration": this.durationField,
      "stipend": this.stipendField,
      "branch": this.departmentField,
      "imageURL": this.imageURLField,
      "startDate": this.startDateField,
      "endDate": this.endDateField,
      "description": this.descriptionField 
      })
    )


  }

}
