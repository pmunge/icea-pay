import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

import { PAYBILL_PROVIDERS } from '../../../core/models/paybills';
import { Country } from '../../../core/models/country';
import { FinanceService } from '../../../core/services/finance-service';
import { CountryService } from '../../../core/services/country-service';
//import products

@Component({
  selector: 'app-paybill-form',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDialogModule
  ],

  templateUrl: './form.html',

  styleUrl: './form.scss'
})
export class Form implements OnInit {

  private fb = inject(FormBuilder);

  private financeService = inject(FinanceService);

  private countryService = inject(CountryService);


  private dialogRef =
    inject(MatDialogRef<Form>);


  readonly providers = PAYBILL_PROVIDERS;

  readonly countries = signal<Country[]>([]);

  saving = false;

  paybillsForm = this.fb.nonNullable.group({
    paybillNumber: [
      '',
      Validators.required
    ],
    provider: [
      '',
      Validators.required
    ],
    countryCode: [
      '',
      Validators.required
    ],

  });

  ngOnInit(): void {
    this.countryService.getCountries().subscribe({
      next: (countries) => {
        this.countries.set(countries);
        if (!this.paybillsForm.controls.countryCode.value && countries.length) {
          this.paybillsForm.controls.countryCode.setValue(countries[0].code);
        }
      },
      error: (error) => console.error('Failed to load countries', error)
    });
  }


  save(): void {
    if (this.paybillsForm.invalid) {
      this.paybillsForm.markAllAsTouched();
      return;
    }

    const { paybillNumber, provider, countryCode } = this.paybillsForm.getRawValue();
    this.saving = true;

    this.financeService
      .createPaybill({ paybillNumber, provider, countryCode })
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: (createdPaybill) => {
          this.dialogRef.close(createdPaybill);
        },
        error: (error) => {
          console.error('Failed to create paybill', error);
        }
      });
  }
  cancel(): void {
    this.dialogRef.close();
  }

}
