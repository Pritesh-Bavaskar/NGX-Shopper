import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OcAddressService, OcUserService } from '@ordercloud/angular-sdk';

@Component({
  selector: 'app-address-assignment',
  templateUrl: './address-assignment.component.html',
  styleUrls: ['./address-assignment.component.scss'],
})
export class AddressAssignmentComponent implements OnInit {
  requestOptions: any;
  constructor(
    private ocAddressService: OcAddressService,
    private ocUserService: OcUserService,
    private formBuilder: FormBuilder
  ) {
    this.ocAddressService.ListAssignments;
  }
  @Input()
  btnText: string;
  userId: string;
  addressIdarr: any;
  userIdarr: any;
  AddressAssignmentForm: FormGroup;
  AddressAssignmentArr: any[];
  @Output()
  AddressAssignedFormSubmitted = new EventEmitter();
  ngOnInit() {
    this.loadData();
    this.setForm();
  }

  loadData(): void {
    this.ocAddressService
      .Get('BUYER_ORGANIZATION', '')
      .subscribe((res: any) => {
        this.addressIdarr = res.Items;
        console.log(res.Items);
      });
    this.ocUserService.Get('BUYER_ORGANIZATION', '').subscribe((res: any) => {
      this.userIdarr = res.Items;
      console.log(res.Items);
    });
  }

  setForm() {
    this.AddressAssignmentForm = this.formBuilder.group({
      AddressID: [''],
      UserID: [''],
      IsShipping: ['' || false],
      IsBilling: ['' || false],
    });
  }

  onSubmit() {
    if (this.AddressAssignmentForm.valid) {
      // console.log('from form', this.AddressAssignmentForm.value);
      this.AddressAssignmentArr = {

        ...this.AddressAssignmentForm.value
      }

      this.AddressAssignedFormSubmitted.emit(this.AddressAssignmentArr);
    }
  }
}
