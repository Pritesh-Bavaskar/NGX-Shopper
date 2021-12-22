import { Component, OnInit } from '@angular/core';
import { ProfileTab } from '@app-buyer/profile/models/profile-tabs.enum';
import { AppAuthService } from '@app-buyer/auth';
import { OcUserGroupService, OcMeService, OcOrderService } from '@ordercloud/angular-sdk';
import { pluck } from 'rxjs/operators';
@Component({
  selector: 'profile-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  selectedTab: string;
  tabs: ProfileTab[];
  assignedIDs: any = [];
  UserID: string;
  isAdmin: boolean = false;


  constructor(private appAuthService: AppAuthService,
    private ocUserGroupService: OcUserGroupService,
    private ocMeService: OcMeService,
    private ocOrderService: OcOrderService,) {
    this.tabs = [
      { display: 'Details', route: ['/profile', 'details'] },
      { display: 'Addresses', route: ['/profile', 'addresses'] },
      { display: 'Payment Methods', route: ['/profile', 'payment-methods'] },
      { display: 'My Orders', route: ['/profile', 'orders'] },
      //{ display: 'Buyer Users', route: ['/profile', 'users'] },
    
    ];
  }

  ngOnInit(): void {
    this.selectTab(this.tabs[0]);
    this.getUserID();
    setTimeout(() => {
      this.getData();
    }, 1000);
    
  }

  selectTab(tab: ProfileTab): void {
    this.selectedTab = tab.display;
  }

  logout() {
    this.appAuthService.logout();
  }

  getUserAssignment() {
    return this.ocUserGroupService.ListUserAssignments('BUYER_ORGANIZATION', {
      userID: this.UserID,
    });
  }

  getData() {
    this.assignedIDs = [];
    this.getUserAssignment()
      .pipe(pluck('Items'))
      .subscribe((res: any) => {
        res.forEach((res1) => {
          this.assignedIDs.push(res1.UserGroupID);
          //console.log(res1.UserGroupID)
        });
      });

    setTimeout(() => {
      this.assignedIDs.forEach((element) => {
        //console.log(element)
        if (element == 'APPROVAL_USER_GROUP') {
          this.isAdmin = true;
          this.tabs.push({
            display: 'Orders To Approve',
            route: ['/profile', 'orders', 'approval'],
          })
        }
      });
    }, 1000);
    setTimeout(() => {
      this.assignedIDs.forEach((element) => {
        //console.log(element)
        if (element == 'USER_GROUP_ADMIN') {
          this.isAdmin = true;
          this.tabs.push({
            display: 'Buyer Users',
            route: ['/profile', 'users'],
          })
        }
      });
    }, 1000);


    
  }


  private getUserID() {
    this.ocMeService.Get().subscribe((me) => {
      this.UserID = me.ID;
    });
  }
}
