var Sequelize = require("sequelize");

function connect(){
	const conn=new Sequelize("V0iiPIs6K0","V0iiPIs6K0","8OZCcgrxUe",{
	          host:"remotemysql.com",
			  dialect : 'mysql',
			  logging: false
		   });
		   
		   conn.sync();
    return conn;
} 

module.exports=connect();

