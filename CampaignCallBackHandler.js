/**
 * Created by Rajinda on 8/10/2015.
 */

var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('DVP-DBModels');

function CreateCallBackReason(reason, tenantId, companyId, callback) {


    DbConn.CampCallBackReasons
        .create(
        {
            Reason:reason,
            TenantId: tenantId,
            CompanyId: companyId
        }
    ).complete(function (err, cmp) {

            if (err) {
                logger.error('[DVP-CampCallBackReasons.CreateCallBackReasons] - [%s] - [PGSQL] - insertion  failed-[%s]', reason, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }
            else {
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
                logger.info('[DVP-CampCallBackReasons.CreateCallBackReasons] - [PGSQL] - inserted successfully. [%s] ', jsonString);
                callback.end(jsonString);
            }
        });
    /*
.then(function (cmp) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
            logger.info('[DVP-CampCallBackReasons.CreateCallBackReasons] - [PGSQL] - inserted successfully. [%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampCallBackReasons.CreateCallBackReasons] - [%s] - [PGSQL] - insertion  failed-[%s]', reason, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
        */

}

function EditCallBackReason(reasonId,reason, tenantId, companyId, callback) {


    DbConn.CampCallBackReasons
        .update(
        {
            Reason:reason
        },
        {
            where: [{ReasonId: reasonId}, {TenantId: tenantId}, {CompanyId: companyId}]
        }
    ).then(function (results) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampCallBackReasons.EditCallBackReasons] - [PGSQL] - Updated successfully.[%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampCallBackReasons.EditCallBackReasons] - [%s] - [PGSQL] - Updation failed-[%s]', reasonId, err);
            callback.end(jsonString);
        });

}

function CreateCallbackConfiguration(configureId,maxCallBackCount,reasonId, tenantId, companyId, callback) {


    DbConn.CampCallbackConfigurations
        .create(
        {
            ConfigureId:configureId,
            MaxCallBackCount:maxCallBackCount,
            ReasonId:reasonId
        }
    ).then(function (cmp) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
            logger.info('[DVP-CampCallbackConfigurations.CreateCallbackConfiguration] - [PGSQL] - inserted successfully. [%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampCallbackConfigurations.CreateCallbackConfiguration] - [%s] - [PGSQL] - insertion  failed-[%s]', reasonId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
}

function EditCallbackConfiguration(callBackConfId,configureId,maxCallBackCount,reasonId, tenantId, companyId, callback) {


    DbConn.CampCallbackConfigurations
        .update(
        {
            ConfigureId:configureId,
            MaxCallBackCount:maxCallBackCount,
            ReasonId:reasonId
        },
        {
            where: {
                CallBackConfId: callBackConfId
            }
        }
    ).then(function (results) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampCallbackConfigurations.EditCallbackConfiguration] - [PGSQL] - Updated successfully.[%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampCallbackConfigurations.EditCallbackConfiguration] - [%s] - [PGSQL] - Updation failed-[%s]', callBackConfId, err);
            callback.end(jsonString);
        });

}

function CreateCallbackInfo(campaignId,contactId,camScheduleId,callBackCount, tenantId, companyId, callback) {


    DbConn.CampCallbackInfo
        .create(
        {
            CampaignId:campaignId,
            ContactId:contactId,
            CamScheduleId:camScheduleId,
            CallBackCount:callBackCount,
            CallbackStatus :true
        }
    ).then(function (cmp) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
            logger.info('[DVP-CampCallbackInfo.CreateCallbackInfo] - [PGSQL] - inserted successfully. [%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampCallbackInfo.CreateCallbackInfo] - [%s] - [PGSQL] - insertion  failed-[%s]', contactId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
}

function EditCallbackInfo(callBackId,campaignId,contactId,camScheduleId,callBackCount, tenantId, companyId, callback) {


    DbConn.CampCallbackInfo
        .update(
        {
            CampaignId:campaignId,
            ContactId:contactId,
            CamScheduleId:camScheduleId,
            CallBackCount:callBackCount,
            CallbackStatus:true
        },
        {
            where: [{CallBackId: callBackId}]
        }
    ).then(function (results) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampCallbackInfo.EditCallbackInfo] - [PGSQL] - Updated successfully.[%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampCallbackInfo.EditCallbackInfo] - [%s] - [PGSQL] - Updation failed-[%s]', campaignId, err);
            callback.end(jsonString);
        });

}

function DeleteCallbackInfo(callBackId,tenantId, companyId, callback) {


    DbConn.CampCallbackInfo
        .update(
        {
            CallbackStatus:false
        },
        {
            where: [{CallBackId: callBackId}]
        }
    ).then(function (results) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampCallbackInfo.DeleteCallbackInfo] - [PGSQL] - Updated successfully.[%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampCallbackInfo.DeleteCallbackInfo] - [%s] - [PGSQL] - Updation failed-[%s]', callBackId, err);
            callback.end(jsonString);
        });

}

function GetCallBackReason(reasonId, tenantId, companyId, callBack) {

    DbConn.CampCallBackReasons.find({where: [{CompanyId: companyId}, {TenantId: tenantId}, {ReasonId: reasonId}]}).then(function (CamObject) {

        if (CamObject) {
            logger.info('[DVP-CampCallBackReasons.GetCallBackReason] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCallBackReasons.GetCallBackReason] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

    }).error(function (err) {
        logger.error('[DVP-CampCallBackReasons.GetCallBackReason] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetAllCallBackReasons(tenantId, companyId, callBack) {

    DbConn.CampCallBackReasons.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}]}).then(function (CamObject) {

        if (CamObject) {
            logger.info('[DVP-CampCallBackReasons.GetAllCallBackReason] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCallBackReasons.GetAllCallBackReason] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

    }).error(function (err) {
        logger.error('[DVP-CampCallBackReasons.GetAllCallBackReason] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });

}

function GetCallbackConfiguration(callBackConfId, tenantId, companyId, callBack) {

    DbConn.CampCallbackConfigurations.find({where: [{CallBackConfId: callBackConfId}]}).then(function (CamObject) {

        if (CamObject) {
            logger.info('[DVP-CampCallbackConfigurations.GetCallbackConfiguration] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCallbackConfigurations.GetCallbackConfiguration] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

    }).error(function (err) {
        logger.error('[DVP-CampCallbackConfigurations.GetCallbackConfiguration] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetAllCallbackConfigurations(tenantId, companyId, callBack) {

    DbConn.CampCallbackConfigurations.findAll().then(function (CamObject) {

        if (CamObject) {
            logger.info('[DVP-CampCallbackConfigurations.GetAllCallbackConfigurations] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCallbackConfigurations.GetAllCallbackConfigurations] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

    }).error(function (err) {
        logger.error('[DVP-CampCallbackConfigurations.GetAllCallbackConfigurations] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });

}

function GetCallbackInfo(callBackId, tenantId, companyId, callBack) {

    DbConn.CampCallbackInfo.find({where: [{CallBackId: callBackId}]})
        .then(function (CamObject) {

            if (CamObject) {
                logger.info('[DVP-CampCallbackInfo.GetCallbackInfo] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callBack.end(jsonString);
            }
            else {
                logger.error('[DVP-CampCallbackInfo.GetCallbackInfo] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }

        }).error(function (err) {
            logger.error('[DVP-CampCallbackInfo.GetCallbackInfo] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        });
}

function GetAllCallbackInfos(tenantId, companyId, callBack) {

    DbConn.CampCallbackInfo.findAll().then(function (CamObject) {

        if (CamObject) {
            logger.info('[DVP-CampCallbackInfo.GetAllCallbackInfos] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCallbackInfo.GetAllCallbackInfos] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

    }).error(function (err) {
        logger.error('[DVP-CampCallbackInfo.GetAllCallbackInfos] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });

}

function GetCallbackInfosByCampaignId(campaignId, tenantId, companyId, callBack) {

    DbConn.CampCallbackInfo.findAll({where: [{CampaignId: campaignId}]}).then(function (CamObject) {

        if (CamObject) {
            logger.info('[DVP-CampCallbackInfo.GetCallbackInfosByCampaignId] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCallbackInfo.GetCallbackInfosByCampaignId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

    }).error(function (err) {
        logger.error('[DVP-CampCallbackInfo.GetCallbackInfosByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });

}

function GetCallbackInfosByCamScheduleId(camScheduleId, tenantId, companyId, callBack) {

    DbConn.CampCallbackInfo.findAll({where: [{CamScheduleId: camScheduleId}]})
        .then(function (CamObject) {

            if (CamObject) {
                logger.info('[DVP-CampCallbackInfo.GetCallbackInfosByCamScheduleId] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callBack.end(jsonString);
            }
            else {
                logger.error('[DVP-CampCallbackInfo.GetCallbackInfosByCamScheduleId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }

        }).error(function (err) {
            logger.error('[DVP-CampCallbackInfo.GetCallbackInfosByCamScheduleId] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        });
}

module.exports.CreateCallBackReason = CreateCallBackReason;
module.exports.EditCallBackReason = EditCallBackReason;
module.exports.CreateCallbackConfiguration = CreateCallbackConfiguration;
module.exports.EditCallbackConfiguration = EditCallbackConfiguration;
module.exports.CreateCallbackInfo = CreateCallbackInfo;
module.exports.EditCallbackInfo = EditCallbackInfo;
module.exports.DeleteCallbackInfo = DeleteCallbackInfo;
module.exports.GetCallBackReason = GetCallBackReason;
module.exports.GetAllCallBackReasons = GetAllCallBackReasons;
module.exports.GetCallbackConfiguration = GetCallbackConfiguration;
module.exports.GetAllCallbackConfigurations = GetAllCallbackConfigurations;
module.exports.GetCallbackInfo = GetCallbackInfo;
module.exports.GetAllCallbackInfos = GetAllCallbackInfos;
module.exports.GetCallbackInfosByCampaignId = GetCallbackInfosByCampaignId;
module.exports.GetCallbackInfosByCamScheduleId = GetCallbackInfosByCamScheduleId;

