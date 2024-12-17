export interface CourseWithDocNameAndCourseDocResponseData {
    course_id: number;          // 강의 ID
    course_title: string;       // 강의 제목
    description: string;        // 강의 설명
    instructor_name: string;    // 강사 이름
    generation: string;         // 기수
    course_notice: string | null; // 강의 공지사항 (null일 수 있음)
    doc_name: {
        topic_id: number;
        topic_title: string;
        pa_topic_id?: number;
        course_doc: {
            upload_date: Date;
            file_path: string;
            //...
        }[];
        //...
    }[];
    //...
}
  