const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { Brands, Models, PreModels, Years, Airs, Engine } = require("../back/db/schemas/brand_master.schema");
const { Sensors, SubSensors, Examples,  } = require('../back/db/schemas/sensor_master.schema')
const { DataEcu, DataSensor, MainDataCombs, DataWiringManual, DataEcuCombs, DataSensorCombs, DataEcuModule, DataWiringModule } = require("../back/db/schemas/data.schema")
const { uploadStorage } = require('../img.helper')
const Helper = require('./utils.helper')

const urlEncoded = bodyParser.urlencoded({extended:false})

function getWhich(which){
    let model ;

    switch(which){
        case "wiring":
            model = DataWiringManual;
            break
        case "ecu":
            model = DataEcu;
            break;
    }

    return model;
}

function getWhichComb(which){
    let model ;

    switch(which){
        case "wiring":
            model = MainDataCombs;
            break
        case "ecu":
            model = DataEcuCombs;
            break;
    }

    return model;
}

router.get('/select-main-data',(req,res) => {
    const which = req.query.which;

    const data = {},arr = [];

    arr.push(Brands.findAll().then(ok => data.brand = ok));
    arr.push(Airs.findAll().then(ok => data.airs = ok));
    arr.push(Years.findAll().then(ok => data.years = ok));
    arr.push(Engine.findAll().then(ok => data.engine = ok));

    Promise.all(arr)
    .then(ans => {
        return res.render('select-main-data',{data:data,which});
    }).catch(err => err)
})

router.post('/add-main-data-ejs',urlEncoded,(req,res) => {
    const which = req.query.which,body = req.body;

    Helper.convertInt(body)

    getWhichComb(which).findOne({where:body})
    .then(check => {

        if(check == null){
            getWhichComb(which).create(req.body)
            .then(data => {
                const combsId = data.id;
                return res.render('add-main-data',{which,combsId});
            }).catch(err => res.json({status:false}))
        }else{
            Helper.goErr("err",res);
        }
    }).catch(err => Helper.goErr(err,res));

})

router.post('/add-main-data',uploadStorage.single('file'),(req,res) => {
    const which = req.query.which,combsId = req.query.combsId, description = req.file.path;

    let model = getWhich(which);

    console.log(description)

    getWhich(which).create({description,combsId})
    .then(data => res.redirect('/select-main-data?which='+which))
    .catch(err => res.json({status:false}))
})

router.post('/edit-main-data-ejs',urlEncoded,(req,res) => {
    const which = req.query.which,body = req.body;
    

    getWhichComb(which).findOne({where:body})
    .then(ok => {
        const combsId = ok.id, id = ok.id;

        getWhich(which).findOne({where:{combsId}})
        .then(data => {
       
            const description = data.description;
            return res.render('edit-main-data',{which,combsId, description});
        }).catch(err => Helper.goErr(err,res))
    }).catch(err => res.send({status:false}))
})

router.post('/edit-main-data',uploadStorage.single('file'),(req,res) => {
    const which = req.query.which,combsId = req.query.combsId,description = req.file.path;


    getWhich(which).update({description},{where:{combsId}})
    .then(data => {
    
        res.redirect('/select-main-data?which='+which)
    }).catch(err => res.json({status:false}))
})

router.post('/delete-main-data',urlEncoded,(req,res) => {
    const which = req.query.which, body = req.body;

    
    Helper.convertInt(body)
    
    getWhichComb(which).findOne({where:body})
    .then(ok => {
        const id = ok.id,combsId = ok.id;
        getWhichComb(which).destroy({where:{id}})
        .then(succ => {
            getWhich(which).destroy({where:{combsId}})
            .then(data => res.redirect('/select-main-data?which='+which))
            .catch(err => res.send(err))
        }).catch(err =>  res.send(err))
    }).catch(err => res.send(err))
})


router.get('/select-sensor-data',(req,res) => {
    const arr = [], data = {};

    arr.push(Sensors.findAll().then(ans => data.sensors = ans))

    Promise.all(arr)
    .then(bata => {
        return res.render('select-sensor-data',{data});
    }).catch(err => res.send(err))
})

router.post('/add-sensor-data-ejs',urlEncoded,(req,res) => {
    const body = req.body;

    Helper.convertInt(body)


    DataSensorCombs.findOne({where:body})
    .then(check => {
        if(check == null){
            DataSensorCombs.create(body)
            .then(data => {
                const combsId = data.id;
                return res.render('add-sensor-data',{combsId});
            }).catch(err => res.send(err))
        }else{
            return res.redirect('/err-page?errCode=505');
        }
    }).catch(err => {
        return res.redirect('/err-page?errCode=505');
    })
})

router.post('/add-sensor-data',urlEncoded,(req,res) => {
    const combsId = req.query.combsId,pdf = req.body.description;

    DataSensor.create({pdf,combsId})
    .then(data => res.redirect("/select-sensor-data"))
    .catch(err  => res.send(err))
})

router.post('/edit-sensor-data-ejs',urlEncoded,(req,res) => {
    const body = req.body;
    Helper.convertInt(body)

    DataSensorCombs.findOne({where:body})
    .then(data => {
        const combsId = data.id;
        DataSensor.findOne({where:{combsId}})
        .then(ndata => {
            return res.render('edit-sensor-data',{combsId,ndata});
        }).then(err => res.send(err)) 
    }).catch(err => res.send(err))
})

router.post('/edit-sensor-data',urlEncoded,(req,res) => {
    const combsId = req.query.combsId, pdf = req.body.description;
    DataSensor.update({pdf},{where:{combsId}})
    .then(data => {
         return res.redirect('/select-sensor-data')
    }).catch(err => res.send(err))
})

router.post('/delete-sensor-data',urlEncoded,(req,res) => {
    const body = req.body;

    Helper.convertInt(body);

    DataSensorCombs.findOne({where:body})
    .then(data => {
        if(data){
            const id = data.id;

            DataSensorCombs.destroy({where:{id}})
            .then(succ => {
                return res.redirect('/select-sensor-data')
            }).catch(err => Helper.goErr(err,res))
        }else{
            Helper.goErr("err",res)
        }
    }).catch(err => Helper.goErr(err,res))
})

/*
router.post('/delete-ndiag-data',(req,res) => {
    const body = req.body;

    Helper.convertInt(body);

    DataSensorCombs.findOne({where:body})
    .then(ok => {
        const id = ok.id, combsId = ok.id, arr = [];

        DataSensorCombs.destroy({where:{id}})
        .then(comb => {
            DataSensor.destroy({where:{combsId}})
            .then(succ => res.json(succ))
            .catch(err => Helper.goErr(err,res))
        }).catch(err => Helper.goErr(err,res))
    }).catch(err => Helper.goErr(err,res))
})*/
module.exports = router;