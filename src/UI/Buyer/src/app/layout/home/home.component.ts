import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  OcMeService,
  ListBuyerProduct,
  OcBuyerService,
  Buyer,
  OcUserGroupService,
} from '@ordercloud/angular-sdk';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'layout-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  featuredProducts$: Observable<ListBuyerProduct>;
  buyerOrg$: Observable<Buyer>;
  faBullhorn = faBullhorn;
  sortedAnnouncements:any
  assignedIDs:any = []
  userID:any
  constructor(
    private config: NgbCarouselConfig,
    private ocMeService: OcMeService,
    private ocUserGroupService : OcUserGroupService,

    private ocBuyerService: OcBuyerService,

  ) {}

  ngOnInit() {
    this.config.interval = 5000;
    this.config.wrap = true;
    this.featuredProducts$ = this.ocMeService.ListProducts({
      filters: <any>{ 'xp.Featured': true },
    });
    this.getUserId()
    setTimeout(()=>{
    this.getSortedAnnouncements()

    },1000)
  }

  GetBuyerOrg(): Observable<Buyer> {
    // In a buyer context, listing buyers will return only one buyer organization, your own.
    return this.ocBuyerService.List().pipe(map((list) => list.Items[0]));
  }

  getUserAssignment() {
    return this.ocUserGroupService.ListUserAssignments("BUYER_ORGANIZATION", {
      userID: this.userID,
    });
  }
   private getUserId() {
    this.ocMeService.Get().subscribe((me) => {
      
      this.userID = me.ID;
    });
  }

  getSortedAnnouncements(){
    let currentDate = new Date();
    this.assignedIDs = [];
   
    this.getUserAssignment()
      .pipe(pluck('Items'))
      .subscribe((res: any) => {
        res.forEach((res1) => {
          this.assignedIDs.push(res1.UserGroupID);
        });
      });


      setTimeout(()=>{
      this.GetBuyerOrg().subscribe(res=>{
    
      let announcementArray = [];

      res.xp.Announcement.forEach(res=>{
    


        if(res.userGroups.length > 0){
          for (let i = 0; i < this.assignedIDs.length; i++) {
            

          for(let j = 0; j < res.userGroups.length; j++){
          
             if (res.userGroups[j].ID === this.assignedIDs[i]) {
                if(announcementArray.indexOf(res) == -1){
      

                  announcementArray.push(res)
                }
              }
          }
        } 
        }else{
                  announcementArray.push(res)
        }
      
      })
      let announcementDisplayArray = [];
    
      announcementArray.forEach(res=>{

          let startDate = new Date(res.StartDate)
          let endDate = new Date(res.EndDate)
          
          if(currentDate > startDate && currentDate < endDate){
            announcementDisplayArray.push(res)
          }else{

          }

          if(currentDate.toISOString().slice(0, 10) === startDate.toISOString().slice(0, 10) && currentDate.toISOString().slice(0, 10) === endDate.toISOString().slice(0, 10)){
            announcementDisplayArray.push(res)
            
          }
          
      })
      this.sortedAnnouncements = announcementDisplayArray

      this.sortedAnnouncements.sort((a, b) => {
          return a.Order - b.Order;
      });

    })
    },2000)
    
  }}
