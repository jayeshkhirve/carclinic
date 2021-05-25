const express = require('express');
const { MobNumb, User, Plane, History, Complaints, Feedback } = require('../../back/db/schemas/user.schema');
const router = express.Router();
const { uploadImg,uploadStorage  } = require('../../img.helper')
const Helper = require('../utils.helper');

router.get('/alt',(req,res) => {
    res.send("Nota")
})


console.log("mo");

router.get('/numb',(req,res) => {
	const mob = req.query.mob;
    console.log(mob);

    MobNumb.findOne({where:{mob}})
    .then(data => {
        if(data){
       
            User.findOne({where:{mob:data.id}})
            .then(uData => {
				console.log(uData);
				const data1= data.dataValues,data2 = uData.dataValues;
                res.json({...data1,...data2,status:true})
            }).catch(err => console.log(err))
        }else{

            MobNumb.create({mob:mob})
            .then(uData => {
                res.json(uData.dataValues)
            }).catch(err => res.json({status:false}))
        }
    }).catch(err => console.log(err))

});

router.post('/numb',(req,res) => {

    const mob = req.body.mob;
    console.log(mob);

    MobNumb.findOne({where:{mob}})
    .then(data => {
        
        if(data){
            User.findOne({where:{mob:data.id}})
            .then(uData => {
				console.log(uData);
				if(uData){
					const data1= data.dataValues,data2 = uData.dataValues;
                    res.json({...data1,...data2,status:true})
				}else{
					const data1= data.dataValues;
					res.json({...data1,status:true});
				}
            }).catch(err => console.log(err))
        }else{

            MobNumb.create({mob:mob})
            .then(uData => {
                res.json(uData.dataValues)
            }).catch(err => res.json({status:false}))
        }
    }).catch(err => console.log(err))

})

router.post('/register',uploadStorage.single("file"),(req,res) => {
    const mob = req.body.mob,body = req.body;


	console.log(mob);
    MobNumb.findOne({where:{id:mob}})
    .then(data => {
		
        body.name = Helper.splicer(body.name);
        body.email = Helper.splicer(body.email);
        body.workshopName = Helper.splicer(body.workshopName)
        body.workShopAddress = Helper.splicer(body.workShopAddress);

		const is = (req.file != undefined) ? {...body,mob:data.id,img:req.file.path} : {...body,mob:data.id};
		
        User.create(is)
        .then(ndata => {
            MobNumb.update({registered:true},{where:{id:data.id}})
            .then(yes => {
                res.json(ndata)
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))

})


router.post('/update',uploadStorage.single("file"),(req,res) => {
    const userId = parseInt(req.body.userId);
    let body = req.body;
	console.log(body);

	body =  (req.file != undefined) ? {...body,img:req.file.path} : body ;
	
	User.update(body,{where:{id:userId}})
	.then(data => {
		if(req.file != undefined){
			res.json({img:req.file.path});
		}else{
			res.json({status:true});
		}
		
	}).catch(err => res.json(err));
	
	
	/*console.log(mob);
    User.findOne({where:{id:userId}})
    .then(data => {
		
		const is = (req.file != undefined) ? {...body,mob:data.id,img:req.file.path} : {...body,mob:data.id};
		
        User.update(is)
        .then(ndata => {
            MobNumb.update({registered:true},{where:{id:data.id}})
            .then(yes => {
                res.json(ndata)
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
*/
})


router.get('/showPlanes',(req,res) => {
    Plane.findAll()
    .then(data => {
        if(data.length>=1){
            const marr = [];

            data.map(single => {
                if(single.active){
                    marr.push(single);
                }
            })

            res.json(marr);
        }
    })
    .catch(err => res.send(err))
})

router.get('/getPlanePro',(req,res) => {
	const planeId = req.query.plane ;
	
	Plane.findOne({where:{id:planeId}})
	.then(data => res.json(data))
	.catch(err => res.json({status:false}));
});

router.get('/purchase',(req,res) => {
    const body = req.query;

    History.create(body)
    .then(data => {
        res.json({...data,status:true})
    }).catch(err => res.send(err))
})

router.get('/hasplane',(req,res) => {
    const userId = req.query.userId;

    History.findOne({where:{userId,active:true}})
    .then(data => {
        if(data){
			
			Plane.findOne({where:{id:data.plane}})
			.then(ndata => {
				const description = (ndata.dataValues.description) ? ndata.dataValues.description : "Pro";
				console.log(description);
				 data = data.dataValues;
				res.json({...data,description:description,has:true})
			}).catch(err => res.json({has:false})) ;
			//console.log({...data,has:true});
        }else{
            res.json({has:false})
        }
  

    }).catch(err => res.json(err))
})

router.get('/userHistory',(req,res) => {
    const userId = req.query.userId;
	const nArr = [];

    History.findAll({where:{userId}})
    .then(data => {
		const arr = [];
		data.map(single => {
			arr.push(Plane.findOne({where:{id:single.plane}}).then(ok => {
			       single.dataValues.planeName = ok.title;
                   
				   
				   nArr.push(single.dataValues);
			    }
			 ));
		});
		
		Promise.all(arr)
		.then(succ => {
			console.log(nArr)
			res.json(nArr)
		}).catch(err => res.send(err));
		
        
    }).catch(err => res.send({status:false}))
})

router.get('/sendComp',(req,res) => {
    const body = req.query;
	

    Complaints.create(body)
    .then(data => res.json({status:true}))
    .catch(err => res.json({status:false}))
})

router.get('/getComps',(req,res) => {
    const userId = req.query.userId;

    Complaints.findAll({where:{userId}})
    .then(data => {
        res.json(data)
    }).catch(err => res.json(err))
})

router.get('/sendFeed',(req,res) => {
    const body = req.query;

    Feedback.create(body)
    .then(data => res.json({status:true}))
    .catch(err => res.json({status:false}))
})

router.get('/getFeeds',(req,res) => {
    const userId = req.query.userId;
console.log(userId);
    Feedback.findAll({where:{userId}})
    .then(data => {
		console.log(data);
        res.json(data)
    }).catch(err => res.json(err))
})

router.post('/arc',uploadStorage.single("file"),(req,res) => {
	
		res.send("Hello");
		
		console.log(req.file);

});

function datediff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
}

function worker(){

    function datediff(first, second) {
        return Math.round((second-first)/(1000*60*60*24));
    }
    

    History.findAll()
    .then(data => {
        data.map(single => {
            const date = single.dataValues.createdAt;
            const obj = new Date(Date.parse(date))
            const months = single.dataValues.months;
            obj.setMonth(obj.getMonth()+months)
            const currDate = new Date();
            console.log(datediff(currDate,obj))
            if(datediff(currDate,obj)<1){
                History.update({active:false},{where:{id:single.id}})
                .then(set => {
                    console.log(set)
                }).catch(console.log(err))
            }
        })
    }).catch(err => console.log(err))
}




var dayInMilliseconds =  1000 * 60 * 60 * 24;
setInterval(function() { worker() },dayInMilliseconds );

module.exports = router;
