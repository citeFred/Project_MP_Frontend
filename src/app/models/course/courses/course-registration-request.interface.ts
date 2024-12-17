import { Registration } from "../../enums/role.enums";

export interface CourseRegistrationRequestData {
    course_registration_status: Registration;
    course_reporting_date?: Date;
}