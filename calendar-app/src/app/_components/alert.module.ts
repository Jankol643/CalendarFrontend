import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert.component';

@NgModule({
    declarations: [AlertComponent],
    imports: [CommonModule],
    exports: [AlertComponent] // Export the component so it can be used in other modules
})
export class AlertModule { }
