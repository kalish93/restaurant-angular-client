import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeliberateDialogComponent } from './confirm-deliberate-dialog.component';

describe('ConfirmDeliberateDialogComponent', () => {
  let component: ConfirmDeliberateDialogComponent;
  let fixture: ComponentFixture<ConfirmDeliberateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDeliberateDialogComponent],
    });
    fixture = TestBed.createComponent(ConfirmDeliberateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
