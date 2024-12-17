export interface CourseWithVideoTopicResponseData {
    course_title: string;
    description: string;
    instructor_name: string;
    course_notice: string;
    generation: string;
    videotopic: {
        video_topic_id: number;
        video_topic_title: string;
        video_pa_topic_id?: number | null;
        file_path?: string | null;
        //...
    }[];
    //...
}
  