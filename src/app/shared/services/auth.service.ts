import { AuthTokenModel } from './../../models/authTokenModel';
import { JwtHelper } from 'angular2-jwt';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
 
@Injectable()
export class AuthService {
 
    constructor(private router: Router, private titleService: Title) { }
 
    jwtHelper: JwtHelper = new JwtHelper();

    // for requesting secure data using json
    authJsonHeaders() {
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Accept', 'application/json');
        header.append('Authorization', 'Bearer ' + sessionStorage.getItem('bearer_token'));
        return header;
    }
 
    // for requesting secure data from a form post
    authFormHeaders() {
        let header = new Headers();
        header.append('Content-Type', 'application/x-www-form-urlencoded');
        header.append('Accept', 'application/json');
        header.append('Authorization', 'Bearer ' + sessionStorage.getItem('bearer_token'));
        return header;
    }
 
    // for requesting unsecured data using json
    jsonHeaders() {
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Accept', 'application/json');
        return header;
    }
 
    // for requesting unsecured data using form post
    contentHeaders() {
        let header = new Headers();
        header.append('Content-Type', 'application/x-www-form-urlencoded');
        header.append('Accept', 'application/json');
        return header;
    }
 
    // After a successful login, save token data into session storage
    // note: use "localStorage" for persistent, browser-wide logins; "sessionStorage" for per-session storage.
    login(tokens: AuthTokenModel) {
        let access_token: string = tokens.access_token;
        let expires_in: number = tokens.expires_in;
        sessionStorage.setItem('access_token', access_token);
        sessionStorage.setItem('bearer_token', access_token);
        // TODO: implement meaningful refresh, handle expiry 
        sessionStorage.setItem('expires_in', expires_in.toString());
    }
 
    // called when logging out user; clears tokens from browser
    logout() {
        //localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('bearer_token');
        sessionStorage.removeItem('expires_in');
        this.router.navigate(['']);
        this.titleService.setTitle('Home');
    }
 
    // simple check of logged in status: if there is a token, we're (probably) logged in.
    // ideally we check status and check token has not expired (server will back us up, if this not done, but it could be cleaner)
    isAuthenticated() {
        return !!sessionStorage.getItem('bearer_token');
    }

    useJwtHelper() {
        var token = sessionStorage.getItem('bearer_token');
        //this.jwtHelper.getTokenExpirationDate(token),
        //this.jwtHelper.isTokenExpired(token)       
        return this.jwtHelper.decodeToken(token);       
    }

    isAdmin() {
        return this.useJwtHelper().role == 'Admin' ? true : false;
    }

    getUserName() {
        return this.useJwtHelper().name;
    }

    getUserId() {
        return this.useJwtHelper().sub;
    }
}