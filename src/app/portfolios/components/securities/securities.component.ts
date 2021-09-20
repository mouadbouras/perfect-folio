import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Security } from 'src/app/business-logic/models';

@Component({
  selector: 'app-securities',
  templateUrl: './securities.component.html',
  styleUrls: ['./securities.component.scss'],
})
export class SecuritiesComponent {
  @Input() securities: FormArray;
  @Input() isEditMode: boolean;

  @Output() securityDeleted = new EventEmitter<Security>();

  public get controls(): FormGroup[] {
    return this.securities.controls as FormGroup[];
  }

  clearControl(control: AbstractControl): void {
    if ((control as FormControl).pristine) {
      (control as FormControl).setValue(null);
    }
  }
}
