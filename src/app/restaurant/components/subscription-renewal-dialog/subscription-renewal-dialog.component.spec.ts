import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionRenewalDialogComponent } from './subscription-renewal-dialog.component';

describe('SubscriptionRenewalDialogComponent', () => {
  let component: SubscriptionRenewalDialogComponent;
  let fixture: ComponentFixture<SubscriptionRenewalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionRenewalDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscriptionRenewalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
