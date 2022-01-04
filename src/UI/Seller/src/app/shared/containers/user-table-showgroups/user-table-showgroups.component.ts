import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AddressAssignment,
  OcAddressService,
  OcCategoryService,
} from '@ordercloud/angular-sdk';
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
  columns = ['AddressID', 'UserID', 'IsShipping', 'IsBilling'];
  faTrash = faTrashAlt;
  faCircle = faCircle;
  faPlusCircle = faPlusCircle;
  id: any;
  prodCategoryIds: any = [];
  modalID = 'NewAddressAssignmentModal';

  constructor(
    private router: Router,
    private ocCategoryService: OcCategoryService,
    private activatedRoute: ActivatedRoute,
    private ocAddressService: OcAddressService,
    private modalService: ModalService
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
        // console.log(res);
        this.categories = res;
        // let newcategoryItems = [];
      });
  }

  openNewAddressAssignmentModal() {
    this.modalService.open(this.modalID);
  }

  addAddressAssigned(addressAssignment: AddressAssignment) {
    // console.log('addAddressAssigned method called');
    this.modalService.close(this.modalID);
    console.log(addressAssignment);
    this.ocAddressService
      .SaveAssignment('BUYER_ORGANIZATION', addressAssignment)
      .subscribe(() => {
        this.loadData();
      });
  }
}
