const Sequelize = require('sequelize');
const conn = require('../conn')

class BrandMaster{

    getBrands(){
        return conn.define("brands",{
            name:{
                type:Sequelize.STRING,
                allowNull:false
            },active:{
                type:Sequelize.BOOLEAN,
                defaultValue:true
            },img:{
                type:Sequelize.STRING
            }
        },{
			timestamps: false
		});
    }

    getPreModel(){
        return conn.define("pre_models",{
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

    getModel(){
        return conn.define("models",{
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

    getYears(){
        return conn.define("years",{
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

    getAir(){
        return conn.define("air",{
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

    getEngine(){
        return conn.define("engine",{
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
}

let brandMaster, Brands, PreModels, Models, Years, Airs, Engine;

brandMaster = new BrandMaster();
Brands = brandMaster.getBrands();;
PreModels = brandMaster.getPreModel();
Models = brandMaster.getModel();
Years = brandMaster.getYears();
Airs = brandMaster.getAir();
Engine = brandMaster.getEngine();

module.exports = {
    Brands, PreModels, Models, Years, Airs, Engine
    
}