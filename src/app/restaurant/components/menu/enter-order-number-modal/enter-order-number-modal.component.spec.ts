import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterOrderNumberModalComponent } from './enter-order-number-modal.component';

describe('EnterOrderNumberModalComponent', () => {
  let component: EnterOrderNumberModalComponent;
  let fixture: ComponentFixture<EnterOrderNumberModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterOrderNumberModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnterOrderNumberModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
