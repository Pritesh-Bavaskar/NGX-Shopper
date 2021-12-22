import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PriceSchedule } from '@ordercloud/angular-sdk';
import { FormGroup, FormBuilder, Validators,FormArray, FormControl } from '@angular/forms';
import { AppFormErrorService } from '@app-seller/shared/services/form-error/form-error.service';
import { RegexService } from '@app-seller/shared/services/regex/regex.service';

@Component({
  selector: 'app-price-scheduler-form',
  templateUrl: './price-scheduler-form.component.html',
  styleUrls: ['./price-scheduler-form.component.scss'],
})
export class PriceSchedulerFormComponent implements OnInit {
  private _existingPriceSchedule: PriceSchedule = {};
  @Input()
  btnText: string;
  @Output()
  formSubmitted = new EventEmitter<{ priceSchedule: PriceSchedule, prevID: string }>();
  priceScheduleForm: FormGroup;
  totalRows:number;
  


  constructor(
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService,
    private regexService: RegexService
  ) {}

  ngOnInit() {
    this.setForm();
   
  }

  @Input()
  set existingPriceSchedule(priceSchedule: PriceSchedule) {
    this._existingPriceSchedule = priceSchedule || {};
    // if (!this.priceScheduleForm) {
    //   this.setForm();
    //   return;
    // } 
    // if(this._existingPriceSchedule.PriceBreaks){
    //   this.setExistingPriceSchedule()
    //  }
    // if(this.PriceBreaks){
    //   console.log(this.PriceBreaks)
    // }
    this.setForm();
    
    // this.priceScheduleForm.setValue({
    //   ID: this._existingPriceSchedule.ID || '',
    //   Name: this._existingPriceSchedule.Name || '',
    //   MinQuantity: this._existingPriceSchedule.MinQuantity || '',
    //   MaxQuantity: this._existingPriceSchedule.MaxQuantity || '',
    //   ApplyTax: !!this._existingPriceSchedule.ApplyTax ,
    //   ApplyShipping: !!this._existingPriceSchedule.ApplyShipping,
    //   UseCumulativeQuantity: !!this._existingPriceSchedule.UseCumulativeQuantity,
    //   RestrictedQuantity: !!this._existingPriceSchedule.RestrictedQuantity,
    //   Description: this._existingPriceSchedule.xp && this._existingPriceSchedule.xp.Desc,
    //   PriceBreaks:this.formBuilder.array([this.PriceBreaks])
    //   //PriceBreaks:this._existingPriceSchedule.PriceBreaks|| ' '
    
      
    // });
   
   
  }
  PriceBreaks:any
  setExistingPriceSchedule(){
    this.PriceBreaks = this.priceScheduleForm.get('PriceBreaks') as FormArray;
    this._existingPriceSchedule.PriceBreaks.forEach((element) => {
      this.PriceBreaks.push(this.formBuilder.group({
        Quantity: [element.Quantity, Validators.required],
        Price: [element.Price, Validators.required]
      }));

    });
  }

  setForm() {
    this.priceScheduleForm = this.formBuilder.group({
      ID: [
        this._existingPriceSchedule.ID || '',
        Validators.pattern(this.regexService.ID),
      ],
      Name: [
        this._existingPriceSchedule.Name || '',
        [Validators.required, Validators.pattern(this.regexService.HumanName)],
      ],
      MinQuantity: [this._existingPriceSchedule.MinQuantity || ''],
      MaxQuantity: [this._existingPriceSchedule.MaxQuantity || ''],
      ApplyTax: [!!this._existingPriceSchedule.ApplyTax],
      ApplyShipping: [!!this._existingPriceSchedule.ApplyShipping],
      UseCumulativeQuantity: [!!this._existingPriceSchedule.UseCumulativeQuantity],
      RestrictedQuantity: [!!this._existingPriceSchedule.RestrictedQuantity],
      Description: [this._existingPriceSchedule.xp && this._existingPriceSchedule.xp.Desc],
      
      PriceBreaks:new FormArray([]),

    
     
    });
    const fa=(this.priceScheduleForm.get('PriceBreaks')as FormArray)
    if(this._existingPriceSchedule && this._existingPriceSchedule.PriceBreaks){
      this.setExistingPriceSchedule();
    }

   
  
  }

  initRow(){
    const fa=(this.priceScheduleForm.get('PriceBreaks')as FormArray)
    fa.push(this.formBuilder.group({
      Price: ['', Validators.required],
      Quantity: ['', Validators.required],
    }));
 
  }


  // editPriceBreaks(){
  //   this._existingPriceSchedule.PriceBreaks
  //   this._existingPriceSchedule.PriceBreaks.forEach(element => {
  //     console.log(element)
  //     this.farray.push(element)
  //   });
  // }



  deleteRow(index:number){
    const control=(this.priceScheduleForm.get('PriceBreaks')as FormArray)
    control.removeAt(index)
  
   

  }

  
  protected onSubmit() {
    // console.log('here')
    if (this.priceScheduleForm.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.priceScheduleForm);
    }

    let priceScheduleNew;
    priceScheduleNew = {
      ...this.priceScheduleForm.value,
     xp:{Desc:this.priceScheduleForm.value.Description}
    };

    this.formSubmitted.emit({
      priceSchedule:priceScheduleNew,
      prevID:this.priceScheduleForm.value.ID});
  }

  protected hasRequiredError = (controlName: string) =>
    this.formErrorService.hasRequiredError(controlName, this.priceScheduleForm);
  protected hasPatternError = (controlName: string) =>
    this.formErrorService.hasPatternError(controlName, this.priceScheduleForm);
}


