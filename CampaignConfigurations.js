/**
 * Created by Rajinda on 6/26/2015.
 */
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('dvp-dbmodels');


function CreateConfiguration(campaignId, channelConcurrent, allowCallBack, tenantId, companyId, status, caller, startDate, endDate, callBack) {
    DbConn.CampConfigurations
        .create(
        {
            CampaignId: campaignId,
            ChannelConcurrency: channelConcurrent,
            AllowCallBack: allowCallBack,
            //MaxCallBackCount: maxCallBackCount,
            TenantId: tenantId,
            CompanyId: companyId,
            Caller: caller,
            StartDate: startDate,
            EndDate: endDate,
            Status: Boolean(status)
        }
    ).then(function (cmp) {
            logger.info('[DVP-CampConfigurations.CreateConfiguration] - [%s] - [PGSQL] - inserted successfully ', campaignId);
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
            callBack.end(jsonString);
        }).error(function (err) {
            logger.error('[DVP-CampConfigurations.CreateConfiguration] - [%s] - [PGSQL] - insertion  failed-[%s]', campaignId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        });

}

function EditConfiguration(configureId, campaignId, channelConcurrency, allowCallBack, tenantId, companyId, status,  caller, startDate, endDate, callBack) {

    DbConn.CampConfigurations
        .update(
        {CompanyId: companyId,TenantId: tenantId,
            CampaignId: campaignId,
            ChannelConcurrency: channelConcurrency,
            AllowCallBack: allowCallBack,
            Caller: caller,
            StartDate: startDate,
            EndDate: endDate,
            Status: Boolean(status)
        },
        {
            where: {
                ConfigureId: configureId
            }
        }
    ).then(function (results) {


            logger.info('[DVP-CampConfigurations.EditCampaign] - [%s] - [PGSQL] - Updated successfully', campaignId);
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            callBack.end(jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampConfigurations.EditCampaign] - [%s] - [PGSQL] - Updation failed-[%s]', campaignId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        });
}

function DeleteConfiguration(configureId, callBack) {
    DbConn.CampConfigurations
        .update(
        {
            Status: false
        },
        {
            where: {
                ConfigureId: configureId
            }
        }
    ).then(function (results) {


            logger.info('[DVP-CampConfigurations.EditCampaign] - [%s] - [PGSQL] - Updated successfully', configureId);
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            callBack.end(jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampConfigurations.EditCampaign] - [%s] - [PGSQL] - Updation failed-[%s]', configureId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        });
}

function GetAllConfiguration(tenantId, companyId, callBack) {
    DbConn.CampConfigurations.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}]}).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampCampaignInfo.GetAllConfiguration] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCampaignInfo.GetAllConfiguration] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampConfigurations.GetAllConfiguration] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
        var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetConfiguration(configureId, tenantId, companyId, callBack) {

    DbConn.CampConfigurations.find({where: [{CompanyId: companyId}, {TenantId: tenantId}, {ConfigureId: configureId}]}).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampCampaignInfo.GetConfiguration] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCampaignInfo.GetConfiguration] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampConfigurations.GetConfiguration] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetConfigurationByCampaignId(campaignId, tenantId, companyId, callBack) {

    DbConn.CampConfigurations.find({where: [{CompanyId: companyId}, {TenantId: tenantId}, {CampaignId: campaignId}]}).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampCampaignInfo.GetConfiguration] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCampaignInfo.GetConfiguration] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampConfigurations.GetConfiguration] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}


function CreateCallbackConfiguration(configureId, maxCallBackCount, reasonId, callbackInterval, tenantId, companyId, callback) {


    DbConn.CampCallbackConfigurations
        .create(
        {
            ConfigureId: configureId,
            MaxCallBackCount: maxCallBackCount,
            ReasonId: reasonId,
            CallbackInterval: callbackInterval
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

function EditCallbackConfiguration(callBackConfId, configureId, maxCallBackCount, reasonId,callbackInterval, tenantId, companyId, callback) {


    DbConn.CampCallbackConfigurations
        .update(
        {
            ConfigureId: configureId,
            MaxCallBackCount: maxCallBackCount,
            CallbackInterval:callbackInterval,
            ReasonId: reasonId
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

function GetAllConfigurationSetting(configureId, tenantId, companyId, callBack) {

    DbConn.CampConfigurations.findAll({
        where: [{CompanyId: companyId}, {TenantId: tenantId}, {ConfigureId: configureId}],
        include: [{
            model: DbConn.CampCallbackConfigurations,
            as: "CampCallbackConfigurations",
            include: [{model: DbConn.CampCallBackReasons, as: "CampCallBackReasons"}]
        }]
    }).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampCampaignInfo.GetAllConfigurationSetting] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);

            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCampaignInfo.GetAllConfigurationSetting] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampCampaignInfo.GetAllConfigurationSetting] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
        var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });

}

function GetAllConfigurationSettingByCampaignId(campaignId, tenantId, companyId, callBack) {

    DbConn.CampConfigurations.find({
        where: [{CompanyId: companyId}, {TenantId: tenantId}, {CampaignId: campaignId}],
        include: [{
            model: DbConn.CampCallbackConfigurations,
            as: "CampCallbackConfigurations",
            include: [{model: DbConn.CampCallBackReasons, as: "CampCallBackReasons"}]
        }]
    }).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampCampaignInfo.GetAllConfigurationSetting] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);

            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCampaignInfo.GetAllConfigurationSetting] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampCampaignInfo.GetAllConfigurationSetting] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
        var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });

}

function CreateCallBackReason(reason, tenantId, companyId, callback) {


    DbConn.CampCallBackReasons
        .create(
        {
            Reason: reason,
            TenantId: tenantId,
            CompanyId: companyId
        }
    ).then(function ( cmp) {
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
            logger.info('[DVP-CampCallBackReasons.CreateCallBackReasons] - [PGSQL] - inserted successfully. [%s] ', jsonString);
            callback.end(jsonString);
        }).error(function (err) {
            logger.error('[DVP-CampCallBackReasons.CreateCallBackReasons] - [%s] - [PGSQL] - insertion  failed-[%s]', reason, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });

}

function EditCallBackReason(reasonId, reason, tenantId, companyId, callback) {


    DbConn.CampCallBackReasons
        .update(
        {
            Reason: reason
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


function DeleteCallbackInfo(callBackId, tenantId, companyId, callback) {


    DbConn.CampCallbackInfo
        .update(
        {
            CallbackStatus: false
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

module.exports.CreateCallbackConfiguration = CreateCallbackConfiguration;
module.exports.EditCallbackConfiguration = EditCallbackConfiguration;
module.exports.GetCallbackConfiguration = GetCallbackConfiguration;
module.exports.GetAllCallbackConfigurations = GetAllCallbackConfigurations;
module.exports.CreateConfiguration = CreateConfiguration;
module.exports.EditConfiguration = EditConfiguration;
module.exports.DeleteConfiguration = DeleteConfiguration;
module.exports.GetAllConfiguration = GetAllConfiguration;
module.exports.GetConfiguration = GetConfiguration;
module.exports.GetAllConfigurationSetting = GetAllConfigurationSetting;
module.exports.GetAllConfigurationSettingByCampaignId = GetAllConfigurationSettingByCampaignId;
module.exports.GetConfigurationByCampaignId = GetConfigurationByCampaignId;
module.exports.CreateCallBackReason = CreateCallBackReason;
module.exports.EditCallBackReason = EditCallBackReason;
module.exports.DeleteCallbackInfo = DeleteCallbackInfo;
module.exports.GetCallBackReason = GetCallBackReason;
module.exports.GetAllCallBackReasons = GetAllCallBackReasons;
