import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryTableComponent } from './product-category-table.component';

describe('ProductCategoryTableComponent', () => {
  let component: ProductCategoryTableComponent;
  let fixture: ComponentFixture<ProductCategoryTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCategoryTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCategoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
