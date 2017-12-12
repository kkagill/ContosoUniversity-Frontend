import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
    
    _apiURI : string;

    constructor() {
        this._apiURI = 'http://localhost:51089/api/';
     }

     getApiURI() {
         return this._apiURI;
     }

     getApiHost() {
         return this._apiURI.replace('api/','');
     }
}