const express = require('express');
const router = express.Router();
const { Brands, Models, PreModels, Years, Airs, Engine } = require("../back/db/schemas/brand_master.schema");
const { Sensors, SubSensors, Examples } = require('../back/db/schemas/sensor_master.schema')
const { Imgs } = require('../back/db/schemas/utils.schema')
const { MDtcCats, MDtcSubCats } = require('../back/db/schemas/mdtc.schema')
const {  RelCats  } = require('../back/db/schemas/related.schema')
const { DiagnoCombs, DiagnoDtcData, DiagnoRelatedData, DiagnoPinRelatedData } = require('../back/db/schemas/diagno.schema')
const { uploadImg, uploadStorage } = require('../img.helper')
const bodyParser = require('body-parser');
const MyData = require("./utils.helper");

const urlEncoded = bodyParser.urlencoded({extended:false})

router.post('/add-entry',urlEncoded,(req,res) => {
    const data = {},arr = [];
    const body = req.body;

    for(let key in body){
        let val = body[key];
        body[key] = parseInt(val);
    }

    //console.log(body)

    DiagnoCombs.findOne({where:body})
    .then(check => {
        if(check == null){
            console.log(check)
            DiagnoCombs.create(body)
            .then(data => {
                const combsId = data.id;
        
                return res.render('data-entry',{combsId});
            }).catch(err => res.send(err))
        }else{
            console.log(check)
            return res.redirect('/err-page?errCode=505');
        }
    }).catch(err => {
        return res.redirect('/err-page?errCode=505');
    })
})


router.post('/enter-data',urlEncoded,(req,res) => {

    const combsId = req.query.combsId;
    uploadImg(req,res,() => {   
        const { title, description} = req.body;

            DiagnoDtcData.create({title,description,combsId})
            .then(data => {
                const parId = data.id,img = req.file.path;

                Imgs.create({which:2,img,parId})
                .then(ok => {
                    res.send(ok)
                }).catch(err => res.send(err))
            }).catch(err => res.send(err))
    });
})


router.get('/select-data',(req,res) => {
    const data = {},arr = [];

    arr.push(Brands.findAll().then(ok => data.brand = ok));
    arr.push(Years.findAll().then(ok => data.years = ok));
    arr.push(Airs.findAll().then(ok => data.airs = ok));
    arr.push(Engine.findAll().then(ok => data.engine = ok));
    arr.push(MDtcCats.findAll().then(ok => data.mdtcCats = ok));
    arr.push(RelCats.findAll().then(ok => data.relCats = ok));
    arr.push(Sensors.findAll().then(ok => data.sensors = ok))

    Promise.all(arr)
    .then(ans => {
        return res.render('select-data',{data:data});
    }).catch(err => err)
})

router.get('/select-sensor',(req,res) => {
    const data = {},arr = [];

    arr.push(Brands.findAll().then(ok => data.brand = ok));
    arr.push(Years.findAll().then(ok => data.years = ok));
    arr.push(Airs.findAll().then(ok => data.airs = ok));
    arr.push(Engine.findAll().then(ok => data.engine = ok));
    arr.push(Sensors.findAll().then(ok => data.sensors = ok));

    Promise.all(arr)
    .then(ans => {
        return res.render('select-sensor',{data:data});
    }).catch(err => err)
})

router.post('/edit-entry',urlEncoded,(req,res) => {
    const body = req.body;
    
    for(let key in body){
        let val = body[key];
        body[key] = parseInt(val);
    }

    DiagnoCombs.findOne({where:body})
    .then(data => {
        const id = data.id;
        DiagnoDtcData.findOne({where:{combsId:id}})
        .then(ok => {
            console.log(ok)
            return res.render('edit-entry',ok.dataValues);
        })
    }).catch(err => res.send(err))
})


router.post('/edit-data',(req,res) => {
    const combsId = req.query.combsId;
  
    uploadImg(req,res,() => {

        const { title, description } = req.body;
        DiagnoDtcData.update({title, description},{where:{combsId}})
        .then(data => res.json({status:true}))
        .catch(err => res.send(err))
    });
    
})

router.post('/delete-data',urlEncoded,(req,res) => {
    const body = req.body;
    
    for(let key in body){
        let val = body[key];
        body[key] = parseInt(val);
    }

    DiagnoCombs.findOne({where:body})
    .then(data => {
        const combsId = data.id,id = data.id;

        DiagnoCombs.destroy({where:{id}})
        .then(ok => {
            DiagnoDtcData.destroy({where:{combsId}})
            .then(yes => res.json({status:true}))
            .catch(err => res.send(err))
        }).catch(err => res.send(err))
    }).catch(err => res.send(err))
});
/*
router.get('/add-related-data',(req,res) => {
    const combsId = req.query.combsId;
    return res.render('related-data',{combsId});
})

router.post('/add-related-data',(req,res) => {
    const combsId = req.query.combsId;
    
    uploadImg(req,res,() => {
        const body = req.body;    

        DiagnoRelatedData.create({...body,combsId})
        .then(data => {
            const parId = data.id,img = req.file.path;
            Imgs.create({which:3,img,parId})
                .then(ok => {
                    res.send(ok)
            }).catch(err => res.send(err))            
        }).catch(err => res.send(err))
    });
})

router.get('/edit-related-data',(req,res) => {
    const combsId = req.query.combsId;

    DiagnoRelatedData.findOne({where:{combsId}})
    .then(data => {
        const ok = data.dataValues;
        return res.render('edit-related-data',{...ok,combsId});
    }).catch(err => res.send(err))
})

router.post('/edit-related-data',(req,res) => {
    const combsId = req.query.combsId;

    uploadImg(req,res,() => {
        const body = req.body;

        DiagnoRelatedData.update(body,{where:{combsId}})
        .then(data => {
            return res.json({status:true})
        }).catch(err => res.send(err))
    });
})

router.delete('/delete-related-data',(req,res) => {
    const combsId = req.query.combsId;

    DiagnoPinRelatedData.destroy({where:{combsId}})
    .then(ok => {
        res.json({status:true})
    }).catch(err => res.send(err))
})*/

router.get('/add-pin-related-data',(req,res) => {
    const combsId = req.query.combsId;

    return res.render('add-pin-related-data',{combsId});
})

router.post('/add-pin-related-data',uploadStorage.single("file"),(req,res) => {
    const combsId = req.query.combsId,pdf = req.file.path;

    DiagnoPinRelatedData.create({pdf,combsId})
    .then(data => res.json({status:true}))
    .catch(err => res.json({status:false}))
})

router.get('/edit-pin-related-data',(req,res) => {
    const combsId = req.query.combsId;

    DiagnoPinRelatedData.update({combsId})
    .then(data => {
        return res.render('add-pin-related-data',data);
    }).catch(err => res.send(err))
})

router.post('/edit-pin-related-data',(req,res) => {
    
})

router.delete('/delete-pin-related-data',(req,res) => {
    const combsId = req.query.combsId;

    DiagnoPinRelatedData.destroy({where:{combsId}})
    .then(data => res.json({status:true}))
    .catch(err => res.json({status:false}))
})



router.get('/diagno-sensor-select',(req,res) => {
    const data = {},arr = [];

    arr.push(Brands.findAll().then(ok => data.brand = ok));
    arr.push(PreModels.findAll().then(ok => data.preModels = ok));
    arr.push(Models.findAll().then(ok => data.models = ok));
    arr.push(Years.findAll().then(ok => data.years = ok));
    arr.push(Airs.findAll().then(ok => data.airs = ok));
    arr.push(Sensors.findAll().then(ok => data.sensors = ok))

    Promise.all(arr)
    .then(ans => {
        return res.render('diagno-sensor-selector',{data:data});
    }).catch(err => err)  
})


module.exports = router;