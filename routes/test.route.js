const express = require('express');
const router = express.Router();
const csv = require('csv-parser')
const fs = require('fs');
const { Sensors } = require('../back/db/schemas/sensor_master.schema')
const { Brands, PreModels, Models, Engine, Airs, Years } = require('../back/db/schemas/brand_master.schema');
const { NDiagSelectData } = require('../back/db/schemas/ndiag.schema');
const { MDtcCats, MDtcSubCats } = require('../back/db/schemas/mdtc.schema')
const { RelSubCats } = require('../back/db/schemas/related.schema')

const brand = "Mahidra";
/*
fs.createReadStream('data.csv')
.pipe(csv())
.on('data',row => {
    if(row.year.includes('-')){
        const nY = row.year.split('-');
        const f = parseInt( nY[0]), t = parseInt("20"+ nY[1]);
    
        for(let i = f;i<=t; i++){
            const year = ""+i;
            Years.findOne({where:{name:year}})
            .then(data => {
                fullWorker(row,data.id)
            }).catch(err => console.log(err))
        }
    }else{
        Years.findOne({where:{name:row.year}})
        .then(data => {
            fullWorker(row,data.id)
        }).catch(err => console.log(err))
    }
})*/


function fullWorker(row,yearId){
    Brands.findOne({where:{name:brand}})
    .then(data => {
        const brandId = data.id;
        PreModels.findOne({where:{name:row.car,parId:brandId}})
        .then(data => {
            const preModeId = data.id;
            Models.findOne({where:{name:row.model,parId:preModeId}})
            .then(data => {
                const modeId = data.id;
                    Engine.findOne({where:{name:row.engine}})
                    .then(data => {
                        const engineId = data.id;
                        Airs.findOne({where:{name:row.module}})
                        .then(data => {
                            const airId = data.id;

                            MDtcSubCats.findOne({where:{name:row.gen_dtc}})
                            .then(data => {
                                const mdtc_subCatId = data.id, mdtc_catId = data.parId;

                                MDtcSubCats.findOne({where:{name:row.oem}})
                                .then(data => {
                                    const oem_subCatId = data.id, oem_catId = data.parId;
                                    const mainPath = {brandId,preModeId,modeId,engineId,airId,mdtc_catId,mdtc_subCatId,yearId,oem_catId,oem_subCatId};
                                    if(row.related && row.related != ''){
                                        RelSubCats.findOne({where:{name:row.related}})
                                        .then(data => {
                                            const rel_subCatId = data.id, rel_catId = data.parId;

                                            if(row.sensor && row.sensor != ''){
                                                Sensors.findOne({where:{name:row.sensor}})
                                                .then(data => {
                                                    const sensorId = data.id;
                                                    saveData({...mainPath,rel_catId,rel_subCatId,sensorId})
                                                }).catch(err => console.log(err))
                                            }else{
                                                saveData({...mainPath,rel_catId,rel_subCatId})
                                            }
                                        }).catch(err => console.log(err))
                                    }else{
                                        saveData(mainPath)
                                    }
                                }).catch(err => console.log(err))
                            }).catch(err => console.log(err))

                        }).catch(err => console.log(err))
                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
}

function saveData(obj){
    NDiagSelectData.create(obj)
    .then(data => {
        console.log(data)
    }).catch(err => console.log(err))
}



module.exports = router;