import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationAdminPage } from './registration-admin.page';

describe('RegistrationAdminPage', () => {
  let component: RegistrationAdminPage;
  let fixture: ComponentFixture<RegistrationAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
