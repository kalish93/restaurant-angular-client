import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuQrDialogComponent } from './menu-qr-dialog.component';

describe('MenuQrDialogComponent', () => {
  let component: MenuQrDialogComponent;
  let fixture: ComponentFixture<MenuQrDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuQrDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuQrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
