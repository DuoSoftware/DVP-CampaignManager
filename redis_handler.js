let redis = require("ioredis");
let Config = require('config');
let logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
let notificationService = require('./notificationService');
let format = require('stringformat');
////////////////////////////////redis////////////////////////////////////////
let redisip = Config.Redis.ip;
let redisport = Config.Redis.port;
let redispass = Config.Redis.password;
let redismode = Config.Redis.mode;
let redisdb = Config.Redis.db;


//[redis:]//[user][:password@][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]]
//redis://user:secret@localhost:6379
let redisSetting = {
    port: redisport,
    host: redisip,
    family: 4,
    db: redisdb,
    password: redispass,
    retryStrategy: function (times) {

        let delay = Math.min(times * 50, 2000);
        return delay;
    },
    reconnectOnError: function (err) {
        logger.error('contact upload - REDIS ERROR', err);

        return true;
    }
};

if (redismode == 'sentinel') {

    if (Config.Redis.sentinels && Config.Redis.sentinels.hosts && Config.Redis.sentinels.port && Config.Redis.sentinels.name) {
        let sentinelHosts = Config.Redis.sentinels.hosts.split(',');
        if (Array.isArray(sentinelHosts) && sentinelHosts.length > 2) {
            let sentinelConnections = [];

            sentinelHosts.forEach(function (item) {

                sentinelConnections.push({host: item, port: Config.Redis.sentinels.port})

            });

            redisSetting = {
                sentinels: sentinelConnections,
                name: Config.Redis.sentinels.name,
                password: redispass
            }

        } else {

            let msg = "No enough sentinel servers found .........";
            logger.error('contact upload - REDIS ERROR', msg);

        }

    }
}

let client = undefined;

if (redismode != "cluster") {
    client = new redis(redisSetting);
} else {

    let redisHosts = redisip.split(",");
    if (Array.isArray(redisHosts)) {


        redisSetting = [];
        redisHosts.forEach(function (item) {
            redisSetting.push({
                host: item,
                port: redisport,
                family: 4,
                password: redispass
            });
        });

        client = new redis.Cluster([redisSetting]);

    } else {

        client = new redis(redisSetting);
    }
}

 let incrby =function (key, value) {

    return new Promise((resolve, reject) => {
        try {
            client.incrby(key,parseInt(value), function (err, response) {

                if (err) {
                    logger.error('contact upload - REDIS ERROR', err);

                    reject(err)
                }

                resolve(response)
            });
        } catch (err) {

            reject(err);
        }

    });
};

module.exports.get_value = function (key) {

    return new Promise((resolve, reject) => {
        try {
            client.get(key, function (err, response) {

                if (err) {
                    logger.error('contact upload - REDIS ERROR', err);

                    reject(err)
                }
                resolve(response)
            });
        } catch (err) {

            reject(err);
        }

    });
};

client.on('error', function (msg) {
    logger.error('contact upload - REDIS ERROR', msg);

});


module.exports.process_counters =function (tenant, company, campaignID, scheduleId, profile_count, profile_contact_count) {
    try {
        profile_contact_count = profile_contact_count + 1;
        let key1 = format("CAM_TOTALCOUNT:{0}:{1}:PROFILES", tenant, company);
        let key2 = format("CAM_TOTALCOUNT:{0}:{1}:PROFILES:CAMPAIGN:{2}", tenant, company, campaignID);
        let key3 = format("CAM_TOTALCOUNT:{0}:{1}:PROFILES:CAMPAIGN:{2}:SCHEDULE:{3}", tenant, company, campaignID, scheduleId);

        let key4 = format("CAM_TOTALCOUNT:{0}:{1}:PROFILESCONTACTS", tenant, company);
        let key5 = format("CAM_TOTALCOUNT:{0}:{1}:PROFILESCONTACTS:CAMPAIGN:{2}", tenant, company, campaignID);
        let key6 = format("CAM_TOTALCOUNT:{0}:{1}:PROFILESCONTACTS:CAMPAIGN:{2}:SCHEDULE:{3}", tenant, company, campaignID, scheduleId);

        let profile_keys = [key1, key2, key3];
        let profile_contact_keys = [key4, key5, key6];

        profile_keys.forEach(function (key) {
            incrby(key, profile_count);
        });

        profile_contact_keys.forEach(function (key) {
            incrby(key, profile_contact_count);
        });

      notificationService.send_notification(company, tenant, campaignID, scheduleId);
    } catch (ex) {
        logger.error('contact upload - REDIS ERROR', ex);
    }
};



