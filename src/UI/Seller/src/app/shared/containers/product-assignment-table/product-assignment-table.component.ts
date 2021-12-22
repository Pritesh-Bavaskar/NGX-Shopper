import { Component, OnInit, Input, Inject } from '@angular/core';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import { forkJoin, Observable } from 'rxjs';
import { BaseBrowse } from '@app-seller/shared/models/base-browse.class';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-seller/config/app.config';
import { faCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ToastrService } from 'ngx-toastr';

import {
  ListBuyerProduct,
  OcProductService,
  Product,
  ProductAssignment,
  OcCategoryService,
  ListProductAssignment,
  ListCategoryProductAssignment,
} from '@ordercloud/angular-sdk';
@Component({
  selector: 'app-product-assignment-table',
  templateUrl: './product-assignment-table.component.html',
  styleUrls: ['./product-assignment-table.component.scss']
})
export class ProductAssignmentTableComponent extends BaseBrowse implements OnInit {
  modalID = 'NewProductAssignmentModal';
  @Input()
  faTrash = faTrashAlt;
  columns = ['ProductID', 'PriceScheduleID', 'UserGroupID','Delete'];
  @Input() productID;
  productAssignments:any
  faPlusCircle = faPlusCircle;
  constructor(
    private modalService: ModalService,
    private ocProductService: OcProductService,
    private toasterService: ToastrService,
    @Inject(applicationConfiguration) private appConfig: AppConfig

    ) {
      super();
     }

  ngOnInit() {
      this.loadData();
  }
   loadData() {
    this.ocProductService.ListAssignments({productID:this.productID}).subscribe(res=>{
        this.productAssignments = res
    });
  }

   openNewProductAssignmentModal() {
    this.modalService.open(this.modalID);
  }
    addProductAssignment(productAssignement:ProductAssignment){
    productAssignement.BuyerID = "BUYER_ORGANIZATION"
    productAssignement.ProductID = this.productID
    this.ocProductService.SaveAssignment(productAssignement).subscribe(res=>{
      this.toasterService.success('Product Assinment saved successfully', 'Success');
      this.loadData();
      this.modalService.close(this.modalID);
    },err=>{
      this.toasterService.error('Some error occured', 'Error');
    })
  }
  deleteProductAssignment(product:ProductAssignment){


    this.ocProductService.DeleteAssignment(product.ProductID,product.BuyerID,{userGroupID:product.UserGroupID}).subscribe((res)=>{
      this.loadData();
    })

  }

}
