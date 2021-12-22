import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// 3rd party
import { BuyerAddress, Address, ListBuyerAddress, OcMeService } from '@ordercloud/angular-sdk';

import { AppGeographyService } from '@app-buyer/shared/services/geography/geography.service';
import { AppFormErrorService } from '@app-buyer/shared/services/form-error/form-error.service';
import { RegexService } from '@app-buyer/shared/services/regex/regex.service';
import { Router } from '@angular/router';

@Component({
  selector: 'shared-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
})
export class AddressFormComponent implements OnInit {
  private _existingAddress: BuyerAddress;
  @Input() btnText: string;
  @Output()
  formSubmitted = new EventEmitter<{ address: Address; formDirty: boolean }>();
  stateOptions: string[] = [];
  countryOptions: { label: string; abbreviation: string }[];
  addressForm: FormGroup;
  isDefaultAddr:boolean=false;
  currentAddr:any="";
  router:any;

  constructor(
    private geographyService: AppGeographyService,
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService,
    private regexService: RegexService,
    private ocMeService: OcMeService,
    private _router: Router
  ) {
    this.countryOptions = this.geographyService.getCountries();
    this.router = _router.url;
  
  }

  ngOnInit() {
    this.setForm();    
  }

  @Input()
  set existingAddress(address: BuyerAddress) {
    this._existingAddress = address || {};
    // if(address){
    //   this.currentAddr=address.ID||''
    //   this.checkIsDefault()
    // }
    if(address){
      this.currentAddr = address.ID || '';
      this.checkIsDefault()
    }else{
       this.currentAddr = '';
      this.checkIsDefault()
    }
    this.setForm();
    this.addressForm.markAsPristine();
  }

  setForm() {
    this.addressForm = this.formBuilder.group({
      FirstName: [
        this._existingAddress.FirstName || '',
        [Validators.required, Validators.pattern(this.regexService.HumanName)],
      ],
      LastName: [
        this._existingAddress.LastName || '',
        [Validators.required, Validators.pattern(this.regexService.HumanName)],
      ],
      Street1: [this._existingAddress.Street1 || '', Validators.required],
      Street2: [this._existingAddress.Street2 || ''],
      City: [
        this._existingAddress.City || '',
        [Validators.required, Validators.pattern(this.regexService.HumanName)],
      ],
      State: [this._existingAddress.State || null, Validators.required],
      Zip: [
        this._existingAddress.Zip || '',
        [
          Validators.required,
          Validators.pattern(
            this.regexService.getZip(this._existingAddress.Country)
          ),
        ],
      ],
      Phone: [
        this._existingAddress.Phone || '',
        Validators.pattern(this.regexService.Phone),
      ],
      Country: [this._existingAddress.Country || 'US', Validators.required],
      ID: this._existingAddress.ID || '',
      isDefault:this._existingAddress.xp && this._existingAddress.xp.isDefault,
    });
    this.onCountryChange();
  }

  onCountryChange(event?) {
    const country = this.addressForm.value.Country;
    this.stateOptions = this.geographyService
      .getStates(country)
      .map((s) => s.abbreviation);
    this.addressForm
      .get('Zip')
      .setValidators([
        Validators.required,
        Validators.pattern(this.regexService.getZip(country)),
      ]);
    if (event) {
      this.addressForm.patchValue({ State: null, Zip: '' });
    }
  }

  public onSubmit() {
    if (this.addressForm.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.addressForm);
    }
    this.formSubmitted.emit({
     // address: {...this.addressForm.value,xp:{'isDefault':this.addressForm.value.isDefault}},
      address:this.addressForm.value,
      formDirty: this.addressForm.dirty,
    });
  }

  checkIsDefault(){

    if(this.currentAddr!=''){
      this.ocMeService.Get().subscribe(res=>{
        if(res.xp.defaultAddressID == this.currentAddr){
          this.isDefaultAddr = false
        }else{
          this.isDefaultAddr = true
        }
      })
      
    }else{
      this.isDefaultAddr = true 
    }
}
  
  //   checkIsDefault1(){
  
  //     if(this.currentAddr!=''){
  //       this.isDefaultAddr = false 
  //     }else{
  //     this.isDefaultAddr = true 
  //     }
  // }

  

  // control display of error messages
  hasRequiredError = (controlName: string) =>
    this.formErrorService.hasRequiredError(controlName, this.addressForm);
  hasPatternError = (controlName: string) =>
    this.formErrorService.hasPatternError(controlName, this.addressForm);
}
