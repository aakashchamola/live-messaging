const {sendResponse} = require('./functions');

class Router {
    constructor(){
            this.routes = {};
    }
     register(method,path,handler){
        method = method.toUpperCase();
        if (!this.routes[method]) this.routes[method] = {};
        this.routes[method][path] = handler;
    }
    async handle(req,res) {
        const method = req.method.toUpperCase();
        const path = req.url;
        if(this.routes[method] && this.routes[method][path]) {
        try{
            await this.routes[method][path](req,res);
        } catch (err) {
            console.error(err);
           return sendResponse(res,500,{message: "Internal Server Error"});
        }
        } else {
               return sendResponse(res,404,{message: "Route Not Found"});
        }
    }
}

module.exports = Router;