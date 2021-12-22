import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceSchedulerFormComponent } from './price-scheduler-form.component';

describe('PriceSchedulerFormComponent', () => {
  let component: PriceSchedulerFormComponent;
  let fixture: ComponentFixture<PriceSchedulerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceSchedulerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceSchedulerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
