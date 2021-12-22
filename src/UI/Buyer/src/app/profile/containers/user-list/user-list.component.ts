import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  Inject,
} from '@angular/core';
import {
  ListOrder,
  ListUser,
  OcMeService,
  OcUserService,
} from '@ordercloud/angular-sdk';
import { OrderListColumn } from '@app-buyer/order/models/order-list-column';
import {
  faCaretDown,
  faCaretUp,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FavoriteOrdersService } from '@app-buyer/shared/services/favorites/favorites.service';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  @Input() users: ListUser;
  @Input() columns: any;
  @Input() sortBy: string;
  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;
  faCircle = faCircle;
  UserID:string;
  @Output() updatedSort = new EventEmitter<string>();
  @Output() changedPage = new EventEmitter<number>();

  columnNames: string[] = [];

  constructor(
    private ocMeService: OcMeService,
    private ocUserService: OcUserService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.columnNames = Object.values(this.columns);
  }

  public updateSort(selectedSortBy) {
    let sortBy;
    switch (this.sortBy) {
      case selectedSortBy:
        sortBy = `!${selectedSortBy}`;
        break;
      case `!${selectedSortBy}`:
        // setting to undefined so sdk ignores parameter
        sortBy = undefined;
        break;
      default:
        sortBy = selectedSortBy;
    }
    this.updatedSort.emit(sortBy);
  }

  public changePage(page: number): void {
    this.changedPage.emit(page);
  }

  impersonate(userID: any) {
    console.log(userID);
    this.ocUserService
      .GetAccessToken('BUYER_ORGANIZATION', userID, {
        ClientID: '8FA0872D-9EEE-4DB4-AEA3-E72B7B191157',
        Roles: ['FullAccess'],
      })
      .subscribe((res) => {
        localStorage.setItem("key",'')
        this.getUserID();
        window.open(
          `localhost:4200/impersonation?token=${res.access_token}`,
          '_blank'
        );
      });
  }

  private getUserID() {
    this.ocMeService.Get().subscribe((me) => {
      localStorage.setItem("key",me.ID)
      this.UserID = me.ID;
    });
  }
}
