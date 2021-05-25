const ejs = require("ejs");
const path = require('path')

class Worker{

    static app;

    constructor(express,app){
        this.app = app;
        this.express = express;

        this.preUse(express,app);
    }

    preUse(express,app){

        app.set('view engine','ejs');
        app.set('www',path.join(__dirname+'www'))

        app.use(express.static('www'));
        app.use('/js',express.static(__dirname+'/www/js'));
        app.use('/js/tinymce/',express.static(__dirname+'/www/js/tinymce/'));
        app.use('/css',express.static(__dirname+'/www/css'));
        app.use('/uploads',express.static(__dirname+'/uploads'));
        app.use('/assets/css',express.static(__dirname+'/www/assets/css'))
        app.use('/assets/js',express.static(__dirname+'/www/assets/js'));
        app.use('/assets/plugins',express.static(__dirname+'/www/assets/plugins'));
        app.use('/widgets',express.static(__dirname+'/www/widgets'))
        app.use('/assets/pages',express.static(__dirname+'/www/assets/pages/'));
        app.use('/libraryJS',express.static(__dirname+'/www/libraryJS'))
        app.use('/libraryComponents/sweetalert',express.static(__dirname+'/www/libraryComponents/sweetalert'))
        app.use('/libraryComponents/fileinput',express.static(__dirname+'/www/libraryComponents/fileinput'))
        app.use('/libraryComponents/loaders',express.static(__dirname+'/www/libraryComponents/loaders'))
        app.use('/libraryComponents/validations',express.static(__dirname+'/www/libraryComponents/validations'))
        app.use('/js/my',express.static(__dirname+'/www/js/my'))
    }
}


module.exports = Worker;