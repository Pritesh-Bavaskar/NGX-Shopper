import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressAssignmentComponent } from './address-assignment.component';

describe('AddressAssignmentComponent', () => {
  let component: AddressAssignmentComponent;
  let fixture: ComponentFixture<AddressAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
