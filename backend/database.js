/*jshint esversion: 6 */
const Sequelize = require('sequelize');
const sequelize = new Sequelize('sqlite:carRentalDB.db');

models = [];

//models
const cars = sequelize.define('cars', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imageName: {
    type: Sequelize.STRING,
    allowNull: false
  }
}); models.push(cars);

const reserved = sequelize.define('reserved', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pickupDate: {
    type: Sequelize.STRING,
    allowNull: false
  },
  returnDate: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  nameOfRenter: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  carID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: cars,
      key: 'id'
    }
  }
}); models.push(reserved);



/*** DATABASE INTERACTION FUNCTIONS ***/
module.exports = {
//check if connection is good
authenticate: () => {
  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
},

sync: (dropit) => {
  Promise.all(models.map(i => i.sync({force: dropit}))).then(next => {
    console.log("all models are synced");
  });
},

getValidationErrorArray: (err) => {
  var errArray = err.errors;
  var result = [];
  for(var i in errArray){
    result.push(errArray[i].path);
  }
  var stringResult = 'Please add entries for ' + result.join(',');
  return {rawArray: result, text: stringResult};
},

//models in use & direct links
  
  cars: cars,
  reserved: reserved

};