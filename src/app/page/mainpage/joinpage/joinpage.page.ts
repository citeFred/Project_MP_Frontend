import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from "@angular/router";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-joinpage',
  templateUrl: './joinpage.page.html',
  styleUrls: ['./joinpage.page.scss'],
})
export class JoinpagePage implements OnInit {
  registerForm!: FormGroup;
  userRole: string | undefined;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.userRole = this.router.getCurrentNavigation()?.extras.state?.['user_role'];

    this.registerForm = this.fb.group({
      user_name: ['', Validators.required],
      nick_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      user_role: [this.userRole || '', Validators.required],
      account_id: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
      passwordConfirm: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    }, {validators: this.passwordMatchValidator});
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;

    return password && passwordConfirm && password !== passwordConfirm ? {'passwordMismatch': true} : null;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    const data = this.registerForm.value;

    if (this.registerForm.valid) {
        try {
            const response = await firstValueFrom(this.authService.register(data));
            console.log('회원가입 성공:', response);

            const alert = await this.alertController.create({
                header: 'Success',
                message: '회원가입이 성공했습니다',
                buttons: ['OK'],
            });
            await alert.present();

            this.registerForm.reset();
            await this.router.navigate(['/loginpage']);
        } catch (error: any) {
            console.error('회원가입 실패:', error);

            const alert = await this.alertController.create({
                header: '입력 오류',
                message: error.message, // 서비스에서 반환된 오류 메시지 사용
                buttons: ['OK'],
            });
            await alert.present();
        }
    } else {
        let errorMessage = '다음 입력란을 확인해주세요:\n';

        for (const field in this.registerForm.controls) {
            const control = this.registerForm.get(field);
            if (control && control.invalid) {
                const fieldName = this.getFieldName(field);
                errorMessage += `- ${fieldName}\n`;
            }
        }

        const alert = await this.alertController.create({
            header: '입력 오류',
            message: errorMessage,
            buttons: ['OK'],
        });
        await alert.present();
    }
}



  getFieldName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      user_name: '이름',
      nick_name: '닉네임',
      user_role: '역할',
      account_id: '아이디',
      password: '비밀번호',
      passwordConfirm: '비밀번호 확인',
      email: '이메일',
    };
    return fieldNames[field] || field;
  }
}
