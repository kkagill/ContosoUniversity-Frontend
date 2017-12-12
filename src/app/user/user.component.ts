import { NgForm } from '@angular/forms';
import { AuthService } from './../shared/services/auth.service';
import { IApplicationUser } from './../shared/interfaces';
import { ConfigService } from './../shared/utils/config.service';
import { NotificationService } from './../shared/utils/notification.service';
import { DataService } from './../shared/services/data.service';
import { ItemsService } from '../shared/utils/items.service';
import { Component, OnInit, ViewChild, ViewContainerRef, trigger, state, style, transition, animate } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
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

export class UserComponent implements OnInit {
  apiHost: string;
  userProfile: IApplicationUser;
  selectedUserLoaded: boolean = false;
  show: boolean = false;

  constructor(private dataService: DataService,
              private notificationService: NotificationService,
              private configService: ConfigService,
              private authService: AuthService,
              private itemsService: ItemsService) { }

  ngOnInit() {
    this.apiHost = this.configService.getApiHost();
    this.loadUserProfile();
    this.show = true;
  }

  loadUserProfile() {
    this.dataService.getUserProfile(this.authService.getUserName())
      .subscribe((user: IApplicationUser) => {
            this.userProfile = this.itemsService.getSerialized<IApplicationUser>(user);
            this.selectedUserLoaded = true;  
        },
        error => {           
            this.notificationService.printErrorMessage('Failed to load user profile. ' + error);
        });
  }

  updateUserProfile(editUserForm: NgForm) {
    this.dataService.updateUserProfile(this.authService.getUserId(), this.userProfile)
        .subscribe(() => {
            this.notificationService.printSuccessMessage('User profile has been updated');
        },
        error => {
            this.notificationService.printErrorMessage('Failed to update profile. ' + error);
        });
    }
}