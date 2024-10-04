import './polyfills';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app/app.component';

enableProdMode();

platformBrowserDynamic().bootstrapApplication(AppComponent).then((ref: any) => {
  if (window['ngRef']) {
    window['ngRef'].destroy();
  }
  window['ngRef'] = ref;
}).catch((err: any) => console.error(err));
