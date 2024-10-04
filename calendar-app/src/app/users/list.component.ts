import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
    templateUrl: 'list.component.html'
})
export class ListComponent implements OnInit {
    users: any[] = []; // Initialize users as an empty array

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.authService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    deleteUser(id: string) {
        const user = this.users.find(x => x.id === id);
        if (user) {
            user.isDeleting = true; // Set isDeleting to true if user is found
            this.authService.delete(id)
                .pipe(first())
                .subscribe(() => {
                    this.users = this.users.filter(x => x.id !== id);
                });
        }
    }
}
