const express = require('express');
const router = express.Router();
const { Brands, Models, PreModels, Years, Airs, Engine } = require("../../back/db/schemas/brand_master.schema");
const { Sensors, SubSensors, Examples,  } = require('../../back/db/schemas/sensor_master.schema')
const ApiHelper = require('../api.helpers');
const Helper = require('../utils.helper')
const { NDiagSelectData, NDiagSelectSensor } = require('../../back/db/schemas/ndiag.schema')
const { MDtcData } = require('../../back/db/schemas/mdtc.schema')
const { MainDataCombs, DataEcuCombs, DataSensorCombs, DataWiringManual, DataEcu,DataSensor } = require('../../back/db/schemas/data.schema')
const { RelatedData } = require('../../back/db//schemas/related.schema')
const { MainImage } = require('../../back/db/schemas/utils.schema')

function getWhich(which){
    let model;
    switch(which){
        case "brands":
            model = Brands;
            break;
        case "model":
            model = Models;
            break;
        case "preModel":
            model = PreModels;
            break;
        case "year":
            model = Years;
            break;
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

router.get('/getHome',(req,res) => {
    MainImage.findOne({where:{id:1}})
    .then(data => {
        if(data){
            const image = data.image
            res.json({image})
        }else{
            res.json({image:""});
        }

    }).catch(err => res.send(err))
})

router.get('/jio',(req,res) => {
    res.send("Hello")
})

router.get('/list/:which', (req,res) => {
	console.log(req.query);
    Helper.convertInt(req.query)
    ApiHelper. getByQuery(getWhich(req.params.which),req,res)
});
router.get("/nlist/:which", (req, res) => {
    const which = req.params.which,
        parId = parseInt(req.query.parId);
    let model,
        query = req.query,
        brandId = parseInt(query.brandId);

    switch (which) {
        case "brands":
            Brands.findAll()
                .then((data) => res.json(data))
                .catch((err) => res.send(err));
            break;
        case "preModel":
            NDiagSelectData.findAll({ where: { brandId }, attributes: ["preModeId"] })
                .then((data) => {
                    //  console.log(data)
                    const arr = [],
                        narr = [],
                        ids = [];

                    data.map((single) => {
                        if (!ids.includes(single.preModeId)) {
                            arr.push(
                                PreModels.findOne({ where: { id: single.preModeId } }).then((ok) => {
                                    const id = ok.id;
                                    let b = false;
                                    narr.map((s) => {
                                        if (s.id == id) {
                                            b = true;
                                        }
                                    });

                                    if (!b) {
                                        narr.push(ok);
                                    }
                                })
                            );
                            ids.push(single.preModeId);
                        }
                    });

                    Promise.all(arr).then((succ) => {
                        res.json(narr);
                    });
                })
                .catch((err) => res.send(err));
            break;
        case "model":
            NDiagSelectData.findAll({ where: { brandId: parseInt(query.brandId), preModeId: parseInt(query.preModeId) }, attributes: ["modeId"] })
                .then((data) => {
                    const arr = [],
                        narr = [],
                        ids = [];
                    data.map((single) => {
                        if (!ids.includes(single.modeId)) {
                            arr.push(
                                Models.findOne({ where: { id: single.modeId } }).then((ok) => {
                                    const id = ok.id;
                                    let b = false;
                                    narr.map((s) => {
                                        if (s.id == id) {
                                            b = true;
                                        }
                                        //console.log(ok)
                                    });

                                    if (!b) {
                                        narr.push(ok);
                                    }
                                })
                            );
                            ids.push(single.modeId);
                        }
                    });

                    Promise.all(arr).then((succ) => {
                        res.json(narr);
                    });
                })
                .catch((err) => res.send(err));
            break;
        case "year":
            NDiagSelectData.findAll({ where: { brandId: parseInt(query.brandId), preModeId: parseInt(query.preModeId), modeId: parseInt(query.modeId) }, attributes: ["yearId"] }).then((data) => {
                const arr = [],
                    narr = [],
                    ids = [];
                data.map((single) => {
                    if (!ids.includes(single.yearId)) {
                        arr.push(
                            Years.findOne({ where: { id: single.yearId } }).then((ok) => {
                                const id = ok.id;

                                let b = false;
                                narr.map((s) => {
                                    if (s.id == id) {
                                        b = true;
                                    }
                                });

                                if (!b) {
                                    console.log(id);
                                    narr.push(ok);
                                }
                            })
                        );
                        ids.push(single.yearId);
                    }
                });

                Promise.all(arr).then((succ) => {
                    //console.log(narr);
                    res.json(narr);
                });
            }); //.catch(err => res.send(err))
            break;
        case "engine":
            NDiagSelectData.findAll({ where: { brandId: parseInt(query.brandId), preModeId: parseInt(query.preModeId), modeId: parseInt(query.modeId), yearId: parseInt(query.yearId) }, attributes: ["engineId"] })
                .then((data) => {
                    const arr = [],
                        narr = [],
                        ids = [];
                    data.map((single) => {
                        if (!ids.includes(single.engineId)) {
                            arr.push(
                                Engine.findOne({ where: { id: single.engineId } }).then((ok) => {
                                    const id = ok.id;
                                    let b = false;
                                    narr.map((s) => {
                                        if (s.id == id) {
                                            b = true;
                                        }
                                    });

                                    if (!b) {
                                        narr.push(ok);
                                    }
                                })
                            );
                            ids.push(single.engineId);
                        }
                    });

                    Promise.all(arr).then((succ) => {
                        res.json(narr);
                    });
                })
                .catch((err) => res.send(err));
            break;
        case "airs":
            NDiagSelectData.findAll({
                where: { engineId: parseInt(query.engineId), brandId: parseInt(query.brandId), preModeId: parseInt(query.preModeId), modeId: parseInt(query.modeId), yearId: parseInt(query.yearId) },
                attributes: ["airId"],
            })
                .then((data) => {
                    const arr = [],
                        narr = [],
                        ids = [];
                    data.map((single) => {
                        if (!ids.includes(single.preModeId)) {
                            arr.push(
                                Airs.findOne({ where: { id: single.airId } }).then((ok) => {
                                    const id = ok.id;
                                    let b = false;
                                    narr.map((s) => {
                                        if (s.id == id) {
                                            b = true;
                                        }
                                    });

                                    if (!b) {
                                        narr.push(ok);
                                    }
                                })
                            );
                            ids.push(single.airId);
                        }
                    });

                    Promise.all(arr).then((succ) => {
                        res.json(narr);
                    });
                })
                .catch((err) => res.send(err));
            break;
    }
});


router.get('/dwlist',(req,res) => {
    
})


router.get('/dtc/select',(req,res) => {
    console.log(req.query);
    Helper.convertInt(req.query)
	
    
    NDiagSelectData.findOne({where:req.query})
    .then(data => {
        if(data){
            ApiHelper.sendJson(res,data.dataValues,true)
        }else{
            ApiHelper.sendJson(res,null,false)
        }
    }).catch(err => ApiHelper.sendJson(res,null,false))
})

router.get('/dtc/code',(req,res) => {
   
    const dtcId = parseInt( req.query.dtcId), code = req.query.code;

    NDiagSelectData.findOne({where:{id:dtcId}})
    .then(dtcselect => {
        const {mdtc_catId,mdtc_subCatId} = dtcselect;


        function sPlan(){
            const {oem_catId,oem_subCatId} = dtcselect;

            ApiHelper.getOneC(MDtcData,{catId:oem_catId,subId:oem_subCatId,title:code},res)
        }

        MDtcData.findOne({where:{catId:mdtc_catId,subId:mdtc_subCatId,title:code}})
        .then(data => {
            if(data){
                ApiHelper.sendJson(res,data.dataValues,true)
            }else{
                sPlan()
            }
        }).catch(err => sPlan())
    }).catch(err => ApiHelper.sendJson(res,null,false))
})



router.get('/data/wiring',(req,res) => {
    Helper.convertInt(req.query);

    MainDataCombs.findOne({where:req.query})
    .then(select => {
        
        if(select){
            const combsId = select.id;

            DataWiringManual.findOne({where:{combsId}})
            .then(data => ApiHelper.sendJson(res,data.dataValues,true))
            .catch(err => ApiHelper.sendJson(res,null,false))
        }else{
            ApiHelper.sendJson(req,null,false)
        }
    }).catch(err => ApiHelper.sendJson(res,null,false))
})

router.get('/data/ecu',(req,res) => {
    Helper.convertInt(req.query);

    DataEcuCombs.findOne({where:req.query})
    .then(select => {
        if(select){
            const combsId = select.id;

            DataEcu.findOne({where:{combsId}})
            .then(data => ApiHelper.sendJson(res,data.dataValues,true))
            .catch(err => ApiHelper.sendJson(res,null,false))
        }else{
            ApiHelper.sendJson(req,null,false)
        }
    }).catch(err => ApiHelper.sendJson(res,null,false))
})

router.get('/data/sensor',(req,res) => {
    Helper.convertInt(req.query);

    DataSensorCombs.findOne({where:req.query})
    .then(select => {
        if(select){
            const combsId = select.id;

            DataSensor.findOne({where:{combsId}})
            .then(data => ApiHelper.sendJson(res,data.dataValues,true))
            .catch(err => ApiHelper.sendJson(res,null,false))
        }else{
            ApiHelper.sendJson(req,null,false)
        }
    }).catch(err => ApiHelper.sendJson(res,null,false))
})


router.get('/related/titles',(req,res) => {
	Helper.convertInt(req.query);
	
	RelatedData.findAll({where:req.query,attributes:['id','title']})
	.then(data => {
		res.json(data);
	}).catch(err => res.send(err));
});

router.get('/related/data',(req,res) => {
    Helper.convertInt(req.query);

    RelatedData.findOne({where:req.query})
    .then(data => {
        ApiHelper.sendJson(res,data,true)
    }).catch(err => ApiHelper.sendJson(res,null,false))
})



module.exports = router;
