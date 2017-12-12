import { Component } from '@angular/core';

export class AuthTokenModel {
   access_token: string;
   expires_in: number;
   refresh_token: string;
   token_type: string;
}