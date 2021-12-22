import { Component, OnInit } from '@angular/core';
import { OcPriceScheduleService } from '@ordercloud/angular-sdk';
import { BaseBrowse } from '@app-seller/shared/models/base-browse.class';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import { faCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { PriceSchedule } from '@ordercloud/angular-sdk';

@Component({
  selector: 'app-price-scheduler-table',
  templateUrl: './price-scheduler-table.component.html',
  styleUrls: ['./price-scheduler-table.component.scss'],
})
export class PriceSchedulerTableComponent extends BaseBrowse implements OnInit {
  columns = ['ID', 'Name', 'MaxQuantity', 'MinQuantity', 'Delete'];
  priceSchedulerList: any;
  modalID = 'NewPriceSchedulerModal';
  editModalID = 'EditPriceSchedulerModal';
  faPlusCircle = faPlusCircle;
  faTrash = faTrashAlt;
  selectedPriceSchedule: PriceSchedule;

  constructor(
    private ocPriceScheduleService: OcPriceScheduleService,
    private modalService: ModalService,
    private toasterService: ToastrService
  ) {
    super();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.ocPriceScheduleService.List(this.requestOptions).subscribe((res) => {
      console.log(res);
      this.priceSchedulerList = res;
    });
  }

  openNewProductModal() {
    this.modalService.open(this.modalID);
  }

  deletePriceScheduler(priceSchedulerID) {
    this.ocPriceScheduleService.Delete(priceSchedulerID).subscribe((res) => {
      this.toasterService.error('Succesfully', 'Price Schedule Deleted');
      this.loadData();
    });
  }

  addPriceSchedule(priceSchedule: PriceSchedule) {
   
    this.modalService.close(this.modalID);
    this.ocPriceScheduleService.Create(priceSchedule).subscribe(() => {
      this.loadData();
    });
  }

  openEditModal(priceSchedule1: PriceSchedule) {
    this.selectedPriceSchedule = priceSchedule1;
    this.modalService.open(this.editModalID);
  }

  editPriceSchedule(priceSchedule1: PriceSchedule, prevID: string) {
    this.modalService.close(this.editModalID);
    this.ocPriceScheduleService.Patch(prevID, priceSchedule1).subscribe(() => {
      this.loadData();
    });
  }
}
