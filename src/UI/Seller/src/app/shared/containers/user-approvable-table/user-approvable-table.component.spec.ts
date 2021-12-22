import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserApprovableTableComponent } from './user-approvable-table.component';

describe('UserApprovableTableComponent', () => {
  let component: UserApprovableTableComponent;
  let fixture: ComponentFixture<UserApprovableTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserApprovableTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserApprovableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
