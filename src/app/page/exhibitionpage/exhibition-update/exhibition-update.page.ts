import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ExhibitionService } from '../../../services/exhibition/exhibitionservice.service';

@Component({
  selector: 'app-exhibition-update',
  templateUrl: './exhibition-update.page.html',
  styleUrls: ['./exhibition-update.page.scss'],
})
export class ExhibitionUpdatePage implements OnInit {
  exhibitionId: number | null = null;
  exhibitionForm: FormGroup;
  memberForms: FormArray;
  files: { [key: string]: File | File[] } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private exhibitionService: ExhibitionService
  ) {
    this.memberForms = this.formBuilder.array([]);
    this.exhibitionForm = this.formBuilder.group({
      projectName: ['', Validators.required],
      teamName: ['', Validators.required],
      className: ['', Validators.required],
      introContent: ['', Validators.required],
      members: this.memberForms
    });
  }

  ngOnInit() {
    this.exhibitionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadExhibitionDetails();
  }

  loadExhibitionDetails() {
    if (this.exhibitionId) {
      this.exhibitionService.getAllExhibitionDetails(this.exhibitionId).subscribe(
        (data) => {
          this.exhibitionForm.patchValue({
            projectName: data.projectName,
            teamName: data.teamName,
            className: data.className,
            introContent: data.intro.content
          });
          data.members.forEach((member: string) => {
            this.memberForms.push(this.formBuilder.control(member));
          });
        },
        (error) => {
          console.error('전시관 상세 정보 로딩 실패:', error);
        }
      );
    }
  }

  addMember() {
    this.memberForms.push(this.formBuilder.control(''));
  }

  onFileChange(event: any, type: string) {
    const files = event.target.files;
    if (files.length > 0) {
      if (type === 'outputImage') {
        this.files[type] = Array.from(files);
      } else {
        this.files[type] = files[0];
      }
    }
  }

  onSubmit() {
    if (this.exhibitionForm.valid && this.exhibitionId) {
      const exhibitionData = this.prepareExhibitionData();
      const introData = this.prepareIntroData();
      const membersData = this.prepareMembersData();
      const outputsData = this.prepareOutputsData();

      this.exhibitionService.updateExhibition(this.exhibitionId.toString(), exhibitionData, introData, membersData, outputsData).subscribe(
        () => {
          this.router.navigate(['/exhibition-details', this.exhibitionId]);
        },
        (error) => {
          console.error('전시관 정보 수정 실패:', error);
        }
      );
    }
  }

  private prepareExhibitionData(): FormData {
    const formData = new FormData();
    formData.append('projectName', this.exhibitionForm.get('projectName')?.value);
    formData.append('teamName', this.exhibitionForm.get('teamName')?.value);
    formData.append('className', this.exhibitionForm.get('className')?.value);
    if (this.files['thumbnail'] && this.files['thumbnail'] instanceof File) {
      formData.append('thumbnail', this.files['thumbnail']);
    }
    return formData;
  }

  private prepareIntroData(): FormData {
    const formData = new FormData();
    formData.append('content', this.exhibitionForm.get('introContent')?.value);
    if (this.files['introImage'] && this.files['introImage'] instanceof File) {
      formData.append('image', this.files['introImage']);
    }
    return formData;
  }

  private prepareMembersData(): FormData {
    const formData = new FormData();
    this.memberForms.controls.forEach((control, index) => {
      formData.append(`member${index + 1}`, control.value);
    });
    return formData;
  }

  private prepareOutputsData(): FormData {
    const formData = new FormData();
    if (this.files['outputImage'] && Array.isArray(this.files['outputImage'])) {
      this.files['outputImage'].forEach((file, index) => {
        formData.append(`image${index + 1}`, file);
      });
    }
    if (this.files['outputVideo'] && this.files['outputVideo'] instanceof File) {
      formData.append('video', this.files['outputVideo']);
    }
    return formData;
  }
}
