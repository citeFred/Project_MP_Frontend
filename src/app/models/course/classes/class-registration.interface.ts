import { ClassRegistrationStatus } from "../../enums/class-registration-status.enum";

export interface CreateClassRegistrationDto {
  class_reporting_date: String;
  class_registration_status: ClassRegistrationStatus;
}
