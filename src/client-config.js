let config={}
if(process.env.ENV === "prod"){
    config.API_BASE= process.env.API_BASE
}else{
    config.API_BASE='http://localhost:7000'
}

Object.freeze(config);
module.exports=config;
