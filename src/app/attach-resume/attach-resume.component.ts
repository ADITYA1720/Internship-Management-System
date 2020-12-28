import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-attach-resume',
  templateUrl: './attach-resume.component.html',
  styleUrls: ['./attach-resume.component.css']
})
export class AttachResumeComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) { }
  fileToUpload: File = null;
  ngOnInit() {
    
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadResume() {
    const internshipID = this.data['internshipID']
    var formData = new FormData()
    formData.append("file", this.fileToUpload)
    formData.append("internshipID", internshipID)
    
    var request = new XMLHttpRequest()
    var req_url = 'http://127.0.0.1:5000/api/studentapply'
    var request = new XMLHttpRequest()
    request.open('POST', req_url, true)
    request.onload = function() {
      var data = JSON.parse(this.response)
      if(data.applicantRegistered === 'True')
        console.log('Flash a success message here')
      else
        console.log('Flash failure message')    
    }
    request.setRequestHeader('enctype', 'multipart/form-data')
    request.setRequestHeader('Access-Control-Allow-Credentials', 'true')
    request.withCredentials = true
    request.send(formData)  

  }
}
