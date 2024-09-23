import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOptionFormComponent } from './payment-option-form.component';

describe('PaymentOptionFormComponent', () => {
  let component: PaymentOptionFormComponent;
  let fixture: ComponentFixture<PaymentOptionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentOptionFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentOptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
