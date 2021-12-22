import { Component, AfterViewInit, Input } from '@angular/core';
import { OrderStatus } from '@app-buyer/order/models/order-status.model';
import { OcMeService, ListOrder, OcUserGroupService, OcOrderService } from '@ordercloud/angular-sdk';
import { MeOrderListOptions } from '@app-buyer/order/models/me-order-list-options';
import { Observable } from 'rxjs';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { flatMap,pluck } from 'rxjs/operators';
import { FavoriteOrdersService } from '@app-buyer/shared/services/favorites/favorites.service';

@Component({
  selector: 'order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})

export class OrderHistoryComponent implements AfterViewInit {
  alive = true;
  columns: string[] = ['ID', 'Status', 'DateSubmitted', 'Total'];
  orders$: Observable<ListOrder>;
  allOrders$: Observable<ListOrder>;
  hasFavoriteOrdersFilter = false;
  sortBy: string;
  isAssignToAdmin:boolean = false
  assignedIDs:any = []
  userID:any
  @Input() approvalVersion: boolean;

  constructor(
    private ocMeService: OcMeService,
    private ocOrderService: OcOrderService,

    private router: Router,
    private ocUserGroupService : OcUserGroupService,
    private activatedRoute: ActivatedRoute,
    private favoriteOrdersService: FavoriteOrdersService
  ) {}

  ngAfterViewInit(): void {

    this.getUserId()
    setTimeout(()=>{
      this.getData()
    },2000)
    
    this.allOrders$ = this.getAllOrders()
    console.log(this.allOrders$)
    if (!this.approvalVersion) {
      this.columns.push('Favorite');
    }
    this.orders$ = this.listOrders();
  }

  public sortOrders(sortBy: string): void {
    this.addQueryParam({ sortBy });
  }

  public changePage(page: number): void {
    this.addQueryParam({ page });
  }

  public filterBySearch(search: string): void {
    this.addQueryParam({ search, page: undefined });
  }

  public filterByStatus(status: OrderStatus): void {
    this.addQueryParam({ status });
  }

  public filterByDate(datesubmitted: string[]): void {
    this.addQueryParam({ datesubmitted });
  }

  private addQueryParam(newParam: object): void {
    const queryParams = {
      ...this.activatedRoute.snapshot.queryParams,
      ...newParam,
    };
    this.router.navigate([], { queryParams });
  }

  public filterByFavorite(favoriteOrders: boolean): void {
    if (favoriteOrders) {
      this.addQueryParam({ favoriteOrders: true });
    } else {
      // set to undefined so we dont pollute url with unnecessary query params
      this.addQueryParam({ favoriteOrders: undefined });
    }
  }

  protected listOrders(): Observable<ListOrder> {
    return this.activatedRoute.queryParamMap.pipe(
      flatMap((queryParamMap) => {
        this.sortBy = queryParamMap.get('sortBy');
        // we set param values to undefined so the sdk ignores them (dont show in headers)
        const listOptions: MeOrderListOptions = {
          sortBy: this.sortBy || undefined,
          search: queryParamMap.get('search') || undefined,
          page: parseInt(queryParamMap.get('page'), 10) || undefined,
          filters: {
            ID: this.buildFavoriteOrdersQuery(queryParamMap),
            status:
              queryParamMap.get('status') || `!${OrderStatus.Unsubmitted}`,
            datesubmitted: queryParamMap.getAll('datesubmitted') || undefined,
          },
        };
        return this.approvalVersion
          ? this.ocMeService.ListApprovableOrders(listOptions)
          : this.ocMeService.ListOrders(listOptions);
      })
    );
  }
    getAllOrders(): Observable<ListOrder>{

       return this.activatedRoute.queryParamMap.pipe(
      flatMap((queryParamMap) => {
        this.sortBy = queryParamMap.get('sortBy');
        // we set param values to undefined so the sdk ignores them (dont show in headers)
        const listOptions: MeOrderListOptions = {
          sortBy: this.sortBy || undefined,
          search: queryParamMap.get('search') || undefined,
          page: parseInt(queryParamMap.get('page'), 10) || undefined,
          filters: {
            ID: this.buildFavoriteOrdersQuery(queryParamMap),
            status:
              queryParamMap.get('status') || `!${OrderStatus.Unsubmitted}`,
            datesubmitted: queryParamMap.getAll('datesubmitted') || undefined,
          },
        };
        return this.ocOrderService.List("All",listOptions)
      
      })
    );
      
  }
    getUserAssignment() {
    return this.ocUserGroupService.ListUserAssignments("BUYER_ORGANIZATION", {
      userID: this.userID,
    });
  }

  getData() {
    this.assignedIDs = [];
    this.getUserAssignment()
      .pipe(pluck('Items'))
      .subscribe((res: any) => {
        res.forEach((res1) => {
          this.assignedIDs.push(res1.UserGroupID);
          // console.log(res1.UserGroupID)
        });
      });
      setTimeout(()=>{
         this.assignedIDs.forEach((res) => {
          if(res == "USER_GROUP_ADMIN"){
            this.isAssignToAdmin = true
          }
        
        })
      },1000)
     
  }
 private getUserId() {
    this.ocMeService.Get().subscribe((me) => {
       //console.log(me.ID)
      this.userID = me.ID;
    });
  }

downloadCsv(type:any){

  if(type == 1 || type == 3){
    this.listOrders().subscribe(res=>{
      let op=[];
      for(var i=0;i<res.Items.length;i++)
      {
        for (var key in res.Items[i]) {
          op.push(key)
       }
      }
       console.log(res.Items)
       var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'Report Data',
      useBom: true,
      // noDownload: true,
      headers: op
    };
 
  new ngxCsv(res.Items, "Report", options);
      
    })
  }else if(type == 2 ){
    this.getAllOrders().subscribe(res=>{
      let op=[];
      for(var i=0;i<res.Items.length;i++)
      {
        for (var key in res.Items[i]) {
          op.push(key)
       }
      }
       console.log(res.Items)
       var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'Report Data',
      useBom: true,
      // noDownload: true,
      headers: op
    };
 
  new ngxCsv(res.Items, "Report", options);
      
    })
  }
  
  
  
}


  private buildFavoriteOrdersQuery(
    queryParamMap: ParamMap
  ): string | undefined {
    this.hasFavoriteOrdersFilter =
      queryParamMap.get('favoriteOrders') === 'true';
    const favorites = this.favoriteOrdersService.getFavorites();
    return this.hasFavoriteOrdersFilter && favorites && favorites.length
      ? favorites.join('|')
      : undefined;
  }
}
