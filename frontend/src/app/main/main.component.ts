import { Component , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../providers/api-service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  carList:Array<any> = [];
  modalData:any = {description:[],title:'',imageData:''};

  constructor(private api: ApiService, private router: Router){

  }

  ngOnInit() {
  	this.api.initCarList().then(next => {
  		this.carList = [];
  		var row = [];
  		for(var i = 0; i < this.api.carList.length; i++){
  			var data = this.api.carList[i];
  			data['description'] = data.description.split(',');
  			data['imageData'] = `http://localhost:3000/car/images?imageName=${data['imageName']}`
			
			row.push(data);
			this.modalData = data;
			if(i % 3 == 2){
				this.carList.push(row);
				row = [];
			}
  		}
  		console.log("this.carList",this.carList);
  	});
  }


  reserveCar(details){
  	this.api.interestDetails = details;
    localStorage.setItem('carDetails', JSON.stringify(details));
  }

}
