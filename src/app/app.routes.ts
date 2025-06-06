import { Routes } from '@angular/router';
import { ShortenComponent } from './shorten/shorten.component';
import { RedirectComponent } from './redirectcomponent/redirectcomponent.component';

export const routes: Routes = [
    {path: '', component: ShortenComponent},
    { path: ':shortCode', component: RedirectComponent},
    {path: '**', redirectTo: '', pathMatch: 'full'},
];
