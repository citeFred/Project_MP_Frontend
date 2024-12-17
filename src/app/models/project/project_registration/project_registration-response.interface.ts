export enum Registration {
    APPROVED = 'approved',
    PENDING = 'pending',
    REJECTED = 'rejected'
}
export enum TeamRole {
    LEADER = 'leader',
    MEMBER = 'member'
}
export interface ProjectRegistrationResponseData {
    registration_id: number;
    reporting_date: string;
    registration_status: Registration;
    project_role: string;
    team_role: TeamRole;
  }