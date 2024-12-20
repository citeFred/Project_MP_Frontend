import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-data-modal',
  templateUrl: './user-data-modal.component.html',
  styleUrls: ['./user-data-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
  ]
})
export class UserDataModalComponent implements OnInit {
  modifyUserForm!: FormGroup;

  @Input() userName: string | null = null;
  @Input() userRole: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertController: AlertController,
    private modalController: ModalController,
  ) {
    this.modifyUserForm = this.formBuilder.group({
      // 추후 회원 수정관련 처리 필요시 필드 매칭
      // id: ['', Validators.required],
      // user_name: ['', Validators.required],
      // user_role: ['', Validators.required],
      // description: ['', Validators.required],
    });
  }  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async onSubmit() {
    if (this.modifyUserForm.valid) {
      const modifyUserData = this.modifyUserForm.value;

      try {
        // firstValueFrom을 사용하여 Observable 처리
        const response = await firstValueFrom(this.userService.modifyUser(modifyUserData));
        console.log('User modified successfully:', response);

        // 성공 시 Alert 띄우기
        await this.showAlert('성공', '회원 정보가 성공적으로 수정되었습니다.');
      } catch (error) {
        console.error('Error modifying User:', error);
        // 오류 발생 시 Alert 띄우기
        await this.showAlert('실패', '회원 정보 수정에 실패했습니다.');
      }
    }
  }

  // Alert 생성 메서드
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['확인'],
    });

    await alert.present();
  }
}