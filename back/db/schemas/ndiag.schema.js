const Sequelize = require('sequelize');
const conn = require('../conn')

class NDiagSchema{

    getDtcSelection(){
        return conn.define("ndiag_dtc_select",{
            brandId:{
                type:Sequelize.INTEGER
            },preModeId:{
                type:Sequelize.INTEGER
            },modeId:{
                type:Sequelize.INTEGER
            },yearId:{
                type:Sequelize.INTEGER
            },airId:{
                type:Sequelize.INTEGER
            },engineId:{
                type:Sequelize.INTEGER
            },mdtc_catId:{
                type:Sequelize.INTEGER
            },mdtc_subCatId:{
                type:Sequelize.INTEGER
            },oem_catId:{
                type:Sequelize.INTEGER
            },oem_subCatId:{
                type:Sequelize.INTEGER
            },rel_catId:{
                type:Sequelize.INTEGER
            },rel_subCatId:{
                type:Sequelize.INTEGER
            },sensor:{
                type:Sequelize.INTEGER
            }
        })
    }

    getSelectedModule(){
        return conn.define("nndiag_dtc_selectedMoodule",{
            parId:{
                type:Sequelize.INTEGER
            },moduleId:{
                type:Sequelize.INTEGER
            }
        })
    }


    getSensorSelection(){
        return conn.define("ndiag_sensor_select",{
            
            brandId:{
                type:Sequelize.INTEGER
            },preModeId:{
                type:Sequelize.INTEGER
            },modeId:{
                type:Sequelize.INTEGER
            },yearId:{
                type:Sequelize.INTEGER
            },airId:{
                type:Sequelize.INTEGER
            },engineId:{
                type:Sequelize.INTEGER
            },sensorId:{
                type:Sequelize.INTEGER
            }
        });
    }

    getSensorModules(){
        return conn.define("nndiag_sensor_selectedMoodule",{
            parId:{
                type:Sequelize.INTEGER
            },moduleId:{
                type:Sequelize.INTEGER
            }
        })
    }

    getSensorData(){
        return conn.define("ndiag_sensor_data",{
            pdf:{
                type:Sequelize.STRING
            },selectId:{
                type: Sequelize.INTEGER
            }
        })
    }

}

let NDiagSelectData, NDiagSelectSensor, NDiagnoSensorData, NDiagDataModule, NDiagSensorModule;
const ndiagSchema = new NDiagSchema();

NDiagSelectData = ndiagSchema.getDtcSelection();
NDiagSelectSensor = ndiagSchema.getSensorSelection();
NDiagnoSensorData = ndiagSchema.getSensorData();
NDiagDataModule = ndiagSchema.getSelectedModule();
NDiagSensorModule = ndiagSchema.getSensorModules();

module.exports = {
    NDiagSelectData, NDiagSelectSensor, NDiagnoSensorData, NDiagDataModule, NDiagSensorModule
};