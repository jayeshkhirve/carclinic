const Sequelize = require('sequelize');
const conn = require('../conn')

class RelatedMaster {


    getRelCat(){
        return conn.define("rel_cat",{
            name:{
                type:Sequelize.STRING
            }
        })
    }

    getRelSubCat(){
        return conn.define("rel_subCat",{
            name:{
                type:Sequelize.STRING
            },parId:{
                type:Sequelize.INTEGER
            }
        })
    }

    getData(){
        return conn.define("related_data",{
            title:{
                type:Sequelize.STRING
            },img:{
                type:Sequelize.STRING
            },active:{
                type:Sequelize.BOOLEAN,
                defaultValue:true 
            },description:{
                type:Sequelize.TEXT
            },catId:{
                type:Sequelize.INTEGER
            },subId:{
                type:Sequelize.INTEGER
            }
        })
    }

}

let relatedMaster, RelatedData, RelCats, RelSubCats;

relatedMaster = new RelatedMaster();
RelatedData = relatedMaster.getData();
RelCats = relatedMaster.getRelCat();
RelSubCats = relatedMaster.getRelSubCat();

module.exports = {
     RelatedData, RelCats, RelSubCats
}