import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuListForUsersComponent } from './menu-list-for-users.component';

describe('MenuListForUsersComponent', () => {
  let component: MenuListForUsersComponent;
  let fixture: ComponentFixture<MenuListForUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuListForUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuListForUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
