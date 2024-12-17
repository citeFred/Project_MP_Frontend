import { Routes } from "@angular/router";
import { DocTopicComponent } from "./doc-topic.component";

// doc-name.routes.ts
const routes: Routes = [
    {
      path: 'course/:courseId/doc-topic',
      component: DocTopicComponent,
      children: [
        { path: '', component: DocTopicComponent },
        { path: ':topicId', component: DocTopicComponent }
      ]
    }
  ];