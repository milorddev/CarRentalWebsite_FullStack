import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  carList:Array<any> = [];
  existingReservations:Array<any> = [];
  interestDetails:any;

  url:string = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  initCarList(){
    return new Promise((resolve,reject) => {
      this.http.get(`${this.url}/cars`).subscribe(cardata => {
        this.carList = cardata['data'];
        resolve();
      });
    });
  }

  getExistingReservations(carID){
    return new Promise((resolve,reject) => {
      this.http.get(`${this.url}/getReservationsByCar?carID=${carID}`).subscribe(times => {
        this.existingReservations = times['data'];
        resolve();
      });
    });
  }

  reserveCar(carObj){
    return new Promise((resolve,reject) => {
      this.http.post(`${this.url}/reserve`, carObj).subscribe(cardata => {
        resolve();
      });
    });
  }
  
  getCarImage(imageName){
    return new Promise((resolve,reject) => {
      this.http.get(`${this.url}/car/images?imageName=${imageName}`).subscribe(image => {
        console.log("image",image);
        resolve(image);
      });
    });
  }

}
