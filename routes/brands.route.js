const express = require('express');
const router = express.Router();
const { Brands, Models, PreModels, Years, Airs, Engine } = require("../back/db/schemas/brand_master.schema");
const { Sensors, SubSensors, Examples } = require('../back/db/schemas/sensor_master.schema')
const { RelCats, RelSubCats } = require("../back/db/schemas/related.schema")
const { Imgs } = require('../back/db/schemas/utils.schema')
const { uploadImg } = require('../img.helper')
const bodyParser = require('body-parser');
const Filter = require('./Filter.helper')
const Helper = require('./utils.helper');
const { MDtcCats, MDtcSubCats } = require('../back/db/schemas/mdtc.schema');

const urlEncoded = bodyParser.urlencoded({extended:false})


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

function getTitle(check){

        let name ;
        switch(check){
            case "model":
                name = "Sub Model";
                break;
            case "preModel":
                name = "Model";
                break;
            case "year":
                name = "Year";
                break
            case "sensor":
                name = "Sensor";
                break;
            case "subSensor":
                name = "Sub Sensor";
                break;
            case "example":
                name = "Sub Sub Sensor";
                break;
            case "airs":
                name = "Sub Modules";
                break;
            case "engine":
                name = "Sub Engine";
                break;
            case "rel_cat":
                name = "Sub Category";
                break;
            case "rel_sub":
                name = "Sub Category";
                break;
            case "mdtc_cat":
                name = " Category";
                break;
            case "mdtc_sub":
                name = "Sub Category";
                break;
        }
    
        return name;
    
}

router.get('/manage_brand',(req,res) => {
    /*const body = req.query;
    let q = {};

    for(let key in body){
        let val = body[key];
        body[key] = parseInt(val);

        if(key == 'active'){
            q.where = {};
            q.where[key] = parseInt(val) 
        }
        if(key == 'limit'){
            q[key] = parseInt(val)
        }
        if(key == 'offset'){

        }
    }

    console.log(q);*/

    Filter.init(req,"brand_filter")

    Brands.findAll(req.session["brand_filter"]).then(data => {
        //res.send(data)
        return res.render('rbrand_list',{data:data});
    }).catch(err => res.send(err))
});

Helper.searchC(router,"/simple-search")

router.get('/add_brand',(req,res) => {
    return res.render('add_brands');
})

router.get('/actdect-brand',(req,res) => {
    const act = req.query.act, id = req.query.id;
    const active = (act == 1 | act == '1') ? true : false ;

    console.log(act)

    Brands.update({active},{where:{id}})
    .then(data => {
        res.json({status:true})
    }).catch(err => res.json({status:false}))
})

router.get('/edit_brand',(req,res) => {
    const name = req.query.name, id = req.query.id;

    Brands.findOne({where:{id}})
    .then(data => {
        const name = data.name;

        return res.render('edit_brand',{
            name:name,id:id
        });
    }).catch(err => res.send(err))
})

router.post('/submit_brand',(req,res) => {
 
    uploadImg(req,res,() => {   
        const name = req.body.name,img = req.file.path;   
        Brands.create({name,img})
        .then(data => {
            return res.redirect( "/manage_brand");
        }).catch(err => res.send(err))
    });
})

router.post('/edit_brand',(req,res) => { 
    const id = req.query.id;
    uploadImg(req,res,() => {   
        const name = req.body.name,img = req.file.path;   
        Brands.update({name,img},{where:{id}})
        .then(data => {
            if(data){
                return res.redirect( "/manage_brand");
            }
        }).catch(err => res.send(err))
    });
})



router.get('/simple-list',(req,res) => {
    const check = req.query.check,parId = req.query.parId,query = req.query;
    const obj = Filter.init(req,"mdtc_sub")

    let model = getCheck(check);
    let q = (parId) ? {where:{parId}} : {};


    if(q.where){
        if(!obj.where){
            obj.where = {};
        }

        obj.where = {where:{parId}}
    }

    model.findAll(req.session["mdtc_sub"]).then(data => {
        const title = getTitle(check);
        
       // return res.render('simple-list',{data:data,check:check,title});
        if((model == PreModels) || (model == Models) ||(model == SubSensors) || (model == Examples) ){
            let pars = [],parModel;
            if(model == PreModels){
                parModel = Brands;
            }else if(model == Models){
                parModel = PreModels;
            }else if(model == SubSensors){
                parModel = Sensors;
            }else if(model == Examples){
                parModel = SubSensors;
            }

            data.map(single => {
                const parId = single.parId;

               // console.log(parId)
               if(parId){
                console.log(parId)
                   pars.push(parModel.findOne({where:{id:parId}}).then(ok => {
                       single.parTitle = ok.name;
                       console.log(single.parTitle)
                    }))
               }

            })

           
            Promise.all(pars)
            .then(nData => {
                return res.render('simple-list',{data:data,check:check,title});
            }).catch(err => console.log(err))

        }else{
            return res.render('simple-list',{data:data,check:check,title});
        }
    }).catch(err => res.send(err))
})

router.post('/actdect-simple',(req,res) => {
    const act = req.query.active, id = req.query.id, check = req.query.check;
    const active = (act == 1 | act == '1') ? true : false ;

    console.log(act)
    
    getCheck(check).update({active},{where:{id}})
    .then(data => {
        res.json({status:true})
    }).catch(err => res.json({status:false}))
})

router.get('/edit-simple',(req,res) => {
    const check = req.query.check,id = req.query.id;

    let model = getCheck(check);

    model.findOne({where:{id}})
    .then(data => {
        const title = getTitle(check);
        const name = data.name;
        return res.render('edit-simple',{
            check:check,id:id,name:name,title
        });
    }).catch(err => res.send(err))
})

router.post('/edit-simple',urlEncoded,(req,res) => {
    const check = req.query.check,id = req.query.id,name = req.query.name;

    let model = getCheck(check);
     model.update(req.body,{where:{id}})
    .then(data => {
        return res.redirect( "/simple-list?check="+check);
    }).catch(err => res.send(err))
})

router.get('/add-simple-par',(req,res) => {

    const check = req.query.check, arr = [];

    Brands.findAll()
    .then(ans => {
        for(let single of ans){
            arr.push(single.dataValues)
        }

        const title = getTitle(check);

        const data = arr;
        return res.render('add-simple-par',{
            data, check, id:5, title
        });
    }).catch(err => res.json({status:false}))
})


router.get('/add-simple',(req,res) => {
    const check = req.query.check,id = req.query.id;

    
function parFunc(Model){
    Model.findAll({attributes:['id','name']})
    .then(data => {
        const title = getTitle(check);
        return res.render('add-simple-par',{
            check,id:5,data,title
        })
    }).catch(err => Helper.goErr(err,res))
}
const title = getTitle(check);
    
    switch(check){
        case "preModel":
            parFunc(Brands)
        break;
        case "model":
            parFunc(PreModels)
        break;
        case "subSensor":
            parFunc(Sensors)
            break;
        case "example":
            parFunc(SubSensors)
            break;
        case "rel_sub":
            parFunc(RelCats)
            break;
        default:
            return res.render('add-simple',{
                check:check,id:id,title
            });
            break;
    }


})

router.post('/add-simple',urlEncoded,(req,res) => {
    const check = req.query.check;

    let model = getCheck(check);

    model.create(req.body)
    .then(data => {
        if(data){
            return res.redirect( "/simple-list?check="+check);
        }
    }).catch(err => res.send(err))
})


router.get('/delete-brand',(req,res) => {
    const id = req.query.id;
    console.log(id)
    Brands.destroy({where:{id}})
    .then(data => {
        res.json({status:true});
    })
    .catch(err => res.send(err))
})

router.post('/delete-simple',(req,res) => {
    const id = req.query.id,check = req.query.check;

    let model = getCheck(check);

    model.destroy({where:{id}})
    .then(data => res.json({status:true}))
    .catch(err => res.send(err))
})


module.exports = router;