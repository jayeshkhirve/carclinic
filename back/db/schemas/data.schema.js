const Sequelize = require('sequelize');
const conn = require('../conn')

class DataSchema{



    getDataComb(){
        return conn.define("data_dataCombs",{
            brandId:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            preModeId:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            modId:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            yearId:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            engine:{
                type:Sequelize.INTEGER
            },airId:{
                type:Sequelize.INTEGER
            }
        })
    }

    getEcuDataComb(){
        return conn.define("data_ecuCombs",{
            brandId:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            preModeId:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            modId:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            yearId:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            engine:{
                type:Sequelize.INTEGER
            },airId:{
                type:Sequelize.INTEGER
            }
        })
    }

    getSensorDataComb(){
        return conn.define("data_sensorCombs",{
            sensorId:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            subSensorId:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            exampleId:{
                type:Sequelize.INTEGER,
                allowNull:false
            }
        })
    }


    getDataWiringManual(){
        return conn.define("data_wiring_manual",{
            description:{
                type:Sequelize.TEXT,
                allowNull:false
            },
            combsId:{
                type:Sequelize.INTEGER,
                allowNull:false
            }
        })
    }

    getDataEcu(){
        return conn.define("data_ecu_pinout",{
            description:{
                type:Sequelize.TEXT,
                allowNull:false
            },
            combsId:{
                type:Sequelize.INTEGER,
                allowNull:false
            }
        })
    }

    getDataSensor(){
        return conn.define("data_sensor_checking",{
            pdf:{
                type:Sequelize.STRING,
                allowNull:false
            },
            combsId:{
                type:Sequelize.INTEGER,
                allowNull:false
            }
        })
    }

    getWiringModules(){
        return conn.define("data_wiring_modules",{
            moduleId:{
                type:Sequelize.INTEGER
            },parId:{
                type:Sequelize.INTEGER
            }
        })
    }

    getEcuModules(){
        return conn.define("data_wiring_modules",{
            moduleId:{
                type:Sequelize.INTEGER
            },parId:{
                type:Sequelize.INTEGER
            }
        })
    }



}

let dataSchema, DataWiringManual, DataSensor, DataEcu, MainDataCombs, DataEcuCombs, DataSensorCombs, DataWiringModule, DataEcuModule, DataSensorModule;

dataSchema = new DataSchema();
DataWiringManual = dataSchema.getDataWiringManual();
DataSensor = dataSchema.getDataSensor();
DataEcu = dataSchema.getDataEcu();
MainDataCombs = dataSchema.getDataComb();
DataEcuCombs = dataSchema.getEcuDataComb();
DataSensorCombs = dataSchema.getSensorDataComb();
DataWiringModule = dataSchema.getWiringModules();
DataEcuModule = dataSchema.getEcuModules();


module.exports = {
    DataWiringManual, DataSensor, DataEcu, MainDataCombs, DataEcuCombs, DataSensorCombs, DataWiringModule, DataEcuModule, DataSensorModule
}