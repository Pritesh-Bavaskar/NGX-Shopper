import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-seller/config/app.config';
import { faBoxOpen, faImage } from '@fortawesome/free-solid-svg-icons';

import { OcUserGroupService } from '@ordercloud/angular-sdk';

import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-assigned-groups',
  templateUrl: './assigned-groups.component.html',
  styleUrls: ['./assigned-groups.component.scss'],
})
export class AssignedGroupsComponent implements OnInit {
  @Input()
  userAssignedGroups: any;
  activatedRoute: ActivatedRoute;
  userID: string;
  assignedIDs: any = [];
  asssignedGroups: any = [];
  faBoxOpen = faBoxOpen;
  faImage = faImage;

  constructor(
    private route: ActivatedRoute,
    private ocUserGroupService: OcUserGroupService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {
    this.userID = this.route.snapshot.params['userId'];
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.assignedIDs = [];
    this.getUserAssignment()
      .pipe(pluck('Items'))
      .subscribe((res: any) => {
        res.forEach((res1) => {
          this.assignedIDs.push(res1.UserGroupID);
        });
      });
  }

  getUserAssignment() {
    return this.ocUserGroupService.ListUserAssignments(this.appConfig.buyerID, {
      userID: this.userID,
    });
  }
}
