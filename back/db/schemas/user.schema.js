const Sequelize = require('sequelize');
const conn = require('../conn')

class UserSchema{


    getUserMob(){
        return conn.define("user_mob",{
            mob:{
                type:Sequelize.STRING,
                allowNull:false,
                unique:true
            },
            registered:{
                type:Sequelize.BOOLEAN,
                defaultValue:false
            }
        })
    }

    getUser(){
        return conn.define("users",{
            name:{
                type:Sequelize.STRING,
                allowNull:false
            },email:{
                type:Sequelize.STRING,
                allowNull:true,
				defaultValue:"def"
            },workshopName:{
                type:Sequelize.STRING,
                allowNull:false
            },workShopAddress:{
                type:Sequelize.STRING,
				defaultValue:"def"
            },img:{
                type:Sequelize.STRING,
                allowNull:true,
				defaultValue:"def"
            }
            ,address:{
                type:Sequelize.STRING
            },active:{
                type:Sequelize.BOOLEAN,
                defaultValue:true
            },mob:{
                type:Sequelize.INTEGER
            }
        })
    }

    getPlanes(){
        return conn.define("planes",{
            img:{
                type:Sequelize.STRING
            },title:{
                type:Sequelize.STRING
            },description:{
                type:Sequelize.TEXT
            },origPrice:{
                type:Sequelize.FLOAT
            },price:{
                type:Sequelize.FLOAT
            },months:{
                type:Sequelize.INTEGER
            },active:{
                type:Sequelize.BOOLEAN,
                defaultValue:true
            }
        })
    }

    getHistory(){
        return conn.define("history",{
            userId:{
                type:Sequelize.INTEGER,
                allowNull:false
            },date:{
                type:Sequelize.DATE,
				defaultValue:null
            },months:{
                type:Sequelize.INTEGER
            },price:{
                type:Sequelize.FLOAT
            },plane:{
                type:Sequelize.INTEGER,
                allowNull:false
            },active:{
                type:Sequelize.BOOLEAN,
                defaultValue:true
            }
        })
    }

    getFeedBacks(){
        return conn.define("feedbacks",{
            userId:{
                type:Sequelize.INTEGER
            },tiitle:{
                type:Sequelize.STRING
            },description:{
                type:Sequelize.TEXT
            },active:{
                type:Sequelize.BOOLEAN,
                defaultValue:true
            }
        })
    }

    getComplaints(){
        return conn.define("complaints",{
            userId:{
                type:Sequelize.INTEGER
            },title:{
                type:Sequelize.STRING
            },description:{
                type:Sequelize.TEXT
            },active:{
                type:Sequelize.BOOLEAN,
                defaultValue:true
            }
        })
    }


}

let userSchema, Complaints, Feedback, History, Plane, User, MobNumb;

userSchema = new UserSchema();
Complaints = userSchema.getComplaints();
Feedback = userSchema.getFeedBacks();
History = userSchema.getHistory();
Plane = userSchema.getPlanes();
User = userSchema.getUser();
MobNumb = userSchema.getUserMob(); 

module.exports = {
    User, Plane ,History, Complaints, Feedback, MobNumb
}
