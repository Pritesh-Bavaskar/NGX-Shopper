import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAssignmentTableComponent } from './product-assignment-table.component';

describe('ProductAssignmentTableComponent', () => {
  let component: ProductAssignmentTableComponent;
  let fixture: ComponentFixture<ProductAssignmentTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAssignmentTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAssignmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
