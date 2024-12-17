import { CourseDocRequestData } from "../course_doc/course_doc-request.interface";

export interface DocNameResponseData {
  topic_id: number;
  topic_title: string;
  pa_topic_id: number | null;
  course_doc: CourseDocRequestData[];
  sub_topics?: DocNameResponseData[];
}
