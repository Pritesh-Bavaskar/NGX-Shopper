import { Component, OnInit } from '@angular/core';

import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import {
  OcMeService,
  ListBuyerAddress,
  BuyerAddress,
} from '@ordercloud/angular-sdk';
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons';
import { ModalService } from '@app-buyer/shared';

@Component({
  selector: 'profile-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss'],
})
export class AddressListComponent implements OnInit {
  faPlus = faPlus;
  faArrowLeft = faArrowLeft;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  addresses: ListBuyerAddress;
  currentAddress: BuyerAddress;
  requestOptions: { page?: number; search?: string } = {
    page: undefined,
    search: undefined,
  };
  resultsPerPage = 8;
  addAddressModalID = 'add-profile-address';
  areYouSureModalID = 'are-you-sure-address';
  isDefault: boolean;
  defAddr: string

  constructor(
    private ocMeService: OcMeService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.reloadAddresses();
    // const me={
    //   xp:{defaultAddressID:""}
    // }
    // this.ocMeService.Patch(me).subscribe(res=>{
    //   console.log(res)
    // })
    this.getDefaultAddress()

  }

  public showAddAddress() {
    this.currentAddress = null;
    this.modalService.open(this.addAddressModalID);
  }

  public showEditAddress(address: BuyerAddress) {
    this.currentAddress = address;
    this.modalService.open(this.addAddressModalID);
  }

  public showAreYouSure(address: BuyerAddress) {
    this.currentAddress = address;
    this.modalService.open(this.areYouSureModalID);
  }

  public closeAreYouSure() {
    this.currentAddress = null;
    this.modalService.close(this.areYouSureModalID);
  }

  protected refresh() {
    this.currentAddress = null;
    this.getDefaultAddress()
    this.reloadAddresses();
  }

  public addressFormSubmitted(address: BuyerAddress) {
    this.modalService.close(this.addAddressModalID);
    if (this.currentAddress) {
      this.updateAddress(address);
    } else {
      this.addAddress(address);
    }
  }

  private addAddress(address: any) {
    address.Shipping = true;
    address.Billing = true;



    this.ocMeService.CreateAddress(address).subscribe(
      (res) => {
        this.refresh();
        if (address.isDefault) {
          const me = {
            xp: { defaultAddressID: res.ID }
          }
          this.ocMeService.Patch(me).subscribe(res => {
            console.log(res)
          })
        }
      },
      (error) => {
        throw error;
      }
    );
  }

  private updateAddress(address: any) {
    address.ID = this.currentAddress.ID;
    this.isDefault = address.isDefault

    if (this.isDefault) {
      const me = {
        xp: { defaultAddressID: address.ID }
      }
      this.ocMeService.Patch(me).subscribe(res => {
      })
      this.ocMeService.PatchAddress(address.ID, address).subscribe(
        () => {
          this.refresh();
        },
        (error) => {
          throw error;
        }
      );
    } else {
      this.ocMeService.PatchAddress(address.ID, address).subscribe(
        () => {
          this.refresh();
        },
        (error) => {
          throw error;
        }
      );
    }

  }

  public deleteAddress(address: BuyerAddress) {
    this.ocMeService.DeleteAddress(address.ID).subscribe(
      () => {
        this.closeAreYouSure();
        this.reloadAddresses();
      },
      (error) => {
        throw error;
      }
    );
  }

  public updateRequestOptions(newOptions: { page?: number; search?: string }) {
    this.requestOptions = Object.assign(this.requestOptions, newOptions);
    this.reloadAddresses();
  }

  private reloadAddresses() {

    this.ocMeService
      .ListAddresses({ ...this.requestOptions, pageSize: this.resultsPerPage })
      .subscribe((res) => {
        this.addresses = res
        //console.log(res)

      });
  }

  getDefaultAddress() {
    this.ocMeService.Get().subscribe(res => {
      //console.log(res)
      this.defAddr = res.xp.defaultAddressID;
      // this.ocMeService.ListAddresses().subscribe(res1=>{
      // //  console.log(res1)
      //   res1.Items.forEach(element => {
      //     if(element.ID==res.xp.defaultAddressID){
      //       this.isDefault=true
      //     }
      //   });

      // })
    })
  }
}
