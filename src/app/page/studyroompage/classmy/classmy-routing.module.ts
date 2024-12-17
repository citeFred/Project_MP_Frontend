import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassmyPage } from './classmy.page';
import { DocTopicComponent } from 'src/app/component/doc-topic/doc-topic.component';

const routes: Routes = [
  {
    path: '',
    component: ClassmyPage,
    children: [
      {
        path: 'doc-topics',  // 학습자료 초기 경로
        component: DocTopicComponent
      },
      {
        path: 'doc-topics/:topicId',  // 특정 폴더 경로
        component: DocTopicComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassmyPageRoutingModule {}