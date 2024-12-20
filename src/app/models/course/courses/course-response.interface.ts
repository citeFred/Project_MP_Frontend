export interface CourseResponseData {
  id: number;          // 강의 ID
  title: string;       // 강의 제목
  description: string;        // 강의 설명
  instructor: string;    // 강사 이름
  course_notice: string | null; // 강의 공지사항 (null일 수 있음)
  generation: string;         // 기수
}