const Sequelize = require('sequelize');
const conn = require('../conn')

class DiagnoMaster{

    getDiagDtcData(){
        return conn.define("diag_dtc_data",{
            title:{
                type:Sequelize.STRING,
                allowNull:false
            },
            description:{
                type:Sequelize.TEXT,
                allowNull:false
            },
            combsId:{
                type:Sequelize.INTEGER,
                allowNull:true
            }
        },{
			timestamps: false
		});
    }

    getDataComb(){
        return conn.define("diag_dataCombs",{
            compId:{
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
            patDis:{
                type:Sequelize.BOOLEAN,
                defaultValue:false
            },
            airId:{
                type:Sequelize.INTEGER,
                allowNull:false
            },codeId:{
                type:Sequelize.INTEGER,
                allowNull:true
            }
        })
    }

    getSensorData(){
        return conn.define("diag_sensor-data",{
            title:{
                type:Sequelize.STRING,
                allowNull:false
            },
            description:{
                type:Sequelize.TEXT,
                allowNull:false
            },
            sensId:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            combsId:{
                type:Sequelize.INTEGER,
                allowNull:true
            }
        },{
			timestamps: false
		});
    }

    
    getDiagRelatedData(){
        return conn.define("diag_rel_data",{
            title:{
                type:Sequelize.STRING,
                allowNull:false
            },
            description:{
                type:Sequelize.TEXT,
                allowNull:false
            },
            combsId:{
                type:Sequelize.INTEGER,
                allowNull:false
            }
        },{
			timestamps: false
        })
    }

    getPinRelativeData(){
        return conn.define("diag_pin_data",{
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
}

let diagnoMaster, DiagnoDtcData, DiagnoCombs, DiagnoSensorData, DiagnoRelatedData, DiagnoPinRelatedData;

diagnoMaster = new DiagnoMaster();
DiagnoDtcData = diagnoMaster.getDiagDtcData();
DiagnoCombs = diagnoMaster.getDataComb();
DiagnoSensorData = diagnoMaster.getSensorData();
DiagnoRelatedData = diagnoMaster.getDiagRelatedData();
DiagnoPinRelatedData = diagnoMaster.getPinRelativeData();

module.exports = {
    DiagnoDtcData, DiagnoCombs, DiagnoSensorData, DiagnoRelatedData, DiagnoPinRelatedData
}