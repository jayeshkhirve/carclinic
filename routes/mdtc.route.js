const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { MDtcCats, MDtcSubCats, MDtcData } = require('../back/db/schemas/mdtc.schema')
const { uploadImg, uploadStorage } = require('../img.helper')
const Helper = require('./utils.helper')
const Filter = require('./Filter.helper')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const csv = require('csv-parser');
const fs = require('fs');

Helper.search(router,"/mdtc-cat-search","name",MDtcCats);
Helper.delete(router,"/mdtc-delete-cat",MDtcCats)



const urlEncoded = bodyParser.urlencoded({extended:false})

const goErr = (err,res) => {
    return res.redirect('/err-page');
}

router.get('/mdtc-cats-list',(req,res) => {

    const obj = Filter.init(req,"mdtccat")
    
    MDtcCats.findAll(req.session["mdtccat"])
    .then(data => {
        return res.render('mdtc-cat-list',{data})
    }).catch(err => Helper. goErr(err,res))
})

router.get('/add-mdtc-cat',(req,res) => {
    return res.render('mdtc-add-cat')
})

Helper.search(router,"/mdtc-cat-search","name",MDtcCats);
Helper.actdect(router,"/mdtc-cat-actdect",MDtcCats);

Helper.search(router,"/mdtc-sub-search","name",MDtcSubCats);
Helper.actdect(router,"/mdtc-sub-actdect",MDtcSubCats);
Helper.delete(router,"/mdtc-delete-sub",MDtcSubCats)

router.post('/add-mdtc-cat',urlEncoded,(req,res) => {
    const body = req.body;
    
    MDtcCats.create(body)
    .then(data => {
        res.redirect('/mdtc-cats-list')
    }).catch(err => goErr(err,res))
})

router.get('/mdtc-sub-cat-list',(req,res) => {
    const obj = Filter.init(req,"mdtc_sub")

    MDtcSubCats.findAll(req.session["mdtc_sub"])
    .then(data => {
        res.render('mdtc-sub-cat-list',{data})
    }).catch(err => Helper. goErr(err,res))
})

router.get('/mdtc-add-sub-cat',(req,res) => {
    MDtcCats.findAll()
    .then(data => {
        res.render('mdtc-add-sub-cat',{data})
    }).catch(err => goErr(err,res))
})

router.post('/mdtc-add-sub-cat',urlEncoded,(req,res) => {
    const body = req.body;

    MDtcSubCats.create(body)
    .then(data => {
        res.redirect('/mdtc-add-sub-cat')
    }).catch(err => goErr(err,res))
})

router.get('/mdtc-dtc-list',(req,res) => {
    const arr = [],data1 = {};
    arr.push(MDtcCats.findAll().then(ok => data1.mdtcCats = ok));
    
    MDtcData.findAll({attributes:['id','title','active']})
    .then(data => {

        Promise.all(arr)
        .then(yes => {
            return res.render('mdtc_dtc_list',{data,data1})
        }).catch(err => Helper.goErr(err,res))

    }).catch(err => goErr(err,res))
})

router.get('/mdtc-add-dtc-data',(req,res) => {
    MDtcCats.findAll()
    .then(data => {
        return res.render('mdtc-add-dtc',{data})
    }).catch(err => {})
})

router.post('/mdtc-add-dtc-data',(req,res) => {

    uploadImg(req,res,(file) => {
        const body = req.body;
        if(file){
            const img = file.path;
            body['img'] = img;
        }

        MDtcData.create(body)
        .then(data => {
            res.redirect('/mdtc-dtc-list')
        }).catch(err => goErr(err,res))
    })
})

function upData(obj){
    MDtcData.create(obj)
    .then(data => {
        console.log(data)
    }).catch(err => console.log(err))
}

router.post('/mdtc-upload-dtc-data',uploadStorage.single("file"),(req,res) => {
    const path = req.file.path, def = {catId:10,subId:10};
    

    fs.createReadStream(path)
   .pipe(csv())
   .on('data', (row) => {
       MDtcData.findOne({where:{title:row.title,...def}})
       .then(data => {
           if(data.id){
               console.log(data.id)
               MDtcData.update(row,{where:{id:data.id}})
               .then(data => {
                   console.log()
                   
               }).catch(err => console.log(err))
           }else{
              upData({...row,...def})
           }
       }).catch(err => upData({...row,...def}))
      
    })
    .on('end', () => {
        res.redirect("/mdtc-dtc-list")
    });
})


router.post('/mdtc-upload-oem-data',uploadStorage.single("file"),(req,res) => {
    const path = req.file.path ,body = req.body;
    

    fs.createReadStream(path)
    .pipe(csv())
    .on('data', (row) => {
        MDtcData.findOne({where:{title:row.title,...body}})
        .then(data => {
            if(data.id){
                console.log(data.id)
                MDtcData.update(row,{where:{id:data.id}})
                .then(data => {
                    console.log()
                    
                }).catch(err => console.log(err))
            }else{
               upData({...row,...body})
            }
        }).catch(err => upData({...row,...body}))
       
     })
     .on('end', () => {
         res.redirect("/mdtc-dtc-list")
     });
})

router.get('/mdtc-data-list',(req,res) => {
    Helper.convertInt(req.query);
    const catId = req.query.catId, subId = (req.query.subId) ? req.query.subId : req.session.subId;
    if(subId){
        req.session.subId = subId;
    }

    const query = Helper.init(req);
    console.log(query)
    MDtcData.findAll({...query,where:{catId,subId}})
    .then(data => {
        res.send(data)
    }).catch(err => Helper.goErr(err,res))
})

router.get('/mdtc-get-sub-cats',(req,res) => {
    Helper.convertInt(req.query)
    const parId = req.query.parId;
    req.session.mdtcParId = parId;

    MDtcSubCats.findAll({where:{parId},attributes:['id','name']})
    .then(data => {
        res.json(data)
    }).catch(err => goErr(err,res))
})

router.get('/edit-mdtc-data',(req,res) => {
    const id = req.query.id;

    MDtcData.findOne({where:{id}})
    .then(data => {
        const arr = [],data1 = {},catId = data.catId, subId = data.subId;

        arr.push(MDtcCats.findOne({where:{id:catId}}).then(ok => data1.cat = ok))
        arr.push(MDtcSubCats.findOne({where:{id:subId}}).then(ok => data1.sub = ok))
        
        Promise.all(arr)
        .then(succ => {
            return res.render('edit-mdtc-data',{data,data1})
        }).catch(err => Helper.goErr(err,res))

    }).catch(err => Helper.goErr(err,res))
})

router.post('/edit-mdtc-data',(req,res) => {
    const id = req.query.id;

    uploadImg(req,res,(file) => {
        const body = req.body;

        if(file){
            body.img = file.path;
        }

        MDtcData.update(body,{where:{id}})
        .then(data => {
            
            return res.redirect('/mdtc-dtc-list')
        }).catch(err => Helper.goErr(err,res))
    })
})


/*     */

router.get('/filter-mdtc-data',(req,res) => {
    Helper.init(req)
    const catId = req.query.catId, subId = req.query.subId, obj = req.session.obj;

    if(!obj.where){
        obj.where = {}
    }
    obj.where["catId"] = catId;
    obj.where["subId"] = subId;

    MDtcData.findAll(obj)
    .then(data => {
        res.json(data)
    }).catch(err => Helper.goErr(err,res))
})

router.get('/mdtc-search',(req,res) => {
    const term = req.query.term, catId = parseInt( req.query.catId), subId = parseInt( req.query.subId);
    
    MDtcData.findAll({where:{catId,subId,title:{[Op.like]: term + "%"}}})
    .then(data => {
        
        res.json(data)
    })
    .catch(err => Helper.goErr(err,res))
})

Helper.actdect(router,'/aactdect-mdtc',MDtcData)
Helper.delete(router,"/del-mdtc-item",MDtcData)
Helper.next(router,"/mdtc-next-prev",MDtcData)


module.exports = router;