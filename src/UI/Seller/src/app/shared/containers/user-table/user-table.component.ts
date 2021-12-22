import { Component, OnInit, Inject, Input } from '@angular/core';
import {
  OcUserService,
  User,
  ListUser,
  OcUserGroupService,
  ListUserGroupAssignment,
} from '@ordercloud/angular-sdk';
import {
  faTrashAlt,
  faPlusCircle,
  faCircle,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import {
  AppConfig,
  applicationConfiguration,
} from '@app-seller/config/app.config';
import { BaseBrowse } from '@app-seller/shared/models/base-browse.class';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent extends BaseBrowse implements OnInit {
  users: ListUser;
  validUsers:ListUser;
  selectedUser: User;
  faTrash = faTrashAlt;
  faCircle = faCircle;
  faPlusCircle = faPlusCircle;
  faUser = faUser;
  faUsers = faUsers;
  createModalID = 'CreateUserModal';
  editModalID = 'EditUserModal';
  router: any;
  // Default Columns.
  @Input()
  columns = [
    'ID',
    'Username',
    'FirstName',
    'LastName',
    'Email',
    'city',
    'Active',
    'Delete',
    'Assigned',
  ];

  // Only use this when assigning users to user groups.
  @Input()
  userGroupID: string;

  constructor(
    private ocUserService: OcUserService,
    private ocUserGroupService: OcUserGroupService,
    private modalService: ModalService,
    private _router: Router,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {
    // The BaseBrowse super class contains functionality for search, sort, and pagination.
    super();
    this.router = _router.url;
  }

  ngOnInit() {
    this.loadData();
  }

  openCreateModal() {
    this.modalService.open(this.createModalID);
  }

  openEditModal(user: User) {
    this.selectedUser = user;
    this.modalService.open(this.editModalID);
  }

  // Overrides a method in BaseBrowse
  // TODO - I think this observable stuff can be made cleaner with operators
  // loadData(): void {
  //   // this.requestOptions is inherited from BaseBrowse
  //   this.ocUserService
  //     .List(this.appConfig.buyerID, this.requestOptions)
  //     .subscribe((users) => {
  //       setTimeout(() => {
  //         this.users = users;

  //         const newUsers = [];

  //         this.users.Items.forEach((user) => {
  //           if (user.xp.isApproved) {
  //             newUsers.push(user);
  //           }
  //         });

  //         this.users = { ...this.users, Items: newUsers };
  //       }, 1000);

  //       users.Items.forEach((user) => {
  //         if (user.xp.isApproved) {
  //           console.log(user);
  //           if (this.columns.indexOf('Assign') < 0 || !this.userGroupID) {
  //             return (this.users = users);
  //           }
  //           const queue = users.Items.map((curr_user) =>
  //             this.getAssignment(curr_user)
  //           );
  //           forkJoin(queue).subscribe((res: ListUserGroupAssignment[]) => {
  //             res.forEach((group, index) => {
  //               if (group.Items.length === 0) return;
  //               else if (users.Items[index].xp.isApproved) {
  //                 (users.Items[index] as any).Assigned = true;
  //               }
  //             });
  //             this.users = users;
  //           });
  //         }
  //       });
  //     });
  // }
  loadData(): void {
    // this.requestOptions is inherited from BaseBrowse
    this.ocUserService
      .List(this.appConfig.buyerID, this.requestOptions)
      .subscribe((users) => {
        this.validUsers={...users};
        this.validUsers.Items=[];
        users.Items.forEach(element => {
          if(element.xp.isApproved){
           this.validUsers.Items.push(element)
          }
        });
        //console.log("data",this.validUsers)
        if (this.columns.indexOf('Assign') < 0 || !this.userGroupID) {
          return (this.users = this.validUsers);
        }
        const queue = this.validUsers.Items.map((user) => this.getAssignment(user));
        forkJoin(queue).subscribe((res: ListUserGroupAssignment[]) => {
         
          res.forEach((group, index) => {
            if (group.Items.length === 0) return;
            (this.validUsers.Items[index] as any).Assigned = true;
          });
          this.users = this.validUsers;
        });
      });
  }

  getAssignment(user: User) {
    return this.ocUserGroupService.ListUserAssignments(this.appConfig.buyerID, {
      userGroupID: this.userGroupID,
      userID: user.ID,
    });
  }

  assignUser(userID: string, assigned: boolean) {
    const request = assigned
      ? this.ocUserGroupService.SaveUserAssignment(this.appConfig.buyerID, {
          UserID: userID,
          UserGroupID: this.userGroupID,
        })
      : this.ocUserGroupService.DeleteUserAssignment(
          this.appConfig.buyerID,
          this.userGroupID,
          userID
        );
    request.subscribe();
  }

  deleteUser(userID) {
    this.ocUserService.Delete(this.appConfig.buyerID, userID).subscribe(() => {
      this.loadData();
    });
  }

  addUser(user: User) {
    this.modalService.close(this.createModalID);
    this.ocUserService.Create(this.appConfig.buyerID, user).subscribe(() => {
      this.loadData();
    });
  }

  editUser(user: User, prevID: string) {
    this.modalService.close(this.editModalID);
    this.ocUserService
      .Patch(this.appConfig.buyerID, prevID, user)
      .subscribe(() => {
        this.loadData();
      });
  }

  getImpersonationToken(userID: string) {
    this.ocUserService
      .GetAccessToken(this.appConfig.buyerID, userID, {
        ClientID: this.appConfig.buyerClientID,
        Roles: ['FullAccess'],
      })
      .subscribe((res) => {
        window.open(
          `${this.appConfig.buyerUrl}/impersonation?token=${res.access_token}`,
          '_blank'
        );
      });
  }
}
