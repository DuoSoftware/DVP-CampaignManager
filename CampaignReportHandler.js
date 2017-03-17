/**
 * Created by Rajinda on 6/26/2015.
 */

var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('dvp-dbmodels');
var moment = require('moment');
var async = require('async');

module.exports.CampaignSummeryReportCount = function (req, res) {
    var jsonString;
    var tenantId = req.user.tenant;
    var companyId = req.user.company;

    var query = {
        where: [{CompanyId: companyId}, {TenantId: tenantId}, {Status: true}]
    };

    if (req.params.Status) {
        if (Array.isArray(req.params.Status))
            query.where.push({OperationalStatus: {$in: req.params.Status}});
        else {
            if (req.params.Status != 'All')
                query.where.push({OperationalStatus: req.params.Status});
        }
    }

    DbConn.CampCampaignInfo.count(query)
        .then(function (CamObject) {
            jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", true, CamObject);
            res.end(jsonString);
        }).error(function (err) {
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        res.end(jsonString);
    });
};

module.exports.CampaignDispositionReportCount = function (req, res) {
    var jsonString;
    var tenantId = req.user.tenant;
    var companyId = req.user.company;
    var campaignId = req.params.CampaignId;

    DbConn.CampDialoutInfo.count({CompanyId: companyId.toString()}, {TenantId: tenantId.toString()}, {CampaignId: campaignId})
        .then(function (CamObject) {
            jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", true, CamObject);
            res.end(jsonString);
        }).error(function (err) {
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        res.end(jsonString);
    });
};

module.exports.CampaignCallbackReportCount = function (req, res) {
    var jsonString;
    var campaignId = req.params.CampaignId;

    DbConn.CampCallbackInfo.count({CampaignId: campaignId})
        .then(function (CamObject) {
            jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", true, CamObject);
            res.end(jsonString);
        }).error(function (err) {
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        res.end(jsonString);
    });
};

module.exports.CampaignSummeryReport = function (req, res) {
    var jsonString;
    var tenantId = req.user.tenant;
    var companyId = req.user.company;
    var pageNo = req.params.pageNo;
    var rowCount = req.params.rowCount;

    var query = {
        where: [{CompanyId: companyId}, {TenantId: tenantId}, {Status: true}],
        offset: ((pageNo - 1) * rowCount),
        limit: rowCount,
        order: '"CampaignId" DESC'
    };

    if (req.params.Status) {
        if (Array.isArray(req.params.Status))
            query.where.push({OperationalStatus: {$in: req.params.Status}});
        else {
            if (req.params.Status != 'All')
                query.where.push({OperationalStatus: req.params.Status});
        }
    }

    DbConn.CampCampaignInfo.findAll(query)
        .then(function (CamObject) {

            if (CamObject) {
                var taskList = [];
                CamObject.map(function (item) {
                    if (item) {

                        function calculateDuration(camDate) {
                            try {
                                var then = moment(camDate, "YYYY-MM-DD'T'HH:mm:ss:SSSZ");
                                var now = moment();

                                var diff = moment.duration(then.diff(now));
                                if (diff < 0) {
                                    diff = Math.abs(diff);
                                }
                                return moment.utc(diff).format("HH:mm:ss:SSS");
                            } catch (ex) {
                                return "00:00:00:00";
                            }

                        }

                        taskList.push(function (callback) {
                                async.parallel({
                                    total_dial: function (callback) {
                                        var query = {
                                            attributes: [[DbConn.SequelizeConn.fn('COUNT', DbConn.SequelizeConn.col('*')), 'total_dial']],
                                            where: [{CampaignId: item.CampaignId.toString()}]
                                        };
                                        DbConn.CampDialoutInfo.find(query)
                                            .then(function (CamObject) {
                                                callback(undefined, CamObject);
                                            }).error(function (err) {
                                            callback(err, 0);
                                        });
                                    },
                                    channel_answered: function (callback) {
                                        var query = {
                                            attributes: [[DbConn.SequelizeConn.fn('COUNT', DbConn.SequelizeConn.col('*')), 'channel_answered']],
                                            where: [{
                                                CampaignId: item.CampaignId.toString(),
                                                DialerStatus: 'channel_answered'
                                            }]
                                        };
                                        DbConn.CampDialoutInfo.find(query)
                                            .then(function (CamObject) {
                                                callback(undefined, CamObject);
                                            }).error(function (err) {
                                            callback(err, 0);
                                        });
                                    },
                                    dial_success: function (callback) {
                                        var query = {
                                            attributes: [[DbConn.SequelizeConn.fn('COUNT', DbConn.SequelizeConn.col('*')), 'dial_success']],
                                            where: [{
                                                CampaignId: item.CampaignId.toString(), DialerStatus: 'dial_success'
                                            }]
                                        };
                                        DbConn.CampDialoutInfo.find(query)
                                            .then(function (CamObject) {
                                                callback(undefined, CamObject);
                                            }).error(function (err) {
                                            callback(err, 0);
                                        });
                                    },
                                    dial_failed: function (callback) {
                                        var query = {
                                            attributes: [[DbConn.SequelizeConn.fn('COUNT', DbConn.SequelizeConn.col('*')), 'dial_failed']],
                                            where: [{
                                                CampaignId: item.CampaignId.toString(), DialerStatus: 'dial_failed'
                                            }]
                                        };
                                        DbConn.CampDialoutInfo.find(query)
                                            .then(function (CamObject) {
                                                callback(undefined, CamObject);
                                            }).error(function (err) {
                                            callback(err, 0);
                                        });
                                    }
                                }, function (err, results) {
                                    var rowData = {
                                        total_dial: 0,
                                        channel_answered: 0,
                                        dial_success: 0,
                                        dial_failed: 0,
                                        percentage: 0,
                                        status: item.OperationalStatus,
                                        campaignName: item.CampaignName,
                                        durations: calculateDuration(moment())

                                    };
                                    if (results) {

                                        try {
                                            var total_dial = (results.total_dial != undefined && results.total_dial.dataValues != undefined) ? parseInt(results.total_dial.dataValues.total_dial) : 0;
                                            rowData.total_dial = total_dial;

                                            var channel_answered = (results.channel_answered != undefined && results.channel_answered.dataValues != undefined) ? parseInt(results.channel_answered.dataValues.channel_answered) : 0;
                                            rowData.channel_answered = channel_answered;

                                            var dial_success = (results.dial_success != undefined && results.dial_success.dataValues != undefined) ? parseInt(results.dial_success.dataValues.dial_success) : 0;
                                            rowData.dial_success = dial_success;

                                            var dial_failed = (results.dial_failed != undefined && results.dial_failed.dataValues != undefined) ? parseInt(results.dial_failed.dataValues.dial_failed) : 0;
                                            rowData.dial_failed = dial_failed;


                                            rowData.percentage = total_dial === 0 ? 0 : (channel_answered / total_dial) * 100
                                        }
                                        catch (ex) {
                                            console.log("asdasdasda");
                                        }

                                    }
                                    callback(err, rowData);
                                });
                            }
                        );
                    }
                });

                async.parallel(taskList, function (err, results) {
                    jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", true, results);
                    if (err) {
                        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                    }
                    res.end(jsonString);
                });
            }
            else {
                jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                res.end(jsonString);
            }
        }).error(function (err) {
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        res.end(jsonString);
    });


    /*var query = {
     attributes: [[DbConn.SequelizeConn.fn('COUNT', DbConn.SequelizeConn.col('*')), 'total_dial'],[DbConn.SequelizeConn.fn('SUM', DbConn.SequelizeConn.col('Duration')), 'TotalAcwTime'],[DbConn.SequelizeConn.fn('AVG', DbConn.SequelizeConn.col('Duration')), 'AverageAcwTime']],
     where :[{CompanyId: companyId, TenantId: tenantId, ResourceId: resourceId, StatusType: 'SloatStatus', Status: 'AfterWork', createdAt: {between:[startTime, endTime]}}]
     };

     DbConn.CampDialoutInfo.find(query)
     .then(function (CamObject) {

     if (CamObject) {
     logger.info('[DVP-CampAdditionalData.GetAdditionalDataByCampaignId] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
     jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
     callBack.end(jsonString);
     }
     else {
     logger.error('[DVP-CampAdditionalData.GetAdditionalDataByCampaignId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
     jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
     callBack.end(jsonString);
     }

     }).error(function (err) {
     logger.error('[DVP-CampAdditionalData.GetAdditionalDataByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
     jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
     callBack.end(jsonString);
     });*/
};

module.exports.CampaignDispositionReport = function (req, res) {
    var jsonString;
    var tenantId = req.user.tenant;
    var companyId = req.user.company;
    var campaignId = req.params.CampaignId;
    var pageNo = req.params.pageNo;
    var rowCount = req.params.rowCount;

    DbConn.CampDialoutInfo.findAll({
        where: [{CompanyId: companyId.toString()}, {TenantId: tenantId.toString()}, {CampaignId: campaignId}],
        offset: ((pageNo - 1) * rowCount),
        limit: rowCount,
        order: '"DialoutId" DESC'
    }).then(function (CamObject) {

        if (CamObject) {
            jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", true, CamObject);
        }
        else {
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
        }
        res.end(jsonString);
    }).error(function (err) {
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        res.end(jsonString);
    });

};

module.exports.CampaignCallbackReport = function (req, res) {
    var jsonString;
    var campaignId = req.params.CampaignId;
    var pageNo = req.params.pageNo;
    var rowCount = req.params.rowCount;

    DbConn.CampCallbackInfo.findAll({
        where: [{CampaignId: campaignId}],
        offset: ((pageNo - 1) * rowCount),
        limit: rowCount,
        order: '"CallBackId" DESC'
    }).then(function (CamObject) {

        if (CamObject) {
            jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", true, CamObject);
        }
        else {
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
        }
        res.end(jsonString);
    }).error(function (err) {
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        res.end(jsonString);
    });

};