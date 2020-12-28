import { Component, OnInit, NgModule } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],

})
export class LoginPageComponent implements OnInit {

  constructor(private router: Router) { }
  UserNameField: string = "";
  PasswordField: string = "";
  UsernameSignUp: string = "";
  SignUpPassword: string = ""; 
  ConfirmSignUpPassword: string = "";
  errorMessage: string="";
  UserTypeField: string = "";
  RegisterUserTypeField: string = "";
  ngOnInit() {
  }
  ClearFields() {
    this.UserNameField = "";
    this.PasswordField = "";
  }

   async SignIn() {
    var self = this
    if (this.UserNameField.length == 11 && (this.UserNameField.slice(0, 3) == 'C2K' || this.UserNameField.slice(0, 3) == 'E2K' || this.UserNameField.slice(0, 3) == 'I2K' || this.UserNameField.slice(0, 3) == 'T2K')) {
      var req_url = 'http://127.0.0.1:5000/api/userlogin' 
      const data = JSON.stringify({
        "id": this.UserNameField,
        "password": this.PasswordField,
        "role": ((this.UserTypeField === 'Student')? 0 : (this.UserTypeField === 'DepartmentHead')? 1 : 2)
      })

      await makeRequest('POST', req_url, data).then(function (loginInfo) {
        if(loginInfo === 'Login student')
          self.router.navigate(['/home']);
        else if(loginInfo === 'Login teacher')
          self.router.navigate(['/home-teacher']);
        else
          document.getElementById('invalid').innerHTML='<p style="color:indigo">Invalid Username/Password!</p>';
      })    
      return                
    }
    document.getElementById('invalid').innerHTML='<p style="color:indigo">Invalid Username/Password!</p>';
  }

  CreateProfile() {
    var self = this
    if (this.UsernameSignUp.length == 11 && this.SignUpPassword === (this.ConfirmSignUpPassword) && (this.UsernameSignUp.slice(0, 3) == 'C2K' || this.UsernameSignUp.slice(0, 3) == 'E2K' || this.UsernameSignUp.slice(0, 3) == 'I2K'))  {
        var request = new XMLHttpRequest()
        var req_url = 'http://127.0.0.1:5000/api/registeruser' 
        request.open('POST', req_url, true)
        request.onload = function() {
          var data = JSON.parse(this.response)  
          if(data.registered === 'True' && data.role === 0)
            self.router.navigate(['./create-profile', self.UsernameSignUp]);
          else if(data.registered === 'True' && data.role !== 0)  
            self.router.navigate(['./create-teacher-profile', self.UsernameSignUp]);
        }
        request.setRequestHeader('Content-Type', 'application/json')
        request.send(JSON.stringify({
          "id": self.UsernameSignUp,
          "password": self.SignUpPassword,
          "role": ((this.RegisterUserTypeField === 'Student')? 0 : (this.RegisterUserTypeField === 'DepartmentHead')? 1 : 2)
        }))
    }
    else
      document.getElementById('invalid1').innerHTML='<p style="color:indigo">Invalid Username/Password!</p>';
  }
}

function makeRequest(method, url, data) {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest()
    request.open(method, url, true)
    request.onload = function() {
      var data = JSON.parse(this.response)
      console.log(data)
      if(data.logged_in === 'True' && data.role === 0)
        resolve('Login student')
      else if(data.logged_in === 'True' && data.role !== 0)
        resolve('Login teacher')
      else
        resolve('Invalid')  
    }
    request.setRequestHeader('Content-Type', 'application/json')
    request.setRequestHeader('Access-Control-Allow-Credentials', 'true')
    request.withCredentials = true
    request.send(data)

  });
}