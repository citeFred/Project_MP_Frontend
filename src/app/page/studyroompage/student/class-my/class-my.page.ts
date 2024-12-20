import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from 'src/app/services/course/video.service';

@Component({
  selector: 'app-classmy',
  templateUrl: './class-my.page.html',
  styleUrls: ['./class-my.page.scss'],
})
export class ClassMyPage implements OnInit {
  class = {
    id: 1,
    title: '언리얼 엔진을 활용한 VR/AR 개발',
    instructor: '강사 : 김진황',
    // lessons: Array.from({ length: 30 }, (_, i) => ({
    //   id: i + 1, // 고유 ID
    //   name: `${i + 1}. 이 강의는 웹 개발에 대한 중요한 내용을 다룹니다.z`
    // }))
    lessons: this.createLessons()
  };

  private createLessons() {
    const titles = [
      '언리얼 엔진 설치 및 작업환경 구축, 언리얼 엔진의 개요',
      '블루프린트의 종류와 변수, 메모리의 이해',
      'Get/Set 노드와 함수, 사칙연산, 흐름제어, 반복문',
      '예외처리',
      '열거형, 함수 사용',
      '자료구조, 구조체, 타일맵 구현',
      '맵 탈출 게임 심화',
      '타이머와 Actor 블루프린트',
      '맵 탈출 심화 / 타이머 Actor 보충학습',
      '자료구조 맵',
      '클래스의 이해와 캐릭터 컨트롤러를 통한 움직임 제어',
      '애니메이션 블루프린트',
      '스켈라탈 애니메이션, 몽타주 사용',
      '애님 노티파이, 충돌처리',
      '카메라 처리',
      'FPS 게임 심화',
      'C++ 문법(캐릭터와 입력 시스템)',
      'C++ 문법(캐릭터 컨트롤)',
      'C++ 문법(시점변환 실습)',
      'VR 설치 및 작업환경 구축 / Nav Mesh',
      'VR 플레이어 Pawn 직접 개발해보기',
      'VR을 이용한 Unreal 기본기',
      'VR과 상호작용하기',
      'C++ 문법(애니메이션)',
      'C++ 문법(콤보 시스템)-1',
      'C++ 문법(콤보 시스템)-2',
      'C++ 문법(콤보 시스템)-3',
      'C++ 문법(콤보 시스템)-4',
    ];

    return titles.map((title, index) => ({
      name: index + 1 + ". " + title
    }))

  }

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private classService: VideoService,
    private route: ActivatedRoute
  ) {}

  getPaginatedLessons() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.class.lessons.slice(start, start + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.class.lessons.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const classId = params.get('class_id');
      console.log(classId);
      if (classId) {
        // 클래스 데이터를 가져오는 로직 추가 가능
      }
    });
  }
}