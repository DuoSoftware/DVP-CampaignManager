module.exports = {
    "DB": {
        "Type": "mssql",
        "User": "sa",
        "Password": "DuoSql@2017",
        "Port": 1433,
        "Host": "104.236.61.130",
        "Database": "facetone"
    },
    "Redis":
        {
            "ip": "45.55.142.207",
            "port": 6389,
            "password":"DuoS123",
            "db": 9,
            "mode": "sentinel",
            "sentinels":{
                "hosts": "138.197.90.92,45.55.205.92,138.197.90.92",
                "port":16389,
                "name":"redis-cluster"
            }
        },
    "Security": {
        "ip": "45.55.142.207",
        "port": 6389,
        "user": "duo",
        "password": "DuoS123",
        "mode": "sentinel",//instance, cluster, sentinel
        "sentinels": {
            "hosts": "138.197.90.92,45.55.205.92,138.197.90.92",
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
