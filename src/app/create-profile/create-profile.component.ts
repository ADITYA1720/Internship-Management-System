import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {

  constructor(public router: Router, private _Activatedroute:ActivatedRoute) { }
  id: string = "";
  firstNameField: string = "";
  lastNameField: string = "";
  rollNumberField: string = "";
  emailField: string = "";
  attendanceField: string = "";
  CGPAField: string = "";
  yearField: string = "";
  divisionField: string = "";
  departmentField: string = "";
  ngOnInit() {
  } 

  CreateProfile() {
    this.id=this._Activatedroute.snapshot.paramMap.get("id");
    var self = this
    var request = new XMLHttpRequest()
    var req_url = 'http://127.0.0.1:5000/api/complete-profile' 
    request.open('POST', req_url, true)
    request.onload = function() {
      var data = JSON.parse(this.response)
      if(data.registered === 'True')
        self.router.navigate(['./home']);
      else 
        self.router.navigate(['./login-page'])
            
      }
      request.setRequestHeader('Content-Type', 'application/json')
      request.send(JSON.stringify({
        "id": this.id,
        "rollNumber": parseInt(self.rollNumberField),
        "f_name": self.firstNameField,
        "l_name": self.lastNameField,
        "email": self.emailField,
        "branch": self.departmentField,
        "attendance": parseFloat(self.attendanceField),
        "CGPA": parseFloat(self.CGPAField),
        "year": self.yearField,
        "division": parseInt(self.divisionField),
      }))

  }
}
