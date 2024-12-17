import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassinstructorPage } from './classinstructor.page';

describe('ClassinstructorPage', () => {
  let component: ClassinstructorPage;
  let fixture: ComponentFixture<ClassinstructorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassinstructorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});