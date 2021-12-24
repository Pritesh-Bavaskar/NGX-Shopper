import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OcAddressService, OcCategoryService } from '@ordercloud/angular-sdk';
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
  selector: 'app-user-table-showgroups',
  templateUrl: './user-table-showgroups.component.html',
  styleUrls: ['./user-table-showgroups.component.scss'],
})
export class UserTableShowgroupsComponent extends BaseBrowse implements OnInit {
  userId: string;
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
    private activatedRoute: ActivatedRoute,
    private ocAddressService: OcAddressService
  ) {
    super();
    this.ocAddressService.ListAssignments;
    this.userId = this.activatedRoute.snapshot.params['userId'];
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    const userIDData = {
      ...this.requestOptions,
      userID: this.userId,
    };
    this.ocAddressService
      .ListAssignments('BUYER_ORGANIZATION', userIDData)
      .subscribe((res) => {
        console.log(res);
        this.categories = res;
        let newcategoryItems = [];
      });
  }
}
