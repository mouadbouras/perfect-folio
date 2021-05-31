import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Portfolio, Security } from 'src/app/business-logic/models';
import { cloneDeep } from 'lodash';
import { Currency } from 'src/app/business-logic/models/currency.enum';
import { PortfolioValidators } from '../../validators/portfolio-validators';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent {
  Currency = Currency;

  @Input() set portfolio(value: Portfolio) {
    this._portfolio = value;
    this.initForm();
  }

  @Output() portfolioFormReady = new EventEmitter<FormGroup>();
  @Output() delete = new EventEmitter<string>();
  @Output() balance = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();

  private _portfolio: Portfolio;

  get portfolio(): Portfolio {
    return this._portfolio;
  }

  get securities(): FormArray {
    return this.form?.get('securities') as FormArray;
  }

  set securities(securities: FormArray) {
    this.form?.setControl('securities', securities);
  }

  form?: FormGroup;
  toDelete: string;
  public isEditMode: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    if (!this._portfolio) return;
    this.form = this.fb.group({
      key: this._portfolio.key,
      name: [
        this._portfolio.name,
        [Validators.required, PortfolioValidators.alphanumeric],
      ],
      investment: [
        this._portfolio.investment,
        [Validators.required, PortfolioValidators.numeric],
      ],
      securities: [],
      currency: [
        this._portfolio.currency,
        [Validators.required, PortfolioValidators.currencyValidator],
      ],
      cash: this._portfolio.cash,
    });
    this.initSecurities();

    this.portfolioFormReady.emit(this.form);
  }

  initSecurities(): void {
    if (!this.form?.controls) return;
    this.securities = this.fb.array(
      this._portfolio.securities
        ? this._portfolio.securities.map((security) =>
            this.fb.group({
              ...security,
              percentage: [
                security.percentage,
                [Validators.required, PortfolioValidators.numeric],
              ],
            })
          )
        : [this.fb.group({})],
      { validators: [PortfolioValidators.securitiySumValidator] }
    );
  }

  addSecurity(security: Security): void {
    this.securities.push(
      this.fb.group({
        ...security,
        percentage: [
          security.percentage,
          [Validators.required, PortfolioValidators.numeric],
        ],
      })
    );
  }

  deleteSecurity(security: Security): void {
    const portfolioCopy = cloneDeep(this._portfolio);
    this.securities.removeAt(
      portfolioCopy.securities.indexOf(
        portfolioCopy.securities.find((s) => s.symbol === security.symbol)
      )
    );
  }

  clearControl(controlName: string): void {
    if (!this.form.controls[controlName].dirty) {
      this.form.controls[controlName].setValue(null);
    }
  }

  onEdit(): void {
    this.isEditMode = true;
  }

  onEdited(): void {
    this.form.updateValueAndValidity();
    if (this.form.invalid || this.form.controls.securities.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isEditMode = false;
    this.edit.emit(this.portfolio.key);
  }

  onCancel() {
    this.isEditMode = false;
    this.initForm();
  }

  onSecuritySelected(security: Security): void {
    const portfolioCopy = cloneDeep(this._portfolio);
    portfolioCopy.securities.push(security);

    this._portfolio = portfolioCopy;
    this.addSecurity(security);
  }

  onSecurityDeleted(security: Security): void {
    const portfolioCopy = cloneDeep(this._portfolio);

    portfolioCopy.securities = portfolioCopy.securities.filter(
      (v) => v.symbol !== security.symbol
    );

    this.deleteSecurity(security);
    this._portfolio = portfolioCopy;
  }

  onDelete(key: string): void {
    console.log(key);
    this.toDelete = key;
  }

  onCancelDelete(): void {
    this.toDelete = '';
  }
}
