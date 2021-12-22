import { NgModule } from '@angular/core';
import { SharedModule } from '@app-seller/shared';

import { ProductsRoutingModule } from '@app-seller/product-management/products-routing.module';
import { ProductDetailsComponent } from '@app-seller/product-management/containers/product-details/product-details.component';
import { FormsModule } from '@angular/forms';
import { ProductImagesComponent } from '@app-seller/product-management/components/product-images/product-images.component';
import { ProductCategoryTableComponent } from './containers/product-category-table/product-category-table.component';


@NgModule({
  imports: [SharedModule, ProductsRoutingModule, FormsModule],
  declarations: [ProductDetailsComponent, ProductImagesComponent, ProductCategoryTableComponent],
})
export class ProductsModule {}
