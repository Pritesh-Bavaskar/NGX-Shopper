import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OcPriceScheduleService, Product } from '@ordercloud/angular-sdk';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppFormErrorService } from '@app-seller/shared/services/form-error/form-error.service';
import { RegexService } from '@app-seller/shared/services/regex/regex.service';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  private _existingProduct: Product = {};
  @Input()
  btnText: string;
  @Output()
  formSubmitted = new EventEmitter();
  productForm: FormGroup;
  priceScheduls: any;

  constructor(
    private ocPriceScheduleService: OcPriceScheduleService,
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService,
    private regexService: RegexService
  ) {}

  ngOnInit() {
    this.ocPriceScheduleService.List().subscribe((res) => {
      this.priceScheduls = res.Items;
    });
    this.setForm();
  }

  @Input()
  set existingProduct(product: Product) {
    this._existingProduct = product || {};
    if (!this.productForm) {
      this.setForm();
      return;
    }
    this.productForm.setValue({
      ID: this._existingProduct.ID || '',
      Name: this._existingProduct.Name || '',
      Description: this._existingProduct.Description || '',
      MaxLimit:
        (this._existingProduct &&
          this._existingProduct.xp &&
          this._existingProduct.xp.MaxQuantityLimit) ||
        '',
      Active: !!this._existingProduct.Active,
      Featured: this._existingProduct.xp && this._existingProduct.xp.Featured,
      approvalRequired:
        this._existingProduct.xp && this._existingProduct.xp.ApprovalRequired,
      priceSchedule: this._existingProduct.DefaultPriceScheduleID || '',
    });
  }

  setForm() {
    this.productForm = this.formBuilder.group({
      ID: [
        this._existingProduct.ID || '',
        Validators.pattern(this.regexService.ID),
      ],
      Name: [
        this._existingProduct.Name || '',
        [Validators.required, Validators.pattern(this.regexService.ID)],
      ],
      Description: [this._existingProduct.Description || ''],
      MaxLimit: [
        (this._existingProduct &&
          this._existingProduct.xp &&
          this._existingProduct.xp.MaxQuantityLimit) ||
          '',
      ],

      Active: [!!this._existingProduct.Active],
      Featured: [this._existingProduct.xp && this._existingProduct.xp.Featured],
      approvalRequired: [
        this._existingProduct.xp && this._existingProduct.xp.ApprovalRequired,
      ],
      priceSchedule: [
        this._existingProduct.DefaultPriceScheduleID || '',
        [Validators.required],
      ],
    });
  }

  protected onSubmit() {
    // console.log('here')
    if (this.productForm.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.productForm);
    }
    let maxLimitValue = this.productForm.value.MaxLimit;
    console.log(maxLimitValue);

    let product;
    if (maxLimitValue == '') {
      product = {
        ...this.productForm.value,
        DefaultPriceScheduleID: this.productForm.value.priceSchedule,
        QuantityMultiplier: 1,
        xp: {
          Featured: this.productForm.value.Featured,
          ApprovalRequired: this.productForm.value.approvalRequired,
          MaxQuantityLimit: 999999,
        },
      };
    } else {
      product = {
        ...this.productForm.value,
        DefaultPriceScheduleID: this.productForm.value.priceSchedule,
        QuantityMultiplier: 1,
        xp: {
          Featured: this.productForm.value.Featured,
          ApprovalRequired: this.productForm.value.approvalRequired,
          MaxQuantityLimit: maxLimitValue,
        },
      };
    }

    this.formSubmitted.emit(product);
  }

  // control display of error messages
  protected hasRequiredError = (controlName: string) =>
    this.formErrorService.hasRequiredError(controlName, this.productForm);
  protected hasPatternError = (controlName: string) =>
    this.formErrorService.hasPatternError(controlName, this.productForm);
}
