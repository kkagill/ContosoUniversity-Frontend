import { ConfigService } from './../shared/utils/config.service';
import { NotificationService } from './../shared/utils/notification.service';
import { IApplicationUser } from './../shared/interfaces';
import { DataService } from './../shared/services/data.service';
import { Component, OnInit, ViewChild, ViewContainerRef, trigger, state, style, transition, animate } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
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

export class AdminComponent implements OnInit {
  users: IApplicationUser[];
  apiHost: string;
  show: boolean = false;

  constructor(private dataService: DataService,
              private notificationService: NotificationService,
              private configService: ConfigService) { }

  ngOnInit() {
    this.apiHost = this.configService.getApiHost();
    this.loadAllUsers();
    this.show = true;
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