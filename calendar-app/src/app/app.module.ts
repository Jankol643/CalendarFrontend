import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes'; // Adjust the path as necessary

@NgModule({
    declarations: [
        AppComponent,
        // other components
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes) // Configure the router with the routes
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
