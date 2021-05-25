const express = require('express');
const router = express.Router();
const Helper = require('./utils.helper')
const bodyParser = require('body-parser');
const { NDiagSelectData, NDiagSelectSensor, NDiagnoSensorData, NDiagDataModule, NDiagSensorModule } = require('../back/db/schemas/ndiag.schema')
const { Brands, Models, PreModels, Years, Airs, Engine } = require('../back/db/schemas/brand_master.schema')
const { Sensors, SubSensors, Examples } = require('../back/db/schemas/sensor_master.schema') 
const { RelCats, RelSubCats } = require('../back/db/schemas/related.schema')
const { MDtcCats, MDtcSubCats, MDtcData } = require('../back/db/schemas/mdtc.schema')
const { uploadStorage } = require('../img.helper');
const { goErr } = require('./utils.helper');
const Sequelize = require('sequelize')

const csv = require('csv-parser')
const fs = require('fs');
const { resolve } = require('path');

const urlEncoded = bodyParser.urlencoded({extended:false})


router.post('/select-ndiag-data',urlEncoded,(req,res) => {
    const body = req.body;

    Helper.convertInt(body)

    NDiagSelectData.findOne({where:body})
    .then(is => {
        if(!is){
            NDiagSelectData.create(body)
            .then(data => {
                res.redirect("/select-data")
            }).catch(err => Helper.goErr(err,res))
        }else{
            Helper.goErr("err",res)
        }
    }).catch(err => Helper.goErr(err,res))
})

router.post('/edit-ndiag-data',urlEncoded,(req,res) => {
    const body = req.body;


    console.log(body)
    Helper.convertInt(body);

    NDiagSelectData.findOne({where:body})
    .then(yes => {
        if(yes){
            const id = yes.id;

            Helper.brToMdtc(yes)
            .then(obj => {
                const data = obj.ans, selected = obj.selected;
                
                return res.render('update-select-data',{data, selected, id})
            }).catch(err => Helper.goErr(err,res))
        }else{
            Helper.goErr("nothing",res)
        }
    }).catch(err => Helper.goErr(err,res))
})

router.post('/edit-ndiag-data-r',urlEncoded,(req,res) => {
    const id = parseInt( req.query.id), body = req.body;

    Helper.convertInt(body);
    
    NDiagSelectData.update(body,{where:{id}})
    .then(data => res.json(data))
    .catch(err => Helper.goErr(err,res))

})

router.post('/delete-ndiag-data',urlEncoded,(req,res) => {
    const body = req.body;

    Helper.convertInt(body)

    NDiagSelectData.findOne({where:body})
    .then(data => {
        if(data){
            const id = data.id;

            NDiagSelectData.destroy({where:{id}})
            .then(yes => res.json(yes))
            .catch(err => Helper.goErr(err,res))
        }else{
            Helper.goErr("nothing",res)
        }
    }).catch(err => Helper.goErr(err,res))
})

router.post('/select-ndiag-sensor',urlEncoded,(req,res) => {
    const body = req.body;

    NDiagSelectSensor.findAll({where:body})
    .then(can => {
        if(can.length<1){
            NDiagSelectSensor.create(body)
            .then(data => {
                req.session.selectSensorId = data.id;

                
                return res.render('diagno-sensor-data');

                
            }).catch(err => Helper.goErr(err,res)) 
        }else{
            Helper.goErr(can,res)
        }
    }).catch(err => Helper.goErr(err,res))
})
router

router.post('/ndiagno-sensor-data',uploadStorage.single("file"),(req,res) => {
    const selectId = req.session.selectSensorId, pdf = req.file.path;

    NDiagnoSensorData.create({selectId,pdf})
    .then(data => res.redirect('/select-sensor'))
    .catch(err => Helper.goErr(err,res))
})

router.post('/update-ndiagno-sensor-data',urlEncoded,(req,res) => {
    const body = req.body;

    NDiagSelectSensor.findOne({where:body})
    .then(can => {
        if(can){
                req.session.selectSensorId = can.id, id = can.id;
                return res.render('update-select-sensor',{id});
        }else{
            Helper.goErr("err",res)
        }
    }).catch(err => Helper.goErr(err,res))
})


router.post('/update-ndiagno-sensor-data-r',uploadStorage.single("file"),(req,res) => {
    const selectId = req.session.selectSensorId, pdf = req.file.path;
    console.log(pdf)

    NDiagnoSensorData.update({pdf},{where:{selectId}})
    .then(data => res.redirect('/select-sensor'))
    .catch(err => Helper.goErr(err,res))
})


router.post('/delete-ndiagno-sensor-data',urlEncoded,(req,res) => {
    const body = req.body;

    Helper.convertInt(body);

    NDiagSelectSensor.findOne({where:body})
    .then(is => {
        if(is){
            const arr = [],  selectId = is.id, id = is.id;

            arr.push(NDiagSelectSensor.destroy({where:{id}}))
            arr.push(NDiagnoSensorData.destroy({where:{selectId}}))

            Promise.all(arr)
            .then(data => res.redirect('/select-sensor'))
            .catch(err => Helper.goErr(err,res))
        }else{
            Helper.goErr(is,res)
        }
    }).catch(err => Helper.goErr(err,res))
})

let mres ,mcount = 0;

router.post('/upload-ndiagno-csv',uploadStorage.single("file"),async (req,res) => {
    const brandId = req.body.brandId,path = req.file.path;
    mres = res;
    const marr = [];

    await fs.createReadStream(path)
    .pipe(csv())
    .on('data',async row => {
        marr.push(row)
    }).on('end',async function(){
        

        res.send("file uploaded successfully working....")
        

        await marr.map(async (row,nt) => {
            setTimeout(async function(){

                console.log("row start"+nt)
                if(row.year.includes('-')){
                    const nY = row.year.split('-');
                    const f = parseInt( nY[0]), t = parseInt("20"+ nY[1]);
        
                    const arr = [];
        
                    for(let i = f;i<=t; i++){
                        const year = ""+i;
                            await createOrFind(Years,{name:year})
                            .then(async data => {
                                //index+=10000;
                                //arr.push(fullWorker(row,data.id,brandId))
                                //console.log(index)
                                await fullWorker(row,data.id,brandId);
                            }).catch(err => console.log(err))
                        
                    }
        
                    marr.push(row)
        
                }else{
                   await Years.findOne({where:{name:row.year,brandId}})
                    .then(async data => {
                       await fullWorker(row,data.id)
                    }).catch(err => console.log(err))
                }
    
            },nt*10000)
        
        })
    });

    console.log(row)
})

async function fullWorker(row,yearId,brandId){




   await createOrFind(PreModels,{name:row.car,parId:parseInt(brandId)})
    .then(async data => {
        const preModeId = data.id;
        //console.log("row stop "+mcount++)
        //resolve(data)
       await createOrFind(Models,{name:row.model,parId:preModeId})
        .then(async data => {
            const modeId = data.id;
            await createOrFind(Engine,{name:row.engine})
                .then(async data => {
                    
                    const engineId = data.id;
                    await createOrFind(Airs,{name:row.module})
                    .then(async data => {
                        const airId = data.id;

                       

                        const q = {brandId,preModeId,modeId,engineId,yearId,airId};
                        await updateOrCreate(row,q)
                        .then(data => {
                            //console.log(data)
                        }).catch(err => console.log(err))

                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
            }).catch(err => console.log(err))

        }).catch(err => console.log(err))


}

async function updateOrCreate(row,q){
    return await new Promise(async (resolve,reject) => {
        await NDiagSelectData.findOne({where:q})
        .then(async data => {
            await getHerIdis(row)
            .then(async bdata => {
                if(data){
                    await NDiagSelectData.update(bdata,{where:q})
                    .then(data => resolve(data))
                }else{
                   await  NDiagSelectData.create({...bdata,...q})
                    .then(data => resolve(data))
                }
            })
        }).catch(err => console.log(err))
    })
}

async function getHerIdis(row){
    return await new Promise(async (resolve,reject) => {
        await MDtcSubCats.findOne({where:{name:row.gen_dtc}})
            .then(async data => {
                const mdtc_subCatId = data.id, mdtc_catId = data.parId;

                await MDtcSubCats.findOne({where:{name:row.oem}})
                .then(async data => {
                    const oem_subCatId = data.id, oem_catId = data.parId;

                    if(row.related && row.related != ''){
                        RelSubCats.findOne({where:{name:row.related}})
                        .then(async data => {
                            const rel_subCatId = data.id, rel_catId = data.parId;

                            console.log(rel_catId)
                            await resolve({mdtc_subCatId,mdtc_catId,oem_subCatId,oem_catId,rel_catId,rel_subCatId})
                        });
                    }else{
                        await resolve({mdtc_subCatId,mdtc_catId,oem_subCatId,oem_catId})
                    }
                    
                })
            })
    })
}

async function createOrFind(Model,query){
    return await new Promise(async (resolve,reject) => {
        //console.log(query)
        await Model.findOne({where:query})
        .then(async data => {
            if(data){
               await  resolve(data);
            }else{
               await  Model.create(query)
                .then(data => {
                   // console.log(data.name)
                    resolve(data)
                }).catch(err => reject(err))
            }
        }).catch((err => reject(err)))
    })
}

function saveData(obj){
    NDiagSelectData.create(obj)
    .then(data => {
        mres.send(data)
        console.log(data)
    }).catch(err => console.log(err))
}

module.exports = router;