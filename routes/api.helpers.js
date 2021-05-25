const Sequelize = require('sequelize');

class ApiHelper{

    static getById(Model,req,res){
        const id = req.query.id;

        
    }

    static getByQuery(Model,req,res){
        const query = req.query;
        this.sendRes( Model.findAll({where:query}),res);
    }

    static getByQueryC(Model,query,res){
        this.sendRes( Model.findAll({where:query}),res);
    }

    static getOneC(Model,query,res){
        this.sendResO( Model.findOne({where:query}),res);
    }

    static sendRes(prom,res){
        prom.then(data => {
            if(data){
                res.json(data)
            }else{
                res.json({status:false})
            }
        }).catch(err => res.json({status:false}))
    }

    static sendResO(prom,res){
        prom.then(data => {
            
            if(data){
                const value = data.dataValues;
                res.json({...value,status:true})
            }else{
                res.json({status:false})
            }
        }).catch(err => res.json({status:false}))
    }

    static sendJson(res,data,bool){
        if(bool){
            res.json(data)
        }else{
            res.json({status:bool})
        }
    }

   

}

module.exports = ApiHelper;
