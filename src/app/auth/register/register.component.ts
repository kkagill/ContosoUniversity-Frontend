import { NgForm } from '@angular/forms';
import { NotificationService } from './../../shared/utils/notification.service';
import { AuthService } from './../../shared/services/auth.service';
import { Router } from '@angular/router'; 
import { Http } from '@angular/http';
import { RegisterViewModel } from '../../models/RegisterViewModel'; 
import { Component, OnInit, ViewChild, ViewContainerRef, trigger, state, style, transition, animate } from '@angular/core';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    animations: [
      trigger('easeInOut', [
        transition(':enter', [
          style({
            opacity: 0
          }),
          animate("1s ease-in-out", style({
            opacity: 1
          }))
        ]),
        transition(':leave', [
          style({
            opacity: 1
          }),
          animate("1s ease-in-out", style({
            opacity: 0
          }))
        ])
      ])
    ]
})
 
export class RegisterComponent {
    registerViewModel: RegisterViewModel;
    error = '';
    show: boolean = false;

    constructor(public router: Router, 
                public http: Http, 
                private authService: AuthService,
                private notificationService: NotificationService) { }
 
    ngOnInit() {
        this.registerViewModel = new RegisterViewModel();
        this.show = true;
    }
 
    register(form: NgForm): void {
        let body = { 
            'email': this.registerViewModel.email, 
            'password': this.registerViewModel.password, 
            'confirmPassword': this.registerViewModel.confirmPassword 
        };
 
        this.http.post('http://localhost:51089/api/account/register', JSON.stringify(body), { headers: this.authService.jsonHeaders() })
            .subscribe(response => {
                if (response.status == 200) {
                    this.notificationService.printSuccessMessage('User has been created.');                    
                } 
            },
            error => {                
                this.error = error._body;
            });

        form.reset();
    }
}