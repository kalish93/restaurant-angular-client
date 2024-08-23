import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmWithDateDialogComponent } from './confirm-with-date-dialog.component';

describe('ConfirmWithDateDialogComponent', () => {
  let component: ConfirmWithDateDialogComponent;
  let fixture: ComponentFixture<ConfirmWithDateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmWithDateDialogComponent],
    });
    fixture = TestBed.createComponent(ConfirmWithDateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
