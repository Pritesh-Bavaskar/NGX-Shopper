import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  ComponentFactoryResolver,
} from '@angular/core';
import { OcUserService, User } from '@ordercloud/angular-sdk';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppFormErrorService } from '@app-seller/shared/services/form-error/form-error.service';
import { RegexService } from '@app-seller/shared/services/regex/regex.service';
import { Router } from '@angular/router';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-seller/config/app.config';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import { ToastrService } from 'ngx-toastr';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { AppStateService } from '@app-seller/shared/services/app-state/app-state.service';
@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  protected _existingUser: User = {};
  @Input()
  btnText: string;
  @Output()
  formSubmitted = new EventEmitter<{ user: any; prevID: any }>();

  userForm: FormGroup;
  router: any;
  confirmationModalId = 'confirmationModalapprove';
  faUser = faUser;

  formValue: any;

  constructor(
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService,
    private regexService: RegexService,
    private ocUserService: OcUserService,
    private _router: Router,
    private toastrService: ToastrService,
    private modalService: ModalService,
    private appStateService: AppStateService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {
    this.router = _router.url;
  }

  ngOnInit() {
    this.setForm();
  }

  @Input()
  set existingUser(user: User) {
    this._existingUser = user || {};

    if (!this.userForm) {
      this.setForm();
      return;
    }

    this.userForm.setValue({
      ID: this._existingUser.ID || '',
      Username: this._existingUser.Username || '',
      FirstName: this._existingUser.FirstName || '',
      LastName: this._existingUser.LastName || '',
      Phone: this._existingUser.Phone || '',
      Email: this._existingUser.Email || '',
      Active: !!this._existingUser.Active,

      City:
        (this._existingUser &&
          this._existingUser.xp &&
          this._existingUser.xp.City) ||
        '',
      ZipCode:
        (this._existingUser &&
          this._existingUser.xp &&
          this._existingUser.xp.ZipCode) ||
        '',
    });
  }

  setForm() {
    this.userForm = this.formBuilder.group({
      ID: [
        this._existingUser.ID || '',
        Validators.pattern(this.regexService.ID),
      ],
      Username: [this._existingUser.Username || '', Validators.required],
      FirstName: [
        this._existingUser.FirstName || '',
        [Validators.required, Validators.pattern(this.regexService.HumanName)],
      ],
      LastName: [
        this._existingUser.LastName || '',
        [Validators.required, Validators.pattern(this.regexService.HumanName)],
      ],
      Phone: [
        this._existingUser.Phone || '',
        Validators.pattern(this.regexService.Phone),
      ],
      Email: [
        this._existingUser.Email || '',
        [Validators.required, Validators.email],
      ],
      Active: [!!this._existingUser.Active],

      City: [
        (this._existingUser &&
          this._existingUser.xp &&
          this._existingUser.xp.City) ||
          '',
        [Validators.required, Validators.pattern(this.regexService.City)],
      ],
      ZipCode: [
        (this._existingUser &&
          this._existingUser.xp &&
          this._existingUser.xp.ZipCode) ||
          '',
        [Validators.required, Validators.pattern(this.regexService.ZipCode)],
      ],
    });
  }

  openConfirmationDialog = () => {
    this.modalService.open(this.confirmationModalId);

    this.formValue = new Object();
    this.formValue = {
      Active: this.userForm.value.Active,
      Email: this.userForm.value.Email,
      FirstName: this.userForm.value.FirstName,
      ID: this.userForm.value.ID,
      LastName: this.userForm.value.LastName,
      Phone: this.userForm.value.Phone,
      Username: this.userForm.value.Username,
      xp: {
        City: this.userForm.value.City,
        ZipCode: this.userForm.value.ZipCode,
        isApproved: true,
      },
    };
    //this.formValue = this.userForm.value;
    this.appStateService.userID = this.formValue.ID;
    this.appStateService.approveUserFormValue = this.formValue;
  };
  closeConfirmDialog() {
    this.modalService.close(this.confirmationModalId);
  }

  getFormData = () => {
    console.log(
      'from get data',
      this.appStateService.approveUserFormValue,
      this.appStateService.userID
    );
  };

  public onSubmit() {
  
    let userInfo;

    if (this.router == '/ApprovableUsers') {

      if (this.userForm.status === 'INVALID') {
        this.modalService.close(this.confirmationModalId);
         return this.formErrorService.displayFormErrors(this.userForm);
       }else{
        userInfo = {
          ...this.appStateService.approveUserFormValue,
        };
        this.formSubmitted.emit({
          user: userInfo,
          prevID: this.appStateService.userID,
        });
  
        this.modalService.close(this.confirmationModalId);
        this.toastrService.success('User Approved succesfully ');
       }

     
    } else {
      

      if (this.userForm.status === 'INVALID') {
       // this.modalService.close(this.confirmationModalId);
        return this.formErrorService.displayFormErrors(this.userForm);
      }

      userInfo = {
        Active: this.userForm.value.Active,
        Email: this.userForm.value.Email,
        FirstName: this.userForm.value.FirstName,
        ID: this.userForm.value.ID,
        LastName: this.userForm.value.LastName,
        Phone: this.userForm.value.Phone,
        Username: this.userForm.value.Username,
        xp: {
          City: this.userForm.value.City,
          ZipCode: this.userForm.value.ZipCode,
          isApproved: true,
        },
      };

      this.formSubmitted.emit({
        user: userInfo,
        prevID: this._existingUser.ID,
      });

      console.log(userInfo);
    }
  }

  // control display of error messages
  protected hasRequiredError = (controlName: string) =>
    this.formErrorService.hasRequiredError(controlName, this.userForm);
  protected hasPatternError = (controlName: string) =>
    this.formErrorService.hasPatternError(controlName, this.userForm);
  protected hasEmailError = () =>
    this.formErrorService.hasValidEmailError(this.userForm.get('Email'));
}
