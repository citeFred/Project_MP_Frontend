import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassJoinPage } from './class-join/class-join.page';
import { ClassMyPage } from './class-my/class-my.page';
import { ProjectmyPage } from './projectmy/projectmy.page';
import { ProjectsearchPage } from './projectsearch/projectsearch.page';

const routes: Routes = [
  {
    path: 'classjoin', component: ClassJoinPage
  }, 
  {
    path: 'classmy', component: ClassMyPage
  },
  {
    path: 'projectmy', component: ProjectmyPage
  },
  {
    path: 'projectsearch', component: ProjectsearchPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {}
