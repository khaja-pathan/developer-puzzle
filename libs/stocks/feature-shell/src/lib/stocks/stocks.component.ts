import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;
  fromMaxDate = new Date();
  toMaxDate = new Date();

  quotes$ = this.priceQuery.priceQueries$;

  timePeriods = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      period: [null],
      fromDatePicker: [null],
      toDatePicker: [null]
    });
  }

  ngOnInit() {
    this.stockPickerForm.get('fromDatePicker').valueChanges.subscribe((value) => {
      if (value) {
        this.stockPickerForm.get('period').setValue(null);
      }
    });
    this.stockPickerForm.get('toDatePicker').valueChanges.subscribe((value) => {
      if (value) {
        this.stockPickerForm.get('period').setValue(null);
      }
    });
    this.stockPickerForm.get('period').valueChanges.subscribe((value) => {
      if (value) {
        this.stockPickerForm.get('fromDatePicker').setValue(null);
        this.stockPickerForm.get('toDatePicker').setValue(null);
      }
    });
  }

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, period, fromDatePicker, toDatePicker } = this.stockPickerForm.value;
      if (fromDatePicker && toDatePicker) {
        this.priceQuery.fetchQuote(symbol, 'max');
      } else if(period !== null){
        this.priceQuery.fetchQuote(symbol, period);
      }
      else {
        console.log("No time-frame selected");
      }
    }
  }
}
