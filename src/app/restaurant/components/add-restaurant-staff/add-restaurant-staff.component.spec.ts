import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRestaurantStaffComponent } from './add-restaurant-staff.component';

describe('AddRestaurantStaffComponent', () => {
  let component: AddRestaurantStaffComponent;
  let fixture: ComponentFixture<AddRestaurantStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRestaurantStaffComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddRestaurantStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
