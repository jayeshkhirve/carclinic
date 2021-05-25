const  Sequelize  = require("sequelize");
const bodyParser = require('body-parser');
const { Brands, PreModels, Models, Years, Engine, Airs } = require('../back/db/schemas/brand_master.schema')
const { Sensors, SubSensors, Examples } = require('../back/db/schemas/sensor_master.schema')
const { MDtcCats, MDtcSubCats } = require('../back/db/schemas/mdtc.schema')
const { RelCats, RelSubCats } = require('../back/db/schemas/related.schema')
const { NDiagDataModule, NDiagSensorModule } = require('../back/db/schemas/ndiag.schema')


const urlEncoded = bodyParser.urlencoded({extended:false})

const Op = Sequelize.Op;


function getCheck(check){

    let model;
    switch(check){
        case "model":
            model = Models;
            break;
        case "preModel":
            model = PreModels;
            break;
        case "year":
            model = Years;
            break
        case "sensor":
            model = Sensors;
            break;
        case "subSensor":
            model = SubSensors;
            break;
        case "example":
            model = Examples;
            break;
        case "airs":
            model = Airs;
            break;
        case "engine":
            model = Engine;
            break;
        case "rel_cat":
            model = RelCats;
            break;
        case "rel_sub":
            model = RelSubCats;
            break;
        case "mdtc_cat":
            model = MDtcCats;
            break;
        case "mdtc_sub":
            model = MDtcSubCats;
            break;
    }

    return model;
}

class MyData{

    static FreeDtcDataNo = 1;
    static DiagnoDtcDataNo = 2;
    static RelatedDtcDataNo = 3;
    static PinRelatedDataNo = 4;


    static initObj(){
        const obj = {
            limit:10,
            offset:0
        }

        return obj;
    }

    static init(req){
        if(!req.session.obj){
            req.session.obj = this.initObj();
        }

        const query = req.query, obj = req.session.obj;
        this.convertInt(query)
        if(query.hasOwnProperty('active')){
            obj.where = {};
            obj.where.active = query.active;
            obj.limit = 10;
            obj.offset = 0;
        }else if(query.all){
            if(obj.where){
                delete obj.where.active;
            }
        }else{
            if(query.hasOwnProperty('limit')){
                obj.limit = query.limit;
            }else if(query.hasOwnProperty('offset')){
                obj.offset = query.offset;
            }
        }

        req.session.obj = obj;
        return obj;
    }

    static convertInt(body){
        for(let key in body){
            let val = body[key];
            body[key] = parseInt(val);
        }
    }

    static convertArr(arr){
        arr.map((single,index) => {
             arr[index] = parseInt(single)
        })

    }

    static convertInt(body){
        for(let key in body){
            let val = body[key];
            if(!Array.isArray(val)){
                body[key] = parseInt(val);
            }          
        }
    }

    static goErr(err,res){
        console.log(err);
        return res.redirect('/err-page');
    }

    static delete(router,path,Model){
        router.post(path,(req,res) => {
            const id = req.query.id;
            Model.destroy({where:{id}})
            .then(data => res.send({status:true}))
            .catch(err => this.goErr(err,res));
        })
    }

    static search(router,path,name,Model){
        router.get(path,(req,res) => {
            const term = req.query.term;

            Model.findAll({where:{name:{[Op.like]: term +"%"}}})
            .then(data => res.json(data))
            .catch(err => this.goErr(err,res))
        })
    }

    static searchC(router,path){
        router.get(path,(req,res) => {
            const term = req.query.term, check = req.query.check;

            getCheck(check).findAll({where:{name:{[Op.like]: term +"%"}}})
            .then(data => res.json(data))
            .catch(err => this.goErr(err,res))
        })
    }

    static searchT(router,path,Model){
        router.get(path,(req,res) => {
            const term = req.query.term;

            Model.findAll({where:{title:{[Op.like]: term +"%"}}})
            .then(data => res.json(data))
            .catch(err => this.goErr(err,res))
        })
    }

    static add(router,path,red,Model){
        router.post(path,urlEncoded,(req,res) => {
            const body = req.body;

            Model.create(body)
            .then(data => {
                return res.redirect(red)
            }).catch(err => this.goErr(err,res))
        })
    }

    static list(router,path,ejs,Model){
        router.get(path,(req,res) => {
            this.init(req);

            if(req.session.obj.where){
                if(req.session.obj.where.catId || req.session.obj.where.subId){
                    delete req.session.obj.where.catId
                    delete req.session.obj.where.subId
                }
            }
            

            Model.findAll(req.session.obj)
            .then(data => {
                const limit = req.session.obj.limit, offset = req.session.obj.offset;
                return res.render(ejs,{data,limit,offset})
            }).catch(err => this.goErr(err,res))
        })
    }

    static edit(router,path,Model){
        router.post(path,(req,res) => {
            const body = req.body,id = req.query.id;
            
            Model.update(body,{where:id})
            .then(data => res.json({status:true}))
            .catch(err => this.goErr(err,res))
        })
    }

    static actdect(router,path,Model){
        router.post(path,(req,res) => {
            const id = req.query.id;
            let active = req.query.active;

            active = parseInt(active)
            Model.update({active},{where:{id}})
            .then(data => {
                return res.json({status:true})
            }).catch(err => this.goErr(err,res))
        })
    }

    static addBack(router,path,ejs,red,Model){
        router.get(path,urlEncoded,(req,res) => {
            return res.render(ejs);
        })

        router.post(path,urlEncoded,(req,res) => {
            const body = req.body;
            console.log(body)

            Model.create(body)
            .then(data => {
                return res.redirect(red)
            }).catch(err => this.goErr(err))
        })
    }

    static next(router,path,Model){
        router.get(path,(req,res) => {
            this.convertInt(req.query)

            console.log(req.session.obj)
            if(req.query.next){
                req.session.obj.offset+=req.session.obj.limit;
            }else{
                req.session.obj.offset-=req.session.obj.limit;
            }
            
            
            Model.findAll(req.session.obj)
            .then(data => res.json(data))
            .catch(err => this.goErr(err,res))
        })
    }
    
    static nextwc(router,path,Model){
        router.get(path,(req,res) => {
            this.convertInt(req.query)

            if(req.query.next){
                req.session.obj.offset+=req.session.obj.limit;
            }else{
                req.session.obj.offset-=req.session.obj.limit;
            }

            if(req.session.obj.where){
                if(req.session.obj.where.catId || req.session.obj.where.subId){
                    delete req.session.obj.where.catId
                    delete req.session.obj.where.subId
                }
            }

            Model.findAll(req.session.obj)
            .then(data => res.json(data))
            .catch(err => this.goErr(err,res))
        });

    }

    static createModules(arr,parId,Model){
        return new Promise((resolve,reject) => {
            const narr = [];

            arr.map(moduleId => {
                narr.push(Model.create({moduleId,parId}))
            })

            Promise.all(arr)
            .then(data => resolve(data))
            .catch(err => this.goErr(err,res))
        })
    }

    static brToPat(mdata){
        return new Promise((resolve,reject) => {
            const data = {};

            const arr = [], bid = mdata.brandId, preModeId = mdata.preModeId, modeId = mdata.modeId;

            arr.push(Brands.findAll().then(res => data.brands = res))
            arr.push(this.getPars(PreModels,bid,data,"preModels"));
            arr.push(this.getPars(Models,preModeId,data,"models"));
            arr.push(Years.findAll().then(res => data.years = res));
            arr.push(Engine.findAll().then(res => data.engines = res));

            Promise.all(arr)
            .then(res => {
                resolve(data)
            }).catch(err => reject(err))
        });
    }

    static brToMdtc(mdata){
        return new Promise((resolve,reject) => {
            const  arr = [], mdtcId = mdata.mdtc_catId, oemId = mdata.oem_catId, relId = mdata. rel_catId, ans = {};
            const { mdtc_catId, mdtc_subCatId, oem_catId, oem_subCatId, rel_catId, rel_subCatId } = mdata;

            const selected = {mdtc_catId, mdtc_subCatId, oem_catId, oem_subCatId, rel_catId, rel_subCatId}

                arr.push(MDtcCats.findAll().then(res => ans.mdtcCats = res))
                if(mdtcId){
                    arr.push(this.getPars( MDtcSubCats,mdtcId,ans,"mdtcSubCats"))
                }
                if(oemId){
                    arr.push(this.getPars(MDtcSubCats,oemId,ans,"oemSubs"));
                }
                arr.push(RelCats.findAll().then(res => ans.relCats = res));
                if(relId){
                    arr.push(this.getPars(RelSubCats,relId,ans,"relSubCats"));
                }
                
                
    
                Promise.all(arr)
                .then(data => {
                    resolve({ans, selected})
                }).catch(err => reject(err))
    
        })
    }

    static getPars(Model,parId,data,name){
        return Model.findAll({where:{parId}}).then(res => {
            data[name] = res
            console.log(parId)
        });
    }

    static splicer(str){
        if(str != null && str!="" && str.length > 1 && str.includes("\"")){
            return str.substring(1,str.length-1);
        }else{
            return str;
        }
    }

}

module.exports = MyData;