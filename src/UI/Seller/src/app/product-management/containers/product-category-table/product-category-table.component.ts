import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OcCategoryService } from '@ordercloud/angular-sdk';
import { faCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { BaseBrowse } from '@app-seller/shared/models/base-browse.class';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import { forkJoin, Observable } from 'rxjs';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-seller/config/app.config';

@Component({
  selector: 'app-product-category-table',
  templateUrl: './product-category-table.component.html',
  styleUrls: ['./product-category-table.component.scss'],
})
export class ProductCategoryTableComponent extends BaseBrowse
  implements OnInit {
  productID: string;
  categories: any;
  columns = ['ID', 'Name', 'Active', 'Delete'];
  faTrash = faTrashAlt;
  faCircle = faCircle;
  faPlusCircle = faPlusCircle;
  id: any;
  prodCategoryIds: any = [];
  

  constructor(
    private router: Router,
    private ocCategoryService: OcCategoryService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.productID = this.activatedRoute.snapshot.params['productID'];
  }

  ngOnInit() {
    // this.getProductCategories();
    this.getAssignments();
    setTimeout(() => {
      this.loadData();
    }, 1000);
  }

  getAssignments() {
    this.id = {
      productID: this.productID,
    };

    this.ocCategoryService
      .ListProductAssignments('BUYER_ORGANIZATION', this.id)
      .subscribe((res) => {
        res.Items.forEach((element) => {
          this.prodCategoryIds.push(element.CategoryID);
        });
      });
  }

  loadData(): void {
    this.ocCategoryService
      .List('BUYER_ORGANIZATION', this.requestOptions)
      .subscribe((res) => {
        // console.log(res)
        this.categories = res;
        let newcategoryItems=[]

        setTimeout(() => {
          this.categories.Items.forEach((element) => {
            console.log(element)
            this.prodCategoryIds.forEach((id) => {
              if (element.ID == id) {
                newcategoryItems.push(element);
              }
            });
          });
          this.categories = {
            ...this.categories,
            Items: newcategoryItems,
          };
          console.log(this.categories);
        }, 1000);
      });
  }
}
