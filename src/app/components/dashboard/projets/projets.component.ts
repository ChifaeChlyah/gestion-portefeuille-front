import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {Options} from "@angular-slider/ngx-slider";
import {IDateRangePickerOptions} from "ngx-daterange";
import * as moment from 'moment';
import {Router} from "@angular/router";
declare var $: any;
@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.css']
})
export class ProjetsComponent implements OnInit {
  constructor(private router:Router) {
  }
  dropdownList:any[] = [];
  dropdownSettings:IDropdownSettings={};
  minCout: number = 50;
  maxCout: number = 200;
  minBudget: number = 50;
  maxBudget: number = 200;
  FilterHidden: boolean=true;

  options: Options = {
    floor: 0,
    ceil: 250
  };

  duree: any;
JqueryCode(){

  $('#sidebar-control').on('click', function() {
    $('#content').toggleClass('sidebar-hidden');
  });

}
  risque: number = 1;
  options2: Options = {
    floor: 0,
    ceil: 3,
    showSelectionBar: true,

    getSelectionBarColor: (value: number): string => {
      if (value == 1) {
        return '#2AE02A';
      }
      if (value == 2) {
        return 'orange';
      }
      if (value == 3) {
        return 'red';
      }
      return '#2AE02A';
    },
    getPointerColor:(value: number): string => {
      if (value == 1) {
        return '#2AE02A';
      }
      if (value == 2) {
        return 'orange';
      }
      if (value == 3) {
        return 'red';
      }
      return '#2AE02A';
    },
    showTicksValues:false,
    hidePointerLabels:true,
    hideLimitLabels:true,
    showTicks: true,
    getLegend: (value: number): string => {
      if (value == 1) {
        return 'Faible';
      }
      if (value == 2) {
        return 'Moyen';
      }
      if (value == 3) {
        return 'Fort';
      }
      return 'Aucun';
    }
  };
  form: any;
  priorite: number = 2;
  optionsPriorite: Options = {
    ceil: 2,
    showSelectionBar: true,
    selectionBarGradient: {
      from: '#FC0',
      to: 'transparent'
    },


    showTicksValues:false,
    hidePointerLabels:true,
    hideLimitLabels:true,
    showTicks: true,
    getLegend: (value: number): string => {
      if (value == 0) {
        return 'Basse';
      }
      if (value == 1) {
        return 'Moyenne';
      }
      if (value == 2) {
        return 'Elevée';
      }
      return 'Elevée';
    },
    getPointerColor:(value: number): string => {
      if (value == 0) {
        return '#fac305';
      }
      if (value == 1) {
        return '#cd6732';
      }
      if (value == 2) {
        return '#880e4f';
      }
      return '#880e4f';
    },
  };

  date2 = new Date();
  optionsDateRange: IDateRangePickerOptions= {
    labelText: 'Date de début - Date de fin',
    minDate: moment().startOf('day'),
    maxDate: moment().startOf('day'),
    format: 'DD-MM-YYYY',
  };

  ngOnInit() {
    this.dropdownList = [
      {item_id: 1, item_text: 'PSIN'},
      {item_id: 2, item_text: 'PSIG'},
      {item_id: 3, item_text: 'INFR'},
      {item_id: 4, item_text: 'ATPR'},
      {item_id: 5, item_text: 'MAINT'},
      {item_id: 5, item_text: 'EAST'}
    ];
    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true,

    };
    this.JqueryCode();
  }
  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
  }
  async clickFiltre() {
    if(this.FilterHidden==true)
      this.FilterHidden = !this.FilterHidden;
    else {
      await this.delay(1000);
      this.FilterHidden = !this.FilterHidden;
    }
  }
  getUrl():string{
    return this.router.url;
}
}
