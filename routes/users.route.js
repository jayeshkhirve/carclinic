const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const { Feedback, Complaints, User, Plane, MobNumb, History  } = require('../back/db/schemas/user.schema')
const Helper = require('./utils.helper')
const  Sequelize  = require("sequelize");
const Filter = require('./Filter.helper')


const urlEncoded = bodyParser.urlencoded({extended:false})

router.get('/dashboard',(req,res) => {

    const arr = [];

    arr.push(Feedback.count());
    arr.push(Complaints.count());
    arr.push(User.count())
    arr.push(Plane.count())

    Promise.all(arr)
    .then(data => {
        const fcount = data[0], ccount = data[1], ucount = data[2], pcount = data[3];
 
        return res.render('dashboard',{fcount,ccount,ucount,pcount});
    }).catch(err => res.send(err))

})
/*
Helper.list(router,'/manage-users','users-list',User);
Helper.add(router,"/add-user",'/manage-users',User)
Helper.delete(router,"/delete-user",User);
Helper.actdect(router,"/actdect-user",User);
Helper.search(router,"/search-user","name",User);
*/

Helper.actdect(router,"/actdect-user",User);
/*
Helper.list(router,'/manage-complaint','complaints-list',Complaints);
Helper.add(router,"/add-complaint",'/manage-complaint',Complaints);*/
Helper.delete(router,"/delete-complaints",Complaints);
Helper.actdect(router,"/actdect-complaint",Complaints);
Helper.searchT(router,"/search-complaint",Complaints);

//Helper.list(router,'/manage-feedback','feedbacks-list',Feedback);
Helper.add(router,"/add-feedback",'/manage-feedback',Feedback);
Helper.delete(router,"/delete-feedback",Feedback);
Helper.actdect(router,"/actdect-feedback",Feedback);
Helper.searchT(router,"/search-feedback",Feedback);

Helper.addBack(router,'/add-plane-ejs','add-plane','/manage-plane',Plane)
Helper.list(router,'/manage-plane','planes-list',Plane);
Helper.add(router,"/add-plane",'/manage-plane',Plane)
Helper.delete(router,"/delete-plane",Plane);
Helper.actdect(router,"/actdect-plane",Plane);
Helper.searchT(router,"/search-plane",Plane);



router.get('/manage-users',(req,res) => {
/*
    let limit = parseInt(req.query.limit), offset = parseInt(req.query.offset);
    let q = (req.query.active) ? {limit,offset,where:{active:parseInt(req.query.active)}} : {limit,offset};

    
    if(req.query.next){
        
        if(parseInt(req.query.next) == 1){
            offset = limit+offset;
            console.log(req.query.next+"hello")
        }else{
            offset = offset-limit;
        }
    }
*/

Filter.init(req,"user_filter")
    
    User.findAll(req.session["user_filter"])
    .then(data => {
        const arr = [],objs = [];
        data.map((single,index) => {
            arr.push(MobNumb.findOne({where:{id:single.mob}}).then(ok => {             
                    console.log(single.name)
                    single.numb = ok.mob
                    objs.push(single);
                
                    if(objs[index] != undefined){
                        objs[index].name = Helper.splicer(objs[index].name);
                        objs[index].workshopName = Helper.splicer(objs[index].workshopName);
                    
                    }
            }))
        })
        Promise.all(arr)
        .then(ndata => {
            res.render('users-list',{data:objs})
        }).catch(err => console.log(err))
        
    }).catch(err => console.log(err))
})

router.get('/search-user/:which',(req,res) => {
    const which = req.params.which, term = req.query.term;
    console.log(req.query)

    switch(which){
        case "numb":
            MobNumb.findAll({where:{mob:{[Sequelize.Op.like]: term +"%"}}})
            .then(numbs => {
                const arr = [], data = [];
                numbs.map(singleNum => {
                    const numId = singleNum.id;
                    arr.push(User.findOne({where:{mob:numId}}) .then(user => {
                        if(user){
                        const obj = user.dataValues;
                        obj.numb = singleNum.mob;
                        data.push(obj);
                        }
                    }))
                   
                })

                Promise.all(arr)
               .then(() => res.json(data));
            }).catch(err => console.log(err))
            break;
        case "name":
            User.findAll({where:{name:{[Sequelize.Op.like]: term +"%"}}})
            .then(users => {
                const arr = [], data = [];
                users.map(user => {
                    if(user){
                        const mobId = user.mob;
                        arr.push(MobNumb.findOne({where:{id:mobId}}).then(mob => {
                            const obj = user.dataValues;
                            obj.numb = mob.mob;
                            data.push(obj);
                        }))
                    }
                })

                Promise.all(arr)
               .then(() => res.json(data));
            })
            break;
            case "work":
                User.findAll({where:{workshopName:{[Sequelize.Op.like]: term +"%"}}})
                .then(users => {
                    const arr = [], data = [];
                    users.map(user => {
                        if(user){
                        const mobId = user.mob;
                        arr.push(MobNumb.findOne({where:{id:mobId}}).then(mob => {
                            
                            const obj = user.dataValues;
                            obj.numb = mob.mob;
                            data.push(obj);
                            
                        }))
                    }
                    })
    
                    Promise.all(arr)
                   .then(() => res.json(data));
                })
    }
})

router.get('/search-feed/:which',(req,res) => {
    const which = req.params.which, term = req.query.term;
    console.log(req.query)

    switch(which){
        case "feed":
            Feedback.findAll({where:{description:{[Sequelize.Op.like]: term +"%"}}})
            .then(numbs => {
                const arr = [], data = [];
                numbs.map(singleNum => {
                    const numId = singleNum.userId;
                    arr.push(User.findOne({where:{id:numId}}) .then(user => {

                        if(user){
                        const obj = user.dataValues;
                        obj.description = singleNum.description;
                        data.push(obj);
                        }
                    }))

                })

                Promise.all(arr)
               .then(() => res.json(data));
            }).catch(err => console.log(err))
            break;
        case "name":
            User.findAll({where:{name:{[Sequelize.Op.like]: term +"%"}}})
            .then(users => {
                const arr = [], data = [];
                users.map(user => {
                    if(user){
                        const mobId = user.id;
                        arr.push(Feedback.findOne({where:{userId:mobId}}).then(feed => {
                            if(feed){
                                const obj = user.dataValues;
                                obj.description = feed.description;
                                data.push(obj);
                            }
                        }))
                    }
                })

                Promise.all(arr)
               .then(() => res.json(data));
            })
            break;
            case "work":
                User.findAll({where:{workshopName:{[Sequelize.Op.like]: term +"%"}}})
            .then(users => {
                const arr = [], data = [];
                users.map(user => {
                    if(user){
                        const mobId = user.id;
                        arr.push(Feedback.findOne({where:{userId:mobId}}).then(feed => {
                            if(feed){
                                const obj = user.dataValues;
                                obj.description = feed.description;
                                data.push(obj);
                            }
                        }))
                    }
                })

                Promise.all(arr)
               .then(() => res.json(data));
                })
    }
})

router.get('/search-comp/:which',(req,res) => {
    const which = req.params.which, term = req.query.term;
    console.log(req.query)

    switch(which){
        case "comp":
            Complaints.findAll({where:{description:{[Sequelize.Op.like]: term +"%"}}})
            .then(numbs => {
                const arr = [], data = [];
                numbs.map(singleNum => {
                    const numId = singleNum.userId;
                    arr.push(User.findOne({where:{id:numId}}) .then(user => {
                        if(user){
                        const obj = user.dataValues;
                        obj.description = singleNum.description;
                        obj.active = singleNum.active
                        data.push(obj);
                        }
                    }))

                })

                Promise.all(arr)
               .then(() => res.json(data));
            }).catch(err => console.log(err))
            break;
        case "name":
            User.findAll({where:{name:{[Sequelize.Op.like]: term +"%"}}})
            .then(users => {
                const arr = [], data = [];
                users.map(user => {
                    if(user){
                        const mobId = user.id;
                        arr.push(Complaints.findOne({where:{userId:mobId}}).then(feed => {
                            if(feed){
                                const obj = user.dataValues;
                                obj.description = feed.description;
                                data.push(obj);
                            }
                        }))
                    }
                })

                Promise.all(arr)
               .then(() => res.json(data));
            })
            break;
            case "work":
                User.findAll({where:{workshopName:{[Sequelize.Op.like]: term +"%"}}})
            .then(users => {
                const arr = [], data = [];
                users.map(user => {
                    if(user){
                        const mobId = user.id;
                        arr.push(Complaints.findOne({where:{userId:mobId}}).then(feed => {
                            if(feed){
                                const obj = user.dataValues;
                                obj.description = feed.description;
                                data.push(obj);
                            }
                        }))
                    }
                })

                Promise.all(arr)
               .then(() => res.json(data));
                })
    }
})


router.post('/delete-user',(req,res) => {
    const userId = parseInt( req.query.id);

    User.findOne({where:{id:userId}})
    .then(data => {
        const mob = data.mob;

    
        MobNumb.destroy({where:{id:mob}})
        .then(monDel => {
            User.destroy({where:{id:userId}})
            .then(succ => {
                res.json({status:true})
            });
        }).catch(err => res.send(err))

    }).catch(err => res.send(err))
})

router.get('/edit-user',(req,res) => {
    const userId = req.query.userId;

    User.findOne({where:{id:userId}})
    .then(data => {
        data.name = Helper.splicer(data.name);
        data.workshopName = Helper.splicer(data.workshopName);
        data.email = Helper.splicer(data.email);
        data.workShopAddress = Helper.splicer(data.workShopAddress);
        Plane.findAll({where:{active:true}})
        .then(planes => {
            res.render('user-edit',{data,planes,userId})
        }).catch(err => res.send(err))
    }).catch(err => res.send(err))
})

router.post('/update-user',urlEncoded,(req,res) => {
    const userId = parseInt(req.query.userId), body = req.body;

    console.log(body)

    if(req.body.planes){
        const plane = parseInt(body.planes);

        delete body.planes;

        Plane.findOne({where:{id:plane}})
        .then(ok => {
            const months = ok.months, price = ok.price;
            console.log(months)

            History.create({userId,plane,months,price})
            .then(ndata => {
                console.log(ndata)
                User.update(body,{where:{id:userId}})
                .then(data => res.redirect('/edit-user?userId='+userId))
                .catch(err => res.send(err))
            }).catch(err => console.log(err))

        }).catch(err => console.log(err
            ))
    }else{
        User.update(body,{where:{id:userId}})
        .then(data => res.redirect('/edit-user?userId='+userId))
        .catch(err => res.send(err))
    }
})


router.get('/manage-complaint',(req,res) => {

    Filter.init(req,"comp_filter")


    Complaints.findAll(req.session["comp_filter"])
    .then(comps => {
        const arr= [],resData = [];

        comps.map(single => {
            arr.push(User.findOne({where:{id:single.userId}}).then(async ok => {
                if(ok != null){
                   
                   await MobNumb.findOne({where:{id:ok.dataValues.mob}})
                    .then(numb => {
                        const obj = ok.dataValues;
                        obj.description = single.description;
                        obj.active = single.active;
                        obj.numb = numb.mob;
                        obj.id = single.id;
                        console.log(obj.numb)
                        resData.push(obj)
                    }).catch(err => res.send({status:false}))
                }else{
                    resData.push({name:"Hello",workshopName:"Jo Bhi",description:single.description,id:single.id})
                }

            }))
        })

        Promise.all(arr)
        .then(data => res.render('complaints-list',{data:resData,limit:10}))
        .catch(err => res.send(err))

    }).catch(err => res.send(err))
})

router.get('/manage-feedback',(req,res) => {

    Filter.init(req,"feed_filter")

    Feedback.findAll(req.session["feed_filter"])
    .then(comps => {
        const arr= [],resData = [];

        comps.map(single => {
            
            arr.push(User.findOne({where:{id:single.userId}}).then(ok => {
                if(ok != null){
                    const obj = ok.dataValues;
                    obj.description = single.description;
                    obj.active = single.active;
                    obj.id = single.id;
                    resData.push(obj)
                }else{
                    resData.push({name:"Hello",workshopName:"Jo Bhi",description:single.description,id:single.id})
                }
            }))
        })

        Promise.all(arr)
        .then(data => res.render('feedbacks-list',{data:resData,limit:10}))
        .catch(err =>console.log(err))

    }).catch(err => console.log(err))
})


router.get('/view-feed',(req,res) => {
    const id = parseInt( req.query.id);

    Feedback.findOne({where:{id}})
    .then(data => {
        const description = data.dataValues.description;
        res.render('view-feeds',{description})
    }).catch(err => console.log(err))
})

router.get('/view-comps',(req,res) => {
    const id = req.query.id;

    Complaints.findOne({where:{id}})
    .then(data => {
        console.log(data)
        if(data){
            const description = data.dataValues.description;
            res.render('view-comp',{description})
        }else{
            res.send("error while occuring")
        }
       
    }).catch(err => res.send(err))
})

router.get('/edit-plane',(req,res) => {
    const id = req.query.id;

    Plane.findOne({where:{id}})
    .then(data => {
        res.render('edit-plane',{data:data.dataValues})
    }).catch(err =>console.log(err))
})

router.post('/edit-plane',(req,res) => {
    const id = req.query.id;

    Plane.update(req.body,{where:{id}})
    .then(data => {
        res.redirect("/manage-plane")
    }).catch(err => res.send(err))
})

module.exports = router