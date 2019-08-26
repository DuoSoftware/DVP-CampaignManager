var redis = require("ioredis");
var Config = require('config');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;


var redisip = Config.Redis.ip;
var redisport = Config.Redis.port;
var redispass = Config.Redis.password;
var redismode = Config.Redis.mode;



var redisSetting =  {
    port:redisport,
    host:redisip,
    family: 4,
    password: redispass,
    db: 7,
    retryStrategy: function (times) {
        var delay = Math.min(times * 50, 2000);
        return delay;
    },
    reconnectOnError: function (err) {

        return true;
    }
};

if(redismode == 'sentinel'){

    if(Config.Redis.sentinels && Config.Redis.sentinels.hosts && Config.Redis.sentinels.port && Config.Redis.sentinels.name){
        var sentinelHosts = Config.Redis.sentinels.hosts.split(',');
        if(Array.isArray(sentinelHosts) && sentinelHosts.length > 2){
            var sentinelConnections = [];

            sentinelHosts.forEach(function(item){

                sentinelConnections.push({host: item, port:Config.Redis.sentinels.port})

            });

            redisSetting = {
                sentinels:sentinelConnections,
                name: Config.Redis.sentinels.name,
                password: redispass,
                db: 7
            }

        }else{

            console.log("No enough sentinel servers found .........");
        }

    }
}

var client = undefined;

if(redismode != "cluster") {
    client = new redis(redisSetting);
}else{

    var redisHosts = redisip.split(",");
    if(Array.isArray(redisHosts)){


        redisSetting = [];
        redisHosts.forEach(function(item){
            redisSetting.push({
                host: item,
                port: redisport,
                family: 4,
                password: redispass});
        });

        client = new redis.Cluster([redisSetting]);

    }else{

        client = new redis(redisSetting);
    }


}


var DeleteObject = function(key)
{
    try
    {
        client.del(key, function(err, response)
        {
            if(err)
            {
                logger.error('[DVP-CDRProcessor.DeleteObject] - REDIS ERROR', err)
            }
        });

    }
    catch(ex)
    {
        logger.error('[DVP-CDRProcessor.DeleteObject] - REDIS ERROR', ex)
    }

};

var GetKeys = function(pattern, callback){
    try
    {
        client.keys(pattern, function(err, response)
        {
            callback(err, response);
        });

    }
    catch(ex)
    {
        logger.error('[DVP-CDRProcessor.DeleteObject] - REDIS ERROR', ex);
        callback(ex, null);
    }
};


client.on('error', function(msg)
{

});

module.exports.DeleteObject = DeleteObject;
module.exports.GetKeys = GetKeys;
