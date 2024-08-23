import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmWithCommentDialogComponent } from './confirm-with-comment-dialog.component';

describe('ConfirmWithCommentDialogComponent', () => {
  let component: ConfirmWithCommentDialogComponent;
  let fixture: ComponentFixture<ConfirmWithCommentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmWithCommentDialogComponent],
    });
    fixture = TestBed.createComponent(ConfirmWithCommentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
