import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTableOrdersComponent } from './active-table-orders.component';

describe('ActiveTableOrdersComponent', () => {
  let component: ActiveTableOrdersComponent;
  let fixture: ComponentFixture<ActiveTableOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveTableOrdersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActiveTableOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
