import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-view-external-application',
  templateUrl: './view-external-application.component.html',
  styleUrls: ['./view-external-application.component.css']
})
export class ViewExternalApplicationComponent implements OnInit {

  constructor(public router: Router, private _Activatedroute:ActivatedRoute) { }
  id
  StudentName
  StudentRollNo
  StudentAttendance
  StudentCGPA
  StudentDepartment
  StudentClass
  StudentEmail

  companyField
  positionField
  durationField
  stipendField
  startDateField
  endDateField
  additionalDetailsField

  ngOnInit() {
    this.id=this._Activatedroute.snapshot.paramMap.get("studentID");
    const self = this
    var request = new XMLHttpRequest()
    var req_url = 'http://127.0.0.1:5000/api/view-applicant-profile/' + this.id 
    request.open('GET', req_url, true)
    request.onload = function() {
      var data = JSON.parse(this.response)
      if(data.valid_request === 'True') 
        self.updateProfile(data.id, data.name, data.rollNumber, data.class, data.attendance, data.CGPA, data.department, data.email)
      else
        console.log('Flash error message')
      }
     
    request.setRequestHeader('Access-Control-Allow-Credentials', 'true')
    request.withCredentials = true
    request.send()  
    
    const formID = this._Activatedroute.snapshot.paramMap.get("formID");
    request = new XMLHttpRequest()  
    req_url = 'http://127.0.0.1:5000/api/view-approval-request-details/' + formID 
    request.open('GET', req_url, true)
    request.onload = function() {
      var data = JSON.parse(this.response)
      if(data.valid_request === 'True') 
        self.updateApplicationDetails(data.company, data.position, data.duration, data.stipend, data.startDate, data.endDate, data.additionalDetails)
      else
        console.log('Flash error message')
      }
     
    request.setRequestHeader('Access-Control-Allow-Credentials', 'true')
    request.withCredentials = true
    request.send()  
  }

  updateProfile(StudentID, StudentName, StudentRollNo, StudentClass, StudentAttendance, StudentCGPA, StudentDepartment, StudentEmail) {
    this.id = StudentID
    this.StudentName = StudentName
    this.StudentRollNo = StudentRollNo;
    this.StudentClass = StudentClass;
    this.StudentAttendance = StudentAttendance;
    this.StudentCGPA = StudentCGPA;
    this.StudentDepartment =StudentDepartment;
    this.StudentEmail = StudentEmail;
  }

  updateApplicationDetails(company, position, duration, stipend, startDate, endDate, additionalDetails) {
    this.companyField = company
    this.positionField = position
    this.durationField = duration
    this.stipendField = stipend
    this.startDateField = startDate.split("00:")[0]
    this.endDateField = endDate.split("00:")[0]
    this.additionalDetailsField = additionalDetails
  }

  approveApplication() {
    const self = this
    const formID = this._Activatedroute.snapshot.paramMap.get("formID");
    var request = new XMLHttpRequest()  
    var req_url = 'http://127.0.0.1:5000/api/approve-application/' + formID 
    request.open('PATCH', req_url, true)
    request.onload = function() {
      var data = JSON.parse(this.response)
      if(data.valid_request === 'True') 
        console.log('Flash success message')
      else
        console.log('Flash error message')
      self.router.navigate(['./teacher-status'])
      }
     
    request.setRequestHeader('Access-Control-Allow-Credentials', 'true')
    request.withCredentials = true
    request.send()
  }

  rejectApplication() {
    const self = this
    const formID = this._Activatedroute.snapshot.paramMap.get("formID");
    var request = new XMLHttpRequest()  
    var req_url = 'http://127.0.0.1:5000/api/reject-application/' + formID 
    request.open('PATCH', req_url, true)
    request.onload = function() {
      var data = JSON.parse(this.response)
      if(data.valid_request === 'True') 
        console.log('Flash success message')
      else
        console.log('Flash error message')
      self.router.navigate(['./teacher-status'])
      }
     
    request.setRequestHeader('Access-Control-Allow-Credentials', 'true')
    request.withCredentials = true
    request.send()
  }
}
