import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmGenericDialogComponent } from './confirm-generic-dialog.component';

describe('ConfirmGenericDialogComponent', () => {
  let component: ConfirmGenericDialogComponent;
  let fixture: ComponentFixture<ConfirmGenericDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmGenericDialogComponent],
    });
    fixture = TestBed.createComponent(ConfirmGenericDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
