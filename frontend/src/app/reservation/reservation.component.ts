import { Component, OnInit } from '@angular/core';
import { ApiService } from '../providers/api-service';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {

  reserve:any = {pickupDate:'', returnDate: '', nameOfRenter:''};
  carinfo:any;
  existingList:Array<any> = [];
  yesterday: NgbDateStruct;
  isReady:Boolean = false;

  constructor(private api: ApiService, private calendar: NgbCalendar) { }

  ngOnInit() {
  	this.yesterday = this.calendar.getPrev(this.calendar.getToday());
  	this.existingList = [];
  	console.log("yesterday",this.yesterday);
  	this.carinfo = (this.api.interestDetails) ? this.api.interestDetails : JSON.parse(localStorage.getItem('carDetails'));
  	this.api.getExistingReservations(this.carinfo['id']).then(next => {
  		this.existingList = this.api.existingReservations;
  		console.log("this.existingList",this.existingList);
  		this.isReady = true;
  	});
  }

  // onDateSelect(event,type){
  // 	console.log("event",event);
  // 	if(type == 'pickup'){
  // 		this.reserve['pickupDate'] == event;
  // 	}
  // 	if(type == 'return'){
  // 		this.reserve['returnDate'] == event;
  // 	}
  // }

  reserveCar(){
  	//verification
  	for(var i in this.reserve){
  		if(this.reserve[i] == '' || this.reserve[i] == ' '){
  			console.log("issue with ", i);
  			return;
  		}
  	}
  	if(this.reserve['pickupDate'].year > this.reserve['returnDate'].year || 
  		this.reserve['pickupDate'].month > this.reserve['returnDate'].month || 
  		this.reserve['pickupDate'].day > this.reserve['returnDate'].day){
  		console.log("pickup is after return");
  		return;
  	}

  	var payload = {
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
  	console.log("payload",payload);
  	this.api.reserveCar(payload).then(success => {
  		console.log("success");
  	});
  }

  foop(date, current){
  	// console.log("date",date, current, this.isReady);
 //  	return new Promise((resolve, reject) => {
 //  		try{
	// 	  	for(var i in this.existingList){
	// 	  		var pickupDate = JSON.parse(this.existingList[i].pickupDate);
	// 	  		var returnDate = JSON.parse(this.existingList[i].returnDate);

	// 	  		console.log("TIMES",pickupDate,returnDate,date);
	// 	  		if(
	// 	  			(date['year'] >= pickupDate['year'] && date['month'] >= pickupDate['month'] && date['day'] >= pickupDate['day'])&&
	// 	  			(date['year'] <= returnDate['year'] && date['month'] <= returnDate['month'] && date['day'] <= returnDate['day'])
	// 	  			){
	// 	  			resolve(true);
	// 	  		}
	// 	  	}
	// 	  	resolve(false);
	//   }
	//   catch(err){
	//   	console.log("err",err);
	//   	resolve(false);
	//   }
	// });
  }

}
