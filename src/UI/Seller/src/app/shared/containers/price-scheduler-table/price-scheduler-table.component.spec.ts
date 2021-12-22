import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceSchedulerTableComponent } from './price-scheduler-table.component';

describe('PriceSchedulerTableComponent', () => {
  let component: PriceSchedulerTableComponent;
  let fixture: ComponentFixture<PriceSchedulerTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceSchedulerTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceSchedulerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
