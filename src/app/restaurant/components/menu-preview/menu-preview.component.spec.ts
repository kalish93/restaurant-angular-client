import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPreviewComponent } from './menu-preview.component';

describe('MenuPreviewComponent', () => {
  let component: MenuPreviewComponent;
  let fixture: ComponentFixture<MenuPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
