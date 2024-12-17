export interface VideoTopicResponseData {
    video_topic_id: number;
    video_topic_title: string;
    videos: { video_id: number, video_title: string }[];  // 비디오 정보를 단순화
}