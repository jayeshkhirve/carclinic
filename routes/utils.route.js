const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Helper = require('./utils.helper')
const { Brands, PreModels, Models } = require('../back/db/schemas/brand_master.schema')
const { Sensors, SubSensors, Examples } = require('../back/db/schemas/sensor_master.schema')
const { MDtcCats, MDtcSubCats } = require('../back/db/schemas/mdtc.schema')
const { RelCats, RelSubCats } = require('../back/db/schemas/related.schema')
const { uploadStorage } = require('../img.helper');
const { MainImage } = require('../back/db/schemas/utils.schema');

function chooser(which){
    let model = null;
    
    switch(which){
        case "brand":
            model = PreModels;
            break;
        case "preModel":
            model = Models;
            break;
        case "sensor":
            model = SubSensors;
            break;
        case "subSensor":
            model = Examples;
            break;
        case "mdtcCat":
            model = MDtcSubCats;
            break;
        case "relCats":
            model = RelSubCats;
            break;
    }

    return model;
}

router.get('/get-sub-options',(req,res) => {
    const parId = parseInt( req.query.parId);
    chooser(req.query.which).findAll({where:{parId}})
    .then(data => {
        res.json(data);
    }).catch(err => Helper.goErr(err,res))
})


router.get('/err-page',(req,res) => {
    const errCode = req.query.errCode;
    return res.render('error-page',{errCode});
})

router.get('/show-image',(req,res) => {
    MainImage.findOne({where:{id:1}})
    .then(data => {
        if(data){
            const image = data.image
            res.render('main-image',{image});
        }else{
            res.render('main-image',{image:""});
        }

    }).catch(err => res.send(err))
})

router.post('/edit-image',uploadStorage.single('profile_pic'),(req,res) => {
    const image = req.file.path;

    MainImage.findOne({where:{id:1}})
    .then(data => {
        if(data){
            MainImage.update({image},{where:{id:1}})
            .then(data => {
                res.redirect('/show-image');
            }).catch(err => res.send(err))
        }else{
            MainImage.create({image})
            .then(data => {
                res.redirect('/show-image');
            }).catch(err => res.send(err))
        }
    }).catch(err => res.send(err))
})

module.exports = router;