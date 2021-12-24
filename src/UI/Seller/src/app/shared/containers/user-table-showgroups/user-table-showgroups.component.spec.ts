import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTableShowgroupsComponent } from './user-table-showgroups.component';

describe('UserTableShowgroupsComponent', () => {
  let component: UserTableShowgroupsComponent;
  let fixture: ComponentFixture<UserTableShowgroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTableShowgroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTableShowgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
