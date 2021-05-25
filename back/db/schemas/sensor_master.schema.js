const Sequelize = require('sequelize');
const conn = require('../conn')

class SensorMaster{

    getSensors(){
        return conn.define("sensors",{
            name:{
                type:Sequelize.STRING,
                allowNull:false
            },active:{
                type:Sequelize.BOOLEAN,
                defaultValue:true
            }
        },{
			timestamps: false
		});
    }

    getSubSensors(){
        return conn.define("sub_sensors",{
            name:{
                type:Sequelize.STRING,
                allowNull:false
            },active:{
                type:Sequelize.BOOLEAN,
                defaultValue:true
            },parId:{
                type:Sequelize.INTEGER
            }
        },{
			timestamps: false
		});
    }

    getExamples(){
        return conn.define("examples",{
            name:{
                type:Sequelize.STRING,
                allowNull:false
            },active:{
                type:Sequelize.BOOLEAN,
                defaultValue:true
            },parId:{
                type:Sequelize.INTEGER
            }
        },{
			timestamps: false
		});
    }
}

let sensorMaster, Sensors, SubSensors, Examples;

sensorMaster = new SensorMaster();
Sensors = sensorMaster.getSensors();
SubSensors = sensorMaster.getSubSensors();
Examples = sensorMaster.getExamples();

module.exports  = {
    Sensors, SubSensors, Examples
}