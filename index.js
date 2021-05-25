var express = require("express");
var app = express();
const fs = require('fs')
const path = require('path');
const tjs = require("templatesjs")
const  Worker = require('./pre.helper')
const helpers = require('./helpers');
const multer = require('multer');
const { Brands } = require("./back/db/schemas/brand_master.schema");
const BrandRouter = require("./routes/brands.route")
const DiagnoRoute = require("./routes/diagno.route")
const { uploadImg } = require('./img.helper')
const bodyParser = require('body-parser')
const urlEncoded = bodyParser.urlencoded({extended:false})
const UtilsRoute = require('./routes/utils.route')
const DataRoute = require('./routes/data.route')
const ToolsRoute = require('./routes/tools.route')
const MDtcRoute = require('./routes/mdtc.route')
const RelatedRoute = require('./routes/related-data.route')
const UsersRoute = require('./routes/users.route')
const NDiagRoute = require('./routes/ndiag.route')
const session = require('express-session')
const ApiBrandsRoute = require('./routes/api/apibrands.route')
const TestRoute = require('./routes/test.route')
const ApiUserRoute = require('./routes/api/apiuser.route')
const axios = require('axios');



new Worker(express,app)

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
     secret: "secret",
     resave:false,
     saveUninitialized:false
}))

function login(req,res,next){
     
     if(req.path.includes('api')){
          next()
     }else{
          if(req.session.login == true){
               next();
          }else{
               res.render('send-otp')
          }
     }

     
}

app.get('/sended',(req,res) => {
     function randomNumber() { 
          return parseInt(Math.random() * (9999 - 1000) + 1000);
     }

     req.session.otp = randomNumber();
     console.log(req.session.otp)
     axios.get("http://login.bulksmssender.in/app/smsapi/index.php?key=260A6008324F7B&campaign=11033&routeid=101217&type=text&contacts=9109566797&senderid=CARCin&msg=Your OTP for login/registration to CAR CLINIC INDIA is "+req.session.otp)
     .then(data => {})
     .catch(err => console.log(err));
     res.render('login')
})

app.get('/logout',(req,res) => {
     req.session.login = false
     res.redirect('/dashboard')
})

app.post('/verify',urlEncoded,(req,res) => {
     const code = parseInt(req.body.code);
     console.log(req.body)

     if(code == req.session.otp){
          req.session.login = true;
          return res.redirect("/dashboard");
     }else{
          res.render('error-page')
     }
})
/*
app.all('/',login,function(req,res,next) {
     next();
})*/


app.use('/api',ApiBrandsRoute);
app.use('/test',TestRoute);
app.use('/api',ApiUserRoute);
app.use('/',login,BrandRouter)
app.use('/',DiagnoRoute);
app.use('/',UtilsRoute);
app.use('/',DataRoute);
app.use('/',ToolsRoute);
app.use('/',MDtcRoute);
app.use('/',RelatedRoute);
app.use('/',UsersRoute);
app.use('/',NDiagRoute)


app.get('/',(req,res) => {
     //return res.render('dashboard');
})

app.listen(3000);