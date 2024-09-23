import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountTipDialogComponent } from './discount-tip-dialog.component';

describe('DiscountTipDialogComponent', () => {
  let component: DiscountTipDialogComponent;
  let fixture: ComponentFixture<DiscountTipDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountTipDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiscountTipDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
