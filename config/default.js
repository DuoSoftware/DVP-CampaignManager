module.exports = {
    "DB": {
        "Type":"postgres",
        "User":"",
        "Password":"",
        "Port":5432,
        "Host":"",
        "Database":""
    },
    "Redis":
        {
            "ip": "",
            "port": 6389,
            "password":"",
            "db": 9,
            "mode": "sentinel",
            "sentinels":{
                "hosts": "",
                "port":16389,
                "name":"redis-cluster"
            }
        },
    "Security": {
        "ip": "",
        "port": 6389,
        "user": "",
        "password": "",
        "mode": "sentinel",//instance, cluster, sentinel
        "sentinels": {
            "hosts": "",
            "port": 16389,
            "name": "redis-cluster"
        }
    },
    "Host": {
        "domain": "0.0.0.0",
        "port": 8827,
        "version": "1.0.0.0",
        "hostpath": "./config",
        "logfilepath": ""
    }
};
