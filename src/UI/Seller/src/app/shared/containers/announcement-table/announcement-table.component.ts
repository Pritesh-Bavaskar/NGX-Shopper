import { Component, OnInit, Input, Inject } from '@angular/core';
import { OcBuyerService } from '@ordercloud/angular-sdk';
import { BaseBrowse } from '@app-seller/shared/models/base-browse.class';
import { forkJoin, Observable } from 'rxjs';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-seller/config/app.config';
import { faCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import { PriceSchedule } from '@ordercloud/angular-sdk';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-announcement-table',
  templateUrl: './announcement-table.component.html',
  styleUrls: ['./announcement-table.component.scss'],
})
export class AnnouncementTableComponent extends BaseBrowse implements OnInit {
  columns = ['Title', 'Order', 'Delete'];
  announcements: any;
  announcementsData: any = [];
  faTrash = faTrashAlt;
  faCircle = faCircle;
  modalID = 'NewAnnouncementModal';
  editModalID = 'EditAnnouncementModal';
  faPlusCircle = faPlusCircle;
  selectedAnnoucement:any;
  constructor(
    private ocBuyerService: OcBuyerService,
    private toasterService: ToastrService,
    @Inject(applicationConfiguration) private appConfig: AppConfig,
    private modalService: ModalService
  ) {
    super();
  }

  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.ocBuyerService.Get(this.appConfig.buyerID).subscribe((x) => {
      this.announcements = x.xp.Announcement;
    });
  }
  openNewAnnouncementModal() {
    this.modalService.open(this.modalID);
  }

  addAnnouncement(announcement: any) {
    
    this.ocBuyerService.Get(this.appConfig.buyerID).subscribe((x) => {
      this.announcementsData = x.xp.Announcement;

      this.announcementsData.push(announcement);
     
    });
    setTimeout(() => {
      const partialBuyer = {
        xp: { Announcement: this.announcementsData },
      };
      this.ocBuyerService
        .Patch(this.appConfig.buyerID, partialBuyer)
        .subscribe((x) => {
          this.modalService.close(this.modalID);
          this.loadData();
          this.toasterService.success('Announcement Added Succesfully')
        });
    }, 1000);
  }

  openEditModal(announcement:any){
    this.selectedAnnoucement = announcement;
    this.modalService.open(this.editModalID);
    
  }

  EditAnnoucement(annoucement:any,id:any){

    // console.log(annoucement)
    // console.log(id)
    this.ocBuyerService.Get(this.appConfig.buyerID).subscribe((x) => {
      let newAnnoucementArray = [];
      console.log(x)

      x.xp.Announcement.forEach((element) => {
      
       // console.log(element);
        if (element.ID == id) {
         element.Title=annoucement.Title
         element.Order=annoucement.Order
         element.StartDate=annoucement.StartDate
         element.EndDate=annoucement.EndDate
         element.userGroups=annoucement.userGroups
        }
        newAnnoucementArray.push(element)
      });

      setTimeout(() => {
        const partialBuyer = {
          xp: { Announcement: newAnnoucementArray },
        };
        this.ocBuyerService
          .Patch(this.appConfig.buyerID, partialBuyer)
          .subscribe((x) => {
            this.modalService.close(this.editModalID);
            this.loadData();
            this.toasterService.success('Announcement Edited Succesfully')
          });
      }, 1000);
    });

  }

  deleteAnnoucement(id: any) {
    this.ocBuyerService.Get(this.appConfig.buyerID).subscribe((x) => {
      let newAnnoucementArray = [];

      x.xp.Announcement.forEach((element) => {
       // console.log(element);
        if (element.ID != id) {
          newAnnoucementArray.push(element);
        }
      });

      setTimeout(() => {
        const partialBuyer = {
          xp: { Announcement: newAnnoucementArray },
        };
        this.ocBuyerService
          .Patch(this.appConfig.buyerID, partialBuyer)
          .subscribe((x) => {
            // this.modalService.close(this.modalID);
            this.loadData();
            this.toasterService.success('Announcement Deleted Succesfully')
          });
      }, 1000);
    });
  }
}
