import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-teacher-profile',
  templateUrl: './create-teacher-profile.component.html',
  styleUrls: ['./create-teacher-profile.component.css']
})
export class CreateTeacherProfileComponent implements OnInit {

  constructor(public router: Router, private _Activatedroute:ActivatedRoute) { }
  id: string = "";
  firstNameField: string = "";
  lastNameField: string = "";
  emailField: string = "";
  departmentField: string = "";
  ngOnInit() {
  }

  CreateProfile() {
    this.id = this._Activatedroute.snapshot.paramMap.get("id");
    var self = this
    var request = new XMLHttpRequest()
    var req_url = 'http://127.0.0.1:5000/api/complete-profile-teacher' 
    request.open('POST', req_url, true)
    request.onload = function() {
      var data = JSON.parse(this.response)
      if(data.registered === 'True')
        self.router.navigate(['./home-teacher']);
      else 
        self.router.navigate(['./login-page'])
            
      }
      request.setRequestHeader('Content-Type', 'application/json')
      request.send(JSON.stringify({
        "id": this.id,
        "f_name": this.firstNameField,
        "l_name": this.lastNameField,
        "department": this.departmentField,
        "email": this.emailField
      }))
  }

}
