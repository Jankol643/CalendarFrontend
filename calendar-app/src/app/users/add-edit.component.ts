import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { AlertService } from '../_services';

@Component({
    selector: 'app-add-edit',
    templateUrl: './add-edit.component.html',
})
export class AddEditComponent implements OnInit {
    form: FormGroup; // Declare without initialization
    id: number | null = null;
    isAddMode: boolean = false;
    loading: boolean = false;
    submitted: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private alertService: AlertService
    ) {
        // Initialize form in the constructor
        this.form = this.formBuilder.group({});
    }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', passwordValidators]
        });

        if (!this.isAddMode && this.id !== null) {
            this.authService.getById(this.id) // Ensure id is a number
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    private createUser() {
        this.authService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateUser() {
        if (this.id !== null) { // Ensure id is not null
            this.authService.update(this.id, this.form.value)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.alertService.success('Update successful', { keepAfterRouteChange: true });
                        this.router.navigate(['../../'], { relativeTo: this.route });
                    },
                    error: error => {
                        this.alertService.error(error);
                        this.loading = false;
                    }
                });
        }
    }
}
