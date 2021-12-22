import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-seller/config/app.config';
import { ListUserGroup, OcUserGroupService } from '@ordercloud/angular-sdk';

import { BaseBrowse } from '@app-seller/shared/models/base-browse.class';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assigned-groups-table',
  templateUrl: './assigned-groups-table.component.html',
  styleUrls: ['./assigned-groups-table.component.scss'],
})
export class AssignedGroupsTableComponent extends BaseBrowse implements OnInit {
  @Input() userAssignedGroups: any;
  usergroups: ListUserGroup;
  activatedRoute: ActivatedRoute;
  userID: string;
  @Output('refreshIDs') refreshIDs: EventEmitter<any> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private ocUserGroupService: OcUserGroupService,
    private toasterService: ToastrService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {
    super();
    this.userID = this.route.snapshot.params['userId'];
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    this.ocUserGroupService
      .List(this.appConfig.buyerID, this.requestOptions)
      .subscribe((x) => {
        setTimeout(() => {
          this.usergroups = x;

          const newUserGroupItems = [];
          
          this.usergroups.Items.forEach(item => {
            this.userAssignedGroups.forEach(id => {
              if(item.ID==id){
                newUserGroupItems.push(item);
              }
            });
          });

          this.usergroups = { ...this.usergroups, Items: newUserGroupItems };
        }, 1000);
      });
  }

  assignUser(groupID: string, assigned: boolean) {
    const request = assigned
      ? this.ocUserGroupService.SaveUserAssignment(this.appConfig.buyerID, {
          UserID: this.userID,
          UserGroupID: groupID,
        })
      : this.ocUserGroupService.DeleteUserAssignment(
          this.appConfig.buyerID,
          groupID,
          this.userID
        );
    request.subscribe(() => {
      this.refreshIDs.emit();
      this.toasterService.success(
        'User Group unassigned successfully',
        'Success'
      );
      this.loadData();
    });
  }

}
