import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {  OcPriceScheduleService } from '@ordercloud/angular-sdk';
import { PriceSchedule } from '@ordercloud/angular-sdk';
import {
  ListUserGroup,
  OcUserGroupService,
  UserGroup,
} from '@ordercloud/angular-sdk';
import { RegexService } from '@app-seller/shared/services/regex/regex.service';
import { AppFormErrorService } from '@app-seller/shared/services/form-error/form-error.service';


@Component({
  selector: 'app-product-assignment-form',
  templateUrl: './product-assignment-form.component.html',
  styleUrls: ['./product-assignment-form.component.scss']
})
export class ProductAssignmentFormComponent implements OnInit {
  @Input()
  btnText: string;
  @Output()
  formSubmitted = new EventEmitter();
  productAssignementForm: FormGroup;
  priceScheduls:any
  _existingPriceSchedule:any = "";
  userGroups:any
  existingUserGroup:any = "";

  constructor(
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService,
    private regexService: RegexService,
    private ocPriceScheduleService: OcPriceScheduleService,
     private ocUserGroupService: OcUserGroupService,
) { }

  ngOnInit() {
    this.ocPriceScheduleService.List().subscribe(res =>{
        this.priceScheduls = res.Items
    })
    this.ocUserGroupService.List("BUYER_ORGANIZATION").subscribe((x) => (
        this.userGroups = x.Items
      ));
    this.setForm();
  }

  setForm() {
    this.productAssignementForm = this.formBuilder.group({
      priceSchedule: [this._existingPriceSchedule.PriceScheduleID || '',
        [Validators.required],
      ],
      usergroup: [this._existingPriceSchedule.UserGroupID || '',
        [Validators.required],
      ],
    });
  }

  protected onSubmit() {
    // console.log('here')
    if (this.productAssignementForm.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.productAssignementForm);
    }
    
    let productAssignment;

      productAssignment = {
      
      PriceScheduleID:this.productAssignementForm.value.priceSchedule,
      UserGroupID:this.productAssignementForm.value.usergroup,
      };
 
    this.formSubmitted.emit(productAssignment);
  }
   // control display of error messages
  protected hasRequiredError = (controlName: string) =>
    this.formErrorService.hasRequiredError(controlName, this.productAssignementForm);
  protected hasPatternError = (controlName: string) =>
    this.formErrorService.hasPatternError(controlName, this.productAssignementForm);

}
