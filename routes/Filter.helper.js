

class MainFilter{

    static initObj(){
        const obj = {
            limit:10,
            offset:0
        }

        return obj;
    }

    static convertInt(body){
        for(let key in body){
            let val = body[key];
            body[key] = parseInt(val);
        }
    }

    static init(req,name){

        const query = req.query;
        let is = false;

        ['limit', 'active', 'all', 'next']
        .map(single => {
            if(query.hasOwnProperty(single)){
                
                const nq = parseInt(query[single]);
                is = true;
                
                if(!req.session[name]){
                    req.session[name] = this.initObj();
                }

                const obj = req.session[name];

                if(single == 'active'){
                    obj.where = {};
                    obj.where.active = nq;
                    this.reset(obj)
                }else if(single == 'all'){
                    if(obj.where){
                        delete obj.where;
                    }
                    this.reset(obj)
                }else if(single == 'limit'){
                    obj.limit = nq;
                }else if(single == 'next'){
                    
                    if(nq == 1){
                        obj.offset += obj.limit;
                        //console.log(obj.offset+ '     '+ obj.limit)
                    }else{
                        obj.offset -= obj.limit;
                    }
                }
                return obj;
            }
        })

        if(!is){
            req.session[name] = this.initObj();
            return req.session[name];
        }

    }

    static reset(obj){
        obj.limit = 10;
        obj.offset = 0;
    }

    static search(){

    }


}

module.exports = MainFilter;