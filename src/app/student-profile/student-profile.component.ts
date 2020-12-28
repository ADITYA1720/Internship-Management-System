import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatTableModule, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { EditStudentProfileDialogComponent } from '../edit-student-profile-dialog/edit-student-profile-dialog.component';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  Docs = [
    { id: 1, name: "doc1", status: "Progressing", remark: "_" },
    { id: 2, name: "doc2", status: "Progressing", remark: "_" }
  ];
  data: any;
  StudentName: string = "";
  StudentRollNo: string = "";
  StudentClass: string = "";
  StudentAttendance: string = "";
  StudentCGPA: string = "";
  StudentDepartment: string = "";
  PhoneNo: string = "";
  EmailId: string = "";
  id:string="";

  companyField: string = "";
  positionField: string = "";
  durationField: string = "";
  stipendField: string = "";
  startDateField: string = "";
  endDateField: string = "";
  additionalDetailsField: string = "";

  fileToUpload: File = null;

  constructor(private router: Router, public dialog: MatDialog,private route: ActivatedRoute) {

  }
  updateProfile(StudentID, StudentName, StudentRollNo, StudentClass, StudentAttendance, StudentCGPA, StudentDepartment, EmailId) {
    this.id = StudentID
    this.StudentName = StudentName
    this.StudentRollNo = StudentRollNo;
    this.StudentClass = StudentClass;
    this.StudentAttendance = StudentAttendance;
    this.StudentCGPA = StudentCGPA;
    this.StudentDepartment =StudentDepartment;
    this.EmailId = EmailId;
  }
  ngOnInit() {
    const self = this
    var request = new XMLHttpRequest()
    var req_url = 'http://127.0.0.1:5000/api/viewstudentprofile' 
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
  }

  EditInfo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      StudentName: this.StudentName,
      StudentRollNo: this.StudentRollNo,
      StudentClass: this.StudentClass,
      StudentAttendance: this.StudentAttendance,
      StudentCGPA: this.StudentCGPA,
      StudentDepartment: this.StudentDepartment,
      PhoneNo: this.PhoneNo,
      EmailId: this.EmailId
    }
    const dialogRef = this.dialog.open(EditStudentProfileDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => this.updateProfile(data.StudentName,
        data.StudentRollNo,
        data.StudentClass,
        data.StudentAttendance,
        data.StudentCGPA,
        data.StudentDepartment,
        data.PhoneNo,
        data.EmailId)
  );  
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  clearFields() {

    this.companyField = ""
    this.positionField = ""
    this.durationField = ""
    this.stipendField = ""
    this.startDateField = ""
    this.endDateField = ""
    this.additionalDetailsField = ""
    this.fileToUpload = null
  }


  submitDetails() {
    var self = this
    var formData = new FormData()
    formData.append("file", this.fileToUpload)
    formData.append("company", this.companyField)
    formData.append("position", this.positionField)
    formData.append("duration", this.durationField)
    formData.append("stipend", this.stipendField)
    formData.append("startDate", this.startDateField)
    formData.append("endDate", this.endDateField)
    formData.append("additionalDetails", this.additionalDetailsField)

    var request = new XMLHttpRequest()
    var req_url = 'http://127.0.0.1:5000/api/requestapproval'
    request.open('POST', req_url, true)
    request.onload = function() {
      self.clearFields()
      var data = JSON.parse(this.response)
      if(data.message === 'Approval request sent.') 
        console.log('Flash a success message')

      else
        console.log('Flash an error message')  
    }

    request.setRequestHeader('enctype', 'multipart/form-data')
    request.setRequestHeader('Access-Control-Allow-Credentials', 'true')
    request.withCredentials = true
    request.send(formData)

  }
}
