import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../providers/api-service';
import { Router } from '@angular/router';
import {NgbDateStruct, NgbCalendar, NgbDate, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';

declare var jQuery:any;

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  @ViewChild('myModal') modal:ElementRef;
  reserve:any = {pickupDate:'', returnDate: '', nameOfRenter:''};
  carinfo:any;
  public existingList:Array<any> = [];
  yesterday: NgbDateStruct;
  isReady:Boolean = false;
  isDisabled:any;
  errorMessage:String = '';
  payload:any;



  constructor(private api: ApiService, private calendar: NgbCalendar, 
  	public dtConfig: NgbDatepickerConfig, public router: Router) { }

  ngOnInit() {
  	this.yesterday = this.calendar.getPrev(this.calendar.getToday());
  	this.existingList = [];
  	console.log("yesterday",this.yesterday);
  	this.carinfo = (this.api.interestDetails) ? this.api.interestDetails : JSON.parse(localStorage.getItem('carDetails'));
  	this.api.getExistingReservations(this.carinfo['id']).then(next => {
  		this.existingList = this.api.existingReservations;
  		console.log("this.existingList",this.existingList);
  		this.isReady = true;

  		//make already reserved dates greyed out
  		this.isDisabled = (date: NgbDate, current: {month: number}) => {
  			try{
  				for(var i in this.existingList){
			  		var pickupDate = JSON.parse(this.existingList[i].pickupDate);
			  		var returnDate = JSON.parse(this.existingList[i].returnDate);

			  		//console.log("TIMES",pickupDate,returnDate,date);
			  		if(
			  			(date['year'] >= pickupDate['year'] && date['month'] >= pickupDate['month'] && date['day'] >= pickupDate['day'])&&
			  			(date['year'] <= returnDate['year'] && date['month'] <= returnDate['month'] && date['day'] <= returnDate['day'])
			  			){
			  			return true;
			  		}
			  	}
			  }catch(err){
			  	console.log("err",err);
			  }
  		}
  	});
  }

  test(){
  	console.log("modal",this.modal);
  	this.router.navigate(['main']);
  }


  reserveCar(){
  	//verification
  	this.errorMessage = '';
  	for(var i in this.reserve){
  		if(this.reserve[i] == '' || this.reserve[i] == ' '){
  			console.log("issue with ", i);
  			this.errorMessage = "Issue with " + i;
  			return;
  		}
  	}
  	if(this.reserve['pickupDate'].year > this.reserve['returnDate'].year || 
  		this.reserve['pickupDate'].month > this.reserve['returnDate'].month || 
  		this.reserve['pickupDate'].day > this.reserve['returnDate'].day){
  		console.log("pickup is after return");
  		this.errorMessage = "Pickup Date is after the return date";
  		return;
  	}

  	this.payload = {
  		pickupDate: JSON.stringify({
  			year: this.reserve['pickupDate'].year,
  			month: this.reserve['pickupDate'].month,
  			day: this.reserve['pickupDate'].day,
  		}),
  		returnDate: JSON.stringify({
  			year: this.reserve['returnDate'].year,
  			month: this.reserve['returnDate'].month,
  			day: this.reserve['returnDate'].day,
  		}),
  		nameOfRenter: this.reserve['nameOfRenter'],
  		carID: this.carinfo['id']
  	}
  	console.log("payload",this.payload);
  	this.api.reserveCar(this.payload).then(success => {
  		console.log("success");
  		jQuery(this.modal.nativeElement).modal('show');
	  	jQuery(this.modal.nativeElement).on('hide.bs.modal', () => {
	  		this.router.navigate(['main']);
	  	})
  	});
  }

}
