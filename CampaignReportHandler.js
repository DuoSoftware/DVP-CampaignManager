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

    var query = {
        where: [{CompanyId: companyId.toString()}, {TenantId: tenantId.toString()}, {CampaignId: campaignId}]
    };

    if (req.params.TryCount && req.params.TryCount > 0) {
        query.where.push({TryCount: req.params.TryCount});
    }
    if (req.params.DialerStatus && (req.params.DialerStatus != 'Dialer State')) {
        query.where.push({DialerStatus: req.params.DialerStatus});
    }
    if (req.params.Reason && (req.params.Reason != 'Reason')) {
        query.where.push({Reason: req.params.Reason});
    }


    DbConn.CampDialoutInfo.count(query)
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
    if(!req.params.CampaignId){
        jsonString = messageFormatter.FormatMessage(new Error("Invalid CampaignID"), "EXCEPTION", false, undefined);
        res.end(jsonString);
    }
    DbConn.CampCallbackInfo.count( { where: {'CampaignId': campaignId} })
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
        order:  [['CampaignId','DESC']]
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


                        function convertDate(date) {
                            var tempdate = '';
                            var yyyy = date._data.years;
                            var mm = date._data.months;
                            var dd = date._data.days;
                            var hh = date._data.hours;
                            var mi = date._data.minutes;
                            /*var sec = date._data.seconds;*/
                            if (yyyy > 0) {
                                tempdate = yyyy + 'y:' + mm + 'm:' + dd + 'd:' + hh + 'h:' + mi + 'm'; //+ sec+'s';
                            }
                            else if (mm > 0) {
                                tempdate =  mm + 'm:' + dd + 'd:' + hh + 'h:' + mi + 'm'; //+ sec+'s';
                            }
                            else if (dd > 0) {
                                tempdate = dd + 'd:' + hh + 'h:' + mi + 'm'; //+ sec+'s';
                            }
                            else {
                                tempdate = hh + 'h:' + mi + 'm'; //+ sec+'s';
                            }

                            return tempdate;
                        }

                        function calculateDuration(camDate) {
                            try {
                                if (!camDate.dataValues.StartDate) {
                                    return "N/A"; //0y:0m:0d:00h:00m:00s
                                }
                                var then = moment(camDate.dataValues.StartDate, "YYYY-MM-DD'T'HH:mm:ss:SSSZ");
                                var now = moment();

                                var endDate = moment(camDate.dataValues.EndDate, "YYYY-MM-DD'T'HH:mm:ss:SSSZ");
                                var diff = moment.duration(now.diff(endDate));
                                if (diff > 0) {
                                    now = endDate;
                                }

                                return convertDate(moment.duration(now.diff(then)));
                                /*var diff = moment.duration(now.diff(then));//.humanize()
                                 if (diff > 0) {
                                 diff = Math.abs(diff);
                                 }
                                 return moment.utc(diff).format("HH:mm:ss:SSS");// | date:'yyyy-MM-dd HH:mm:ss Z'*/
                            } catch (ex) {
                                return "N/A";
                            }

                        }

                        taskList.push(function (callback) {


                            var query = {
                                attributes: ['StartDate', 'EndDate'],
                                where: [{
                                    CampaignId: item.CampaignId.toString()
                                }]
                            };
                            DbConn.CampConfigurations.find(query)
                                .then(function (startEndDateObject) {
                                    var query = {
                                        attributes: [[DbConn.SequelizeConn.fn('COUNT', DbConn.SequelizeConn.col('CampaignId')), 'total_dial'],
                                            [DbConn.SequelizeConn.fn('COUNT', DbConn.SequelizeConn.literal(`case when "DialerStatus" = 'channel_answered' then "DialerStatus" end`)), 'channel_answered'],
                                            [DbConn.SequelizeConn.fn('COUNT', DbConn.SequelizeConn.literal(`case when "DialerStatus" = 'dial_success' then "DialerStatus" end`)), 'dial_success'],
                                            [DbConn.SequelizeConn.fn('COUNT', DbConn.SequelizeConn.literal(`case when "DialerStatus" = 'dial_failed' then "DialerStatus" end`)), 'dial_failed']],
                                        where: [{CampaignId: item.CampaignId.toString()}]
                                    };
                                    DbConn.CampDialoutInfo.find(query)
                                        .then(function (results) {
                                            var rowData = {
                                                total_dial: 0,
                                                channel_answered: 0,
                                                dial_success: 0,
                                                dial_failed: 0,
                                                percentage: 0,
                                                status: item.OperationalStatus,
                                                campaignName: item.CampaignName,
                                                durations: 'N/A',// calculateDuration(results.startEndDate),
                                                startEndDate:startEndDateObject ? startEndDateObject.dataValues:'N/A'

                                            };
                                            if (results && results.dataValues) {

                                                try {
                                                    var total_dial = results.dataValues.total_dial !== undefined ? parseInt(results.dataValues.total_dial) : 0;
                                                    rowData.total_dial = total_dial;

                                                    var channel_answered = (results.dataValues.channel_answered !== undefined) ? parseInt(results.dataValues.channel_answered) : 0;
                                                    rowData.channel_answered = channel_answered;

                                                    var dial_success = ( results.dataValues.dial_success !== undefined) ? parseInt(results.dataValues.dial_success) : 0;
                                                    rowData.dial_success = dial_success;

                                                    var dial_failed = ( results.dataValues.dial_failed !== undefined) ? parseInt(results.dataValues.dial_failed) : 0;
                                                    rowData.dial_failed = dial_failed;


                                                    rowData.percentage = total_dial === 0 ? 0 : (channel_answered / total_dial) * 100;
                                                }
                                                catch (ex) {
                                                    console.log("asdasdasda");
                                                }

                                            }
                                            callback(null, rowData);

                                        }).error(function (err) {
                                        callback(err, 0);
                                    });
                                }).error(function (err) {
                                callback(err, 0);
                            });



                            }
                        );
                    }
                });

                async.series(taskList, function (err, results) {
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

    var query = {
        where: [{CompanyId: companyId.toString()}, {TenantId: tenantId.toString()}, {CampaignId: campaignId}],
        offset: ((pageNo - 1) * rowCount),
        limit: rowCount,
        order: [['DialoutId','DESC']]
    };

    if (req.params.TryCount && req.params.TryCount > 0) {
        query.where.push({TryCount: req.params.TryCount});
    }
    if (req.params.DialerStatus) {
        query.where.push({DialerStatus: req.params.DialerStatus});
    }
    if (req.params.Reason) {
        query.where.push({Reason: req.params.Reason});
    }

    DbConn.CampDialoutInfo.findAll(query).then(function (CamObject) {

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
        order: [['CallBackId','DESC']]
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

module.exports.CampaignAttemptReport = function (req, res) {
    var jsonString;
    var campaignId = req.params.CampaignId;
    var pageNo = req.params.pageNo;
    var rowCount = req.params.rowCount;

    var query = {
        attributes: ['DialNumber',
            [DbConn.SequelizeConn.fn('MAX', DbConn.SequelizeConn.col('"createdAt"')), 'createdAt'],
            [DbConn.SequelizeConn.fn('COUNT', DbConn.SequelizeConn.col("TryCount")), 'TryCount'],
            [DbConn.SequelizeConn.fn('COUNT', DbConn.SequelizeConn.literal(`case when "DialerStatus" = 'channel_answered' then "DialerStatus" end`)), 'answered']

            //[DbConn.SequelizeConn.literal('(SELECT COUNT("DialerStatus") FROM "Orders" WHERE "Orders"."CustomerId" = "Customer"."id")'), 'totalAmount']
            //[DbConn.SequelizeConn.fn('COUNT', sequelize.cast{DialerStatus:{$eq:"channel_answered"}}))]
        ],
        where: [{CampaignId: campaignId}],
        group: ['DialNumber'],
        offset: ((pageNo - 1) * rowCount),
        limit: rowCount
    };

    if (req.params.DialNumber) {
        query.where.push({DialNumber: req.params.DialNumber});
    }

    DbConn.CampDialoutInfo.findAll(query).then(function (CamObject) {

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

module.exports.CampaignAttemptReportCount = function (req, res) {
    var jsonString;
    var campaignId = req.params.CampaignId;

    var query = {
        attributes: [[DbConn.SequelizeConn.literal('DISTINCT "DialNumber"'), 'DialNumber']],
        where: [{CampaignId: campaignId}]
    };

    if (req.params.DialNumber) {
        query.where.push({DialNumber: req.params.DialNumber});
    }

    DbConn.CampDialoutInfo.findAll(query).then(function (CamObject) {

        if (CamObject) {
            jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", true, CamObject.length);
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