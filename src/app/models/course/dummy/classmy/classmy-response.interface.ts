import { VideoTopicResponseData } from "../../video_topic/video_topic-response.interface";
import { LectureItem } from "./lecture_item-response.interface";


export interface ClassmyResponseData {
    activeSection: 'lecture' | 'material'; // union type으로 명확한 값 정의
    VideoTopics: VideoTopicResponseData[];
    lectureItems: LectureItem[];
    isEmptyState: boolean;
  }