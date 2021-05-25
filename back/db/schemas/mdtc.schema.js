const Sequelize = require('sequelize');
const conn = require('../conn')

class DtcMaster {


    getCat(){
        return conn.define("mdtc_cats",{
            name:{
                type:Sequelize.STRING
            },active:{
                type:Sequelize.BOOLEAN,
                defaultValue:true
            }
        })
    }

    getSubCat(){
        return conn.define("mdtc_sub_cats",{
            name:{
                type:Sequelize.STRING
            },active:{
                type:Sequelize.BOOLEAN,
                defaultValue:true
            },parId:{
                type:Sequelize.INTEGER
            }
        })
    }

    getDtcData(){
        return conn.define("mdtc_dtc_data",{
            catId:{
                type:Sequelize.INTEGER
            },subId:{
                type:Sequelize.INTEGER
            },title:{
                type:Sequelize.STRING
            },img:{
                type:Sequelize.STRING
            },description:{
                type:Sequelize.TEXT
            },engDesc1:{
                type:Sequelize.TEXT
            },engDesc2:{
                type:Sequelize.TEXT
            },hindDesc1:{
                type:Sequelize.TEXT
            },hindDesc2:{
                type:Sequelize.TEXT
            },active:{
                type:Sequelize.BOOLEAN,
                defaultValue:true
            }
        })
    }

}

let dtcMaster, MDtcCats, MDtcData, MDtcSubCats;

dtcMaster = new DtcMaster();
MDtcCats = dtcMaster.getCat();
MDtcSubCats = dtcMaster.getSubCat();
MDtcData = dtcMaster.getDtcData();

module.exports = {
    MDtcCats, MDtcSubCats, MDtcData
}