import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedGroupsComponent } from './assigned-groups.component';

describe('AssignedGroupsComponent', () => {
  let component: AssignedGroupsComponent;
  let fixture: ComponentFixture<AssignedGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
