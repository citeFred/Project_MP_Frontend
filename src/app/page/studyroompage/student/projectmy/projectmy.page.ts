import { Component, OnInit } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project/project.service';
import { ApiResponse } from 'src/app/models/common/api-response.interface';
import { ProjectResponseData } from 'src/app/models/project/projects/projects-response.interface';

@Component({
  selector: 'app-projectmy',
  templateUrl: './projectmy.page.html',
  styleUrls: ['./projectmy.page.scss'],
})
export class ProjectmyPage implements OnInit {
  isHidden=false;
  project_id: number = 1;
  isfolderinner=true;
  selectedFolderIndex: number | null = null; // 선택된 폴더의 인덱스
  selectedFolderIndices: number[] = [];  // 폴더 경로를 저장하는 배열
  isPopupVisible: boolean = false; // 팝업 표시 상태

  // 새로운 ProjectResponseData 인터페이스에 맞게 초기화
  public data: ProjectResponseData = {
    project_id: 0,
    topic: '',
    class: '',
    project_status: 'in_progress',
    team_name: '',
    profile: '',
    requirements: '',
  };

  public projectsList: ProjectResponseData[] = [];
  private routeSubscription?: Subscription;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // URL 경로에서 project_id 파라미터를 가져와 저장
    this.route.paramMap.subscribe(params => {
      const projectId = params.get('project_id');
      if (projectId) {
        this.project_id = +projectId;
        this.getProjectDetails(); // 특정 프로젝트 로드
      } else {
        console.error('Project ID가 설정되지 않았습니다.');
      }
    });

    // 페이지가 로드될 때 전체 프로젝트 데이터 로드
    this.loadProjects();
  }

  // 전체 프로젝트 데이터를 로드하는 메서드
  async loadProjects() {
    try {
      // ApiResponse에서 프로젝트 배열을 받도록 변경
      const response: ApiResponse<ProjectResponseData[]> = await firstValueFrom(
        this.projectService.getAllProjects()
      );

      // 로드한 프로젝트 리스트를 저장
      this.projectsList = response.data || [];

      if (this.projectsList.length === 0) {
        console.log('프로젝트가 없습니다.');
      } else {
        console.log('로드된 프로젝트:', this.projectsList);
      }
    } catch (error) {
      console.error('프로젝트 로드 중 오류 발생', error);
    }
  }

  // 폴더를 열 때 호출되는 메서드
  openFolder(folderIndex: number) {
    this.selectedFolderIndices.push(folderIndex); // 선택한 폴더 인덱스를 추가
  }

  // 폴더 목록으로 돌아갈 때 호출되는 메서드
  goBackToFolders() {
    this.selectedFolderIndices.pop();  // 마지막 선택을 제거하여 상위 폴더로 이동
  }

  // 현재 선택한 폴더의 깊이를 확인하는 메서드
  isInSubfolder(): boolean {
    return this.selectedFolderIndices.length > 0;
  }

  //팝업
  openPopup(): void {
    this.isPopupVisible = true; // 팝업 열기
  }

  closePopup(): void {
    this.isPopupVisible = false; // 팝업 닫기
  }


  // 특정 프로젝트 정보를 가져오는 메서드
  async getProjectDetails() {
    try {
      const response: ApiResponse<ProjectResponseData> = await firstValueFrom(
        this.projectService.getProjectById(this.project_id)
      );

      // 단일 프로젝트 데이터를 data 객체에 저장
      this.data = response.data;
      console.log('프로젝트 세부 정보:', this.data);
    } catch (error) {
      console.error('프로젝트 세부 정보 로드 중 오류 발생', error);
    }
  }

  // 새로운 프로젝트 생성 메서드
  async createProject() {
    const projectData = {
      topic: this.data.topic,
      class: this.data.class,
      team_name: this.data.team_name,
      profile: this.data.profile,
      requirements: this.data.requirements,
    };

    try {
      const response = await firstValueFrom(
        this.projectService.createProject(projectData)
      );
      console.log('프로젝트 생성 성공:', response);
      this.loadProjects(); // 생성 후 목록 갱신
    } catch (error) {
      console.error('프로젝트 생성 중 오류 발생', error);
    }
  }

  // 프로젝트 상태 업데이트 메서드
  async updateProject() {
    const projectData = {
      topic: this.data.topic,
      class: this.data.class,
      team_name: this.data.team_name,
      profile: this.data.profile,
      requirements: this.data.requirements,
    };

    try {
      const response = await firstValueFrom(
        this.projectService.updateProject(this.project_id, projectData)
      );
      console.log('프로젝트 업데이트 성공:', response);
      this.loadProjects(); // 업데이트 후 목록 갱신
    } catch (error) {
      console.error('프로젝트 업데이트 중 오류 발생', error);
    }
  }

  // 프로젝트 삭제 메서드
  async deleteProject() {
    const confirmed = confirm('이 프로젝트를 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
        // ProjectResponseData 타입으로 변경
        const response: ApiResponse<ProjectResponseData> = await firstValueFrom(
            this.projectService.deleteProject(this.project_id)
        );
        console.log('프로젝트 삭제 성공:', response.data);
        this.loadProjects(); // 삭제 후 목록 갱신
    } catch (error) {
        console.error('프로젝트 삭제 중 오류 발생', error);
    }
}

  // 프로젝트 상태 업데이트 (상태 전환)
  async changeProjectStatus(status: 'in_progress' | 'completed') {
    try {
      this.data.project_status = status;
      await this.updateProject();
      console.log('프로젝트 상태 변경 완료:', status);
    } catch (error) {
      console.error('프로젝트 상태 변경 중 오류 발생', error);
    }
  }

  // Alert 메시지 표시를 위한 메서드
  async showAlert(title: string, message: string) {
    alert(`${title}: ${message}`);
  }

  hideElement() {
    this.isHidden = true; // 클릭 시 요소를 숨김
    this.isfolderinner = false; // 클릭 시 요소를 숨김
  }

  visibleElement() {
    this.isHidden = false;
    this.isfolderinner = true; // 클릭 시 요소를 숨김
  }
}
