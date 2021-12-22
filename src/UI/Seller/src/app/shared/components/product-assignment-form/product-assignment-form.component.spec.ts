import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAssignmentFormComponent } from './product-assignment-form.component';

describe('ProductAssignmentFormComponent', () => {
  let component: ProductAssignmentFormComponent;
  let fixture: ComponentFixture<ProductAssignmentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAssignmentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAssignmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
