import { AuthService } from './../../shared/services/auth.service';
import { Component } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { Response } from '@angular/http';

@Component({
  selector: 'header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(private titleService: Title, private authService: AuthService) {
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
}

  onLogout() {
    this.authService.logout();
  }
}
