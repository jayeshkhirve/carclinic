const express = require('express');
const router = express.Router();
const { RelatedData,RelCats, RelSubCats } = require('../back/db/schemas/related.schema')
const { uploadImg } = require('../img.helper')
const Helper = require("./utils.helper")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('/related-data-list',(req,res) => {
    const query = req.query;

    for(let key in query){
        let val = query[key];
        query[key] = parseInt(val);
    }


    const arr = [], data = {};

    arr.push(RelCats.findAll().then(ok => data.cats = ok))
    arr.push(RelSubCats.findAll().then(ok => data.subCats = ok))
    
    Promise.all(arr)
    .then(succ => {
        RelatedData.findAll(query)
        .then(ndata => {
            res.render('related-data-list',{data})
        }).catch(err => res.send(err))
    })

})

router.get('/rel-data-list',(req,res) => {
    Helper.convertInt(req.query);
    const catId = req.session.relCatId, subId = (req.query.subId) ? req.query.subId : req.session.subId;
    if(subId){
        req.session.subId = subId;
    }

    const query = Helper.init(req);
    RelatedData.findAll({...query,where:{catId,subId}})
    .then(data => {
        console.log(catId+"   "+subId)
        res.send(data)
    }).catch(err => Helper.goErr(err,res))
})


router.get("/rel-sub-cats",(req,res) => {
    Helper.convertInt(req.query)
    req.session.relCatId = req.query.relCatId;
    const parId = req.query.relCatId;
    RelSubCats.findAll({where:{parId},attributes:['id','name']})
    .then(data => res.json(data))
    .catch(err => Helper.goErr(err,res))
})

router.get('/add-related-data',(req,res) => {
    RelCats.findAll()
    .then(data => {
        return res.render('add-related-data',{data})
    }).catch(err => Helper.goErr(err,res))
})

router.post('/add-related-data',(req,res) => {
    uploadImg(req,res,(file) => {
        const body = req.body;
        if(file){
            body['img'] = file.path;
        }

        RelatedData.create(body)
        .then(data => {
            res.redirect('/related-data-list')
        }).catch(err => res.send(err))
    })
})

router.get('/edit-related-data',(req,res) => {
    const id = req.query.id;

    RelatedData.findOne({where:{id}})
    .then(data => {
        const arr = [],data1 = {},catId = data.catId, subId = data.subId;

        arr.push(RelCats.findOne({where:{id:catId}}).then(ok => data1.cat = ok))
        arr.push(RelSubCats.findOne({where:{id:subId}}).then(ok => data1.sub = ok))
        
        Promise.all(arr)
        .then(succ => {
            return res.render('edit-related-data',{data,data1})
        }).catch(err => Helper.goErr(err,res))

    }).catch(err => Helper.goErr(err,res))
})

router.post('/edit-related-data',(req,res) => {
    const id = req.query.id;

    uploadImg(req,res,(file) => {
        const body = req.body;

        if(file){
            body.img = file.path;
        }

        RelatedData.update(body,{where:{id}})
        .then(data => {
            
            return res.redirect('/related-data-list')
        }).catch(err => Helper.goErr(err,res))
    })
})

router.get('/filter-rel-data',(req,res) => {
   Helper.init(req)
    const catId = req.query.catId, subId = req.query.subId, obj = req.session.obj;

    if(!obj.where){
        obj.where = {}
    }
    obj.where["catId"] = catId;
    obj.where["subId"] = subId;

    RelatedData.findAll(obj)
    .then(data => {
        res.json(data)
    }).catch(err => Helper.goErr(err,res))
})

router.get('/rel-search',(req,res) => {
    const term = req.query.term, catId = req.session.relCatId, subId = req.session.subId;
    RelatedData.findAll({where:{catId,subId,title:{[Op.like]: term + "%"}}})
    .then(data => {
        console.log(data);
        res.json(data)
    })
    .catch(err => Helper.goErr(err,res))
})

Helper.actdect(router,'/aactdect-rel',RelatedData)
Helper.delete(router,"/del-rel-item",RelatedData)
Helper.next(router,"/rel-next-prev",RelatedData)

router.get('/edit-related-data',(req,res) => {
    const id = req.query.id;

    
})

module.exports = router;