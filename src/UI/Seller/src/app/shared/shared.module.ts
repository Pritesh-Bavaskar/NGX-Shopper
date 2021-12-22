// angular
import { NgModule, ModuleWithProviders, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  NgbPaginationModule,
  NgbTabsetModule,
} from '@ng-bootstrap/ng-bootstrap';

// 3rd party UI
import { TreeModule } from 'angular-tree-component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SharedRoutingModule } from '@app-seller/shared/shared-routing.module';
import { SearchComponent } from '@app-seller/shared/components/search/search.component';
import { SortColumnComponent } from '@app-seller/shared/components/sort-column/sort-column.component';
import { ModalComponent } from '@app-seller/shared/components/modal/modal.component';
import { CarouselSlideDisplayComponent } from '@app-seller/shared/components/carousel-slide-display/carousel-slide-display.component';
import { GenericBrowseComponent } from '@app-seller/shared/components/generic-browse/generic-browse.component';
import { UserTableComponent } from '@app-seller/shared/containers/user-table/user-table.component';
import { UserFormComponent } from '@app-seller/shared/components/user-form/user-form.component';
import { AddressTableComponent } from './containers/address-table/address-table.component';
import { AddressFormComponent } from '@app-seller/shared/components/address-form/address-form.component';
import { CategoryTableComponent } from './containers/category-table/category-table.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { CategoryDetailsComponent } from './containers/category-details/category-details.component';
import { ProductTableComponent } from '@app-seller/shared/containers/product-table/product-table.component';
import { ProductFormComponent } from '@app-seller/shared/components/products-form/product-form.component';
import { AssignedGroupsComponent } from '@app-seller/shared/components/assigned-groups/assigned-groups.component';
import { UserGroupTableComponent } from '@app-seller/user-group-management/containers/user-group-table/user-group-table.component';
import { UserGroupModule } from '@app-seller/user-group-management/user-group.module';
import { AssignedGroupsTableComponent } from './components/assigned-groups-table/assigned-groups-table.component';
import { PriceSchedulerTableComponent } from './containers/price-scheduler-table/price-scheduler-table.component';
import { PriceSchedulerFormComponent } from './components/price-scheduler-form/price-scheduler-form.component';
import { ProductAssignmentFormComponent } from './components/product-assignment-form/product-assignment-form.component';
import { ProductAssignmentTableComponent } from './containers/product-assignment-table/product-assignment-table.component';
import { AnnouncementTableComponent } from './containers/announcement-table/announcement-table.component';
import { AnnouncementFormComponent } from './components/announcement-form/announcement-form.component';
import { UserApprovableTableComponent } from './containers/user-approvable-table/user-approvable-table.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  imports: [
    SharedRoutingModule,
    // angular
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
  

   

    // 3rd party UI
    TreeModule,
    FontAwesomeModule,
    FormsModule,
    NgbPaginationModule.forRoot(),
    NgbTabsetModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot()
   
  ],
  exports: [
    // angular
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    

    // 3rd party UI
    TreeModule,
    FontAwesomeModule,
    NgbPaginationModule,
    NgbTabsetModule,
    

    // app components
    SearchComponent,
    SortColumnComponent,
    ModalComponent,
    CarouselSlideDisplayComponent,
    GenericBrowseComponent,
    UserTableComponent,
    UserFormComponent,
    AddressTableComponent,
    AddressFormComponent,
    CategoryTableComponent,
    CategoryFormComponent,
    CategoryDetailsComponent,
    ProductTableComponent,
    ProductFormComponent,
    ProductAssignmentFormComponent,
    ProductAssignmentTableComponent,
    AnnouncementTableComponent,
    AnnouncementFormComponent,
    
  ],
  declarations: [
    SearchComponent,
    SortColumnComponent,
    ModalComponent,
    CarouselSlideDisplayComponent,
    GenericBrowseComponent,
    UserTableComponent,
    UserFormComponent,
    AddressTableComponent,
    AddressFormComponent,
    CategoryTableComponent,
    CategoryFormComponent,
    CategoryDetailsComponent,
    ProductTableComponent,
    ProductFormComponent,
    AssignedGroupsComponent,
    AssignedGroupsTableComponent,
    PriceSchedulerTableComponent,
    PriceSchedulerFormComponent,
    ProductAssignmentFormComponent,
    ProductAssignmentTableComponent,
    AnnouncementTableComponent,
    AnnouncementFormComponent,
    UserApprovableTableComponent,
 
  ],
})
export class SharedModule {}
