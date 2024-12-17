export interface ProjectResponseData {
    project_id: number;
    topic: string;
    class: string;
    project_status: 'in_progress' | 'completed';
    team_name: string;
    profile: string;
    requirements: string;
  }