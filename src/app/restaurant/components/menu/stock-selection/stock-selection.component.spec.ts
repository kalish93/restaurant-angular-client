import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSelectionComponent } from './stock-selection.component';

describe('StockSelectionComponent', () => {
  let component: StockSelectionComponent;
  let fixture: ComponentFixture<StockSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
