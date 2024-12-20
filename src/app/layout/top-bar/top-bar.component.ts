import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from '@angular/common';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service';
import { JoinModalComponent } from "../../page/mainpage/join-modal/join-modal.component";
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserDataModalComponent } from 'src/app/page/mainpage/mypage/mypage-update-modal/user-data-modal.component';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    CommonModule,
  ],
})

export class TopBarComponent implements OnInit {
  isLoggedIn = false;
  userName: string | null = null;
  userRole: string | null = null;

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private alertController: AlertController,
    private jwtHelper: JwtHelperService,

  ) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(status => {
      console.log('로그인 상태:', status);
      this.isLoggedIn = status;  // 로그인 상태가 변경될 때 업데이트
      if (this.isLoggedIn) {
        this.loadUserData(); // 로그인 상태가 true일 때 사용자 정보 로드
      } else {
       
      }
    });
    
  }
// 사용자 데이터 디코딩
  loadUserData() {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token); // 토큰 디코딩
      console.log('디코딩된 토큰:', decodedToken);
      this.userName = decodedToken.user_name || null; // 사용자 ID
      this.userRole = decodedToken.user_role || null; // 사용자 역할
    }
  }
  // 사용자 데이터 나오는 모달
  async openUserDataModal() {
    const modal = await this.modalController.create({
      component: UserDataModalComponent,
      componentProps: {
        userName: this.userName,
        userRole: this.userRole
      },
      cssClass: 'modal'
    });
    await modal.present();
  }

  logout() {
    this.authService.logout_current();  // 로그아웃 호출
    this.showAlert('로그아웃 성공', '로그아웃이 성공적으로 완료되었습니다.')
      .then(() => {
      
     });
    ;
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: JoinModalComponent,
      cssClass: "modal"
    });

    return await modal.present();
  }
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
