import { ConfigService } from './../shared/utils/config.service';
import { NotificationService } from './../shared/utils/notification.service';
import { IApplicationUser } from './../shared/interfaces';
import { DataService } from './../shared/services/data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  users: IApplicationUser[];
  apiHost: string;

  constructor(private dataService: DataService,
              private notificationService: NotificationService,
              private configService: ConfigService) { }

  ngOnInit() {
    this.apiHost = this.configService.getApiHost();
    this.loadAllUsers();
  }

  loadAllUsers() {
    this.dataService.getApplicationUsers()
      .subscribe((users: IApplicationUser[]) => {
            this.users = users;   
        },
        error => {           
            this.notificationService.printErrorMessage('Failed to load departments. ' + error);
        });
  }

  enableLockOut(userName: string) {
    this.dataService.enableLockOut(userName)
    .subscribe(() => {
        this.notificationService.printSuccessMessage('User has been locked out.');
        this.loadAllUsers();
    },
    error => {
        this.notificationService.printErrorMessage('Failed to lock out the user. ' + error);
    })
  }

  disableLockOut(userName: string) {
    this.dataService.disableLockOut(userName)
    .subscribe((lockedOut) => {
        this.notificationService.printSuccessMessage('User has been unlocked.');
        this.loadAllUsers();
    },
    error => {
        this.notificationService.printErrorMessage('Failed to disable lockout. ' + error);
    })
  }
}