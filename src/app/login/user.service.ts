import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './user';

@Injectable({ providedIn: 'root' })
export class UserService { 
    constructor(private http: HttpClient) { }
    userUrl: string = "http://localhost:57193/api/users";


    getAll() {
        return this.http.get<User[]>(this.userUrl);
    }
}