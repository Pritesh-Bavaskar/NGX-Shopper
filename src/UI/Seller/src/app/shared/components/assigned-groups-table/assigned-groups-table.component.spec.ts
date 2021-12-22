import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedGroupsTableComponent } from './assigned-groups-table.component';

describe('AssignedGroupsTableComponent', () => {
  let component: AssignedGroupsTableComponent;
  let fixture: ComponentFixture<AssignedGroupsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedGroupsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedGroupsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
