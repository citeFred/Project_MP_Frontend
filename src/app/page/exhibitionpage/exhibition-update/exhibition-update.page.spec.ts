import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExhibitionUpdatePage } from './exhibition-update.page';

describe('ExhibitionUpdatePage', () => {
  let component: ExhibitionUpdatePage;
  let fixture: ComponentFixture<ExhibitionUpdatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExhibitionUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
