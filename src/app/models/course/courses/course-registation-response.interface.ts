import { UserResponse } from "../../common/user-response";
import { Registration } from "../../enums/role.enums";
import { CourseResponseData } from "./course-response.interface";

export interface CourseRegistrationResponseData {
    course_registration_id: number;
    course_registration_status: Registration;
    course_reporting_date: Date;
    user?: UserResponse;
    course?: CourseResponseData;
}