const Sequelize = require('sequelize');
const conn = require('../conn')

class DtcMaster{

    getDtcCode(){
        return conn.define("dtc_codes",{
            code:{
                type:Sequelize.STRING,
                allowNull:false
            },active:{
                type:Sequelize.BOOLEAN,
                defaulltValue:true
            }
        },{
			timestamps: false
		})
    }

    getDtcData(){
        return conn.define("free_dtc_data",{
            title:{
                type:Sequelize.STRING,
                allowNull:false
            },
            description:{
                type:Sequelize.TEXT,
                allowNull:false
            },preId:{
                type:Sequelize.STRING,
                allowNull:true
            },codeId:{
                type:Sequelize.INTEGER,
                allowNull:true
            },brandId:{
                type:Sequelize.INTEGER,
                allowNull:true
            }
        },{
			timestamps: false
		});
    }

    getDtcCombs(){
        return conn.define("dtc_combs",{
            codeId:{
                type:Sequelize.INTEGER,
                allowNull:true
            },brandId:{
                type:Sequelize.INTEGER,
                allowNull:true
            },dataId:{
                type:Sequelize.INTEGER,
                allowNull:false
            }
        },{
			timestamps: false
		})
    }

}