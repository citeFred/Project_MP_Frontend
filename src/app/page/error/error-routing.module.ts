import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { BadRequestComponent } from './bad-request/bad-request.component';

const routes: Routes = [
    {
    path: '', component: BadRequestComponent,
    }, 
    {
    path: 'forbidden', component: ForbiddenComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ErrorRoutingModule {}