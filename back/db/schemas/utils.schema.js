const Sequelize = require('sequelize');
const conn = require('../conn')


class UtilsSchema{

    getImgs(){
        return conn.define("images",{
            img:{
                type:Sequelize.STRING,
                allowNull:false
            },which:{
                type:Sequelize.INTEGER,
                allowNull:false
            },parId:{
                type:Sequelize.INTEGER,
                allowNull:false
            }
        },{
            timestamps: false
         })
    }

    getMainImage(){
        return conn.define("main_image",{
            image:{
                type:Sequelize.STRING
            }
        })
    }

    
}

let utilsSchema, Imgs, MainImage;

utilsSchema = new UtilsSchema();
Imgs = utilsSchema.getImgs();
MainImage = utilsSchema.getMainImage();

module.exports = {
    Imgs, MainImage
}