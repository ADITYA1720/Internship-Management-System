import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { InternshipDetailsComponent } from '../internship-details/internship-details.component';
import {AttachResumeComponent} from '../attach-resume/attach-resume.component'
import { Router } from '@angular/router';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent{
  
  internships$;
  constructor(public dialog: MatDialog, public router: Router, private dataService: DataService) { }
  ngOnInit() {
    const self = this
    var request = new XMLHttpRequest()
    var req_url = 'http://127.0.0.1:5000/api/studentviewinternships'
    request.open('GET', req_url, true)
    request.onload = function() {
      var data = JSON.parse(this.response)
      console.log(data)
      if(data.valid_request === 'True') {
        self.internships$ = data.internships
        console.log(self.internships$)
      }
      else
        self.router.navigate(['./login-page'])
    }
    request.setRequestHeader('Content-Type', 'application/json')
    request.withCredentials = true
    request.send()
  }

  
  async openDialog(internshipID) {
      const self = this
      var internshipDetails
      var request = new XMLHttpRequest()
      var req_url = 'http://127.0.0.1:5000/api/studentviewinternshipsdetails/' + internshipID
      await makeRequest('GET', req_url).then(function (result) {
        if(result) {
          internshipDetails = result
          console.log(internshipDetails)
          const dialog_ref  = self.dialog.open(InternshipDetailsComponent, { width: "450px",
            data: { internshipDetails: internshipDetails } } );
        }

      })
  }
  
  openDialog_1(internshipID) {
    
    const dialog_ref  = this.dialog.open(AttachResumeComponent, {width:"450px", data: { internshipID: internshipID }});
  }

}

function makeRequest(method, url) {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest()
    request.open(method, url, true)
    request.onload = function() {
    var data = JSON.parse(this.response)
    console.log(data)
    resolve(data.internships)
    }
    request.setRequestHeader('Content-Type', 'application/json')
    request.setRequestHeader('Access-Control-Allow-Credentials', 'true')
    request.withCredentials = true
    request.send()  
  }); 
}



