import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  logoutUser() {
    var self = this
    var request = new XMLHttpRequest()
    var req_url = 'http://127.0.0.1:5000/api/logout'
    request.open('POST', req_url, true)
    request.onload = function() {
      var data = JSON.parse(this.response)
      if(data.logged_out === 'True')
        self.router.navigate(['/login-page'])
      else
        console.log('Flash error message here')   
    }
    request.setRequestHeader('Access-Control-Allow-Credentials', 'true')
    request.withCredentials = true
    request.send()  
  }
}
