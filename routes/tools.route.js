const express = require('express');
const router = express.Router();
const { Brands, Models, PreModels, Years, Airs } = require("../back/db/schemas/brand_master.schema");
const { Sensors, SubSensors, Examples } = require('../back/db/schemas/sensor_master.schema')
const Sequelize = require('sequelize')
const { MDtcCats } = require('../back/db/schemas/mdtc.schema')
const Op = Sequelize.Op;

const getCheck = (check) => {

    let model = null;

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
        case "brand":
            model = Brands;
            break;
    }

    return model;
}

router.get('/search-term',(req,res) => {
    const term = req.query.term, check = req.query.check;

    getCheck(check).findAll({where:{ name: { [Op.like]: term + "%" } }})
    .then(data => {
        res.json(data)
    }).catch(err => res.send(err))
})

router.get('/search-term-oem',(req,res) => {
    const parId = req.session.parId, term = req.session.term;

    MDtcCats.findAll({where:{parId,name:term},attributes:['name']})
    .then(data => {
        res.json(data)
    }).catch(res.json({status:false}))
})

module.exports = router;