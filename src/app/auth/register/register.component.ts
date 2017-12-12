import { NgForm } from '@angular/forms';
import { NotificationService } from './../../shared/utils/notification.service';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { Http } from '@angular/http';
import { RegisterViewModel } from '../../models/RegisterViewModel';
 
@Component({
    selector: 'register',
    templateUrl: './register.component.html'
})
 
export class RegisterComponent {
    registerViewModel: RegisterViewModel;
    error = '';

    constructor(public router: Router, 
                public http: Http, 
                private authService: AuthService,
                private notificationService: NotificationService) { }
 
    ngOnInit() {
        this.registerViewModel = new RegisterViewModel();
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