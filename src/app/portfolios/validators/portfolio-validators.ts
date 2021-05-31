import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Currency } from 'src/app/business-logic/models/currency.enum';

// alphanumeric without leading/trailing spaces, but if not a pb, can be simplified as ^[A-Za-zÀ-ÿA-Z0-9 ]*$
const alphanumericPattern = '^[A-Za-zÀ-ÿ0-9]+(?: +[A-Za-zÀ-ÿ0-9]+)*$';
const alphabeticalPattern = '^[A-Za-zÀ-ÿ]+(?: +[A-Za-zÀ-ÿ]+)*$'; // same : '^[A-Za-zÀ-ÿ ]*$';
const numericPattern = '^[0-9]*$';
const phoneNumberPattern = '^\\+?\\d*$';
const emailPattern = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
const firstNameLastNamePattern = /^[a-zA-ZÀ-ÿ'-]{2,}(?: +[a-zA-ZÀ-ÿ'-]+)*$/u;

export class PortfolioValidators {
  static alphabetical(control: AbstractControl): ValidationErrors | null {
    if (Validators.pattern(alphabeticalPattern)(control)) {
      return {
        alpha: true,
      };
    }
    return null;
  }

  static numeric(control: AbstractControl): ValidationErrors | null {
    if (Validators.pattern(numericPattern)(control)) {
      return {
        numeric: true,
      };
    }
    return null;
  }

  static phoneNumber(control: AbstractControl): ValidationErrors | null {
    if (Validators.pattern(phoneNumberPattern)(control)) {
      return {
        phoneNumber: true,
      };
    }
    return null;
  }

  static alphanumeric(control: AbstractControl): ValidationErrors | null {
    if (Validators.pattern(alphanumericPattern)(control)) {
      return {
        alphanumeric: true,
      };
    }
    return null;
  }

  static email(control: AbstractControl): ValidationErrors | null {
    if (control.value && Validators.pattern(emailPattern)(control)) {
      return {
        email: true,
      };
    }
    return null;
  }

  public static firstNameLastName(
    control: FormControl
  ): ValidationErrors | null {
    return !control.value || firstNameLastNamePattern.test(control.value)
      ? null
      : {
          firstNameLastName: true,
        };
  }

  static identicalConfirmation(
    fistField: string,
    secondField: string
  ): ValidatorFn {
    return (control: AbstractControl) => {
      const first = control.value?.[fistField];
      const second = control.value?.[secondField];
      if (first && second && first !== second) {
        return {
          identical: true,
        };
      }
      return null;
    };
  }

  public static currencyValidator(
    control: FormControl
  ): ValidationErrors | null {
    return control.value === Currency.CAD || control.value === Currency.USD
      ? null
      : {
          currency: true,
        };
  }

  public static securitiySumValidator(
    formArray: FormArray
  ): ValidationErrors | null {
    let sum = 0;
    for (let group of formArray.controls) {
      sum += (group as FormGroup).controls.percentage.value;
    }

    return sum <= 100
      ? null
      : {
          percentage: true,
        };
  }
}
