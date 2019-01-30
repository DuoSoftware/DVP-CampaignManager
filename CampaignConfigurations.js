/**
 * Created by Rajinda on 6/26/2015.
 */
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('dvp-dbmodels');
var moment = require('moment');


function CreateConfiguration(campaignId, channelConcurrent, allowCallBack, tenantId, companyId, status, caller, startDate, endDate, NumberLoadingMethod, callBack) {
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
            NumberLoadingMethod: NumberLoadingMethod,
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

function EditConfiguration(configureId, campaignId, channelConcurrency, allowCallBack, tenantId, companyId, status,  caller, startDate, endDate, integrationData, NumberLoadingMethod, callBack) {

    DbConn.CampConfigurations
        .update(
        {CompanyId: companyId,TenantId: tenantId,
            CampaignId: campaignId,
            ChannelConcurrency: channelConcurrency,
            AllowCallBack: allowCallBack,
            Caller: caller,
            StartDate: startDate,
            EndDate: endDate,
            IntegrationData: integrationData,
            NumberLoadingMethod: NumberLoadingMethod,
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
    var jsonString;
    DbConn.CampConfigurations.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}]}).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampCampaignInfo.GetAllConfiguration] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString= messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCampaignInfo.GetAllConfiguration] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampConfigurations.GetAllConfiguration] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetConfiguration(configureId, tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampConfigurations.find({where: [{CompanyId: companyId}, {TenantId: tenantId}, {ConfigureId: configureId}]}).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampCampaignInfo.GetConfiguration] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString= messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCampaignInfo.GetConfiguration] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampConfigurations.GetConfiguration] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetConfigurationByCampaignId(campaignId, tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampConfigurations.find({where: [{CompanyId: companyId}, {TenantId: tenantId}, {CampaignId: campaignId}]}).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampCampaignInfo.GetConfiguration] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCampaignInfo.GetConfiguration] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampConfigurations.GetConfiguration] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function CreateCallbackConfiguration(configureId, maxCallBackCount, reasonId, callbackInterval, tenantId, companyId, callback) {

    var jsonString;
    DbConn.CampCallbackConfigurations
        .create(
        {
            ConfigureId: configureId,
            MaxCallBackCount: maxCallBackCount,
            ReasonId: reasonId,
            CallbackInterval: callbackInterval
        }
    ).then(function (cmp) {

            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
            logger.info('[DVP-CampCallbackConfigurations.CreateCallbackConfiguration] - [PGSQL] - inserted successfully. [%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampCallbackConfigurations.CreateCallbackConfiguration] - [%s] - [PGSQL] - insertion  failed-[%s]', reasonId, err);
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
}

function EditCallbackConfiguration(callBackConfId, configureId, maxCallBackCount, reasonId,callbackInterval, tenantId, companyId, callback) {

    var jsonString;
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

            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampCallbackConfigurations.EditCallbackConfiguration] - [PGSQL] - Updated successfully.[%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampCallbackConfigurations.EditCallbackConfiguration] - [%s] - [PGSQL] - Updation failed-[%s]', callBackConfId, err);
            callback.end(jsonString);
        });

}

function GetCallbackConfiguration(callBackConfId, tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampCallbackConfigurations.find({where: [{CallBackConfId: callBackConfId}]}).then(function (CamObject) {

        if (CamObject) {
            logger.info('[DVP-CampCallbackConfigurations.GetCallbackConfiguration] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCallbackConfigurations.GetCallbackConfiguration] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

    }).error(function (err) {
        logger.error('[DVP-CampCallbackConfigurations.GetCallbackConfiguration] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function DeleteCallbackConfigurationByID(configureId, tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampCallbackConfigurations.destroy({where: [{CallBackConfId: configureId}]}).then(function (CamObject) {

        if (CamObject) {
            logger.info('[DVP-CampCallbackConfigurations.DeleteCallbackConfigurationByID] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCallbackConfigurations.DeleteCallbackConfigurationByID] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

    }).error(function (err) {
        logger.error('[DVP-CampCallbackConfigurations.DeleteCallbackConfigurationByID] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetCallbackConfigurationByConfigID(configureId, tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampCallbackConfigurations.findAll({where: [{ConfigureId: configureId}], include: [{model : DbConn.CampCallBackReasons, as: "CampCallBackReasons"}]}).then(function (CamObject) {

        if (CamObject) {
            logger.info('[DVP-CampCallbackConfigurations.GetCallbackConfiguration] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCallbackConfigurations.GetCallbackConfiguration] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

    }).error(function (err) {
        logger.error('[DVP-CampCallbackConfigurations.GetCallbackConfiguration] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetAllCallbackConfigurations(tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampCallbackConfigurations.findAll().then(function (CamObject) {

        if (CamObject) {
            logger.info('[DVP-CampCallbackConfigurations.GetAllCallbackConfigurations] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCallbackConfigurations.GetAllCallbackConfigurations] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

    }).error(function (err) {
        logger.error('[DVP-CampCallbackConfigurations.GetAllCallbackConfigurations] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });

}

function GetAllConfigurationSetting(configureId, tenantId, companyId, callBack) {
    var jsonString;
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
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);

            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCampaignInfo.GetAllConfigurationSetting] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampCampaignInfo.GetAllConfigurationSetting] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });

}

function GetAllConfigurationSettingByCampaignId(campaignId, tenantId, companyId, callBack) {
    var jsonString;
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
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);

            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCampaignInfo.GetAllConfigurationSetting] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampCampaignInfo.GetAllConfigurationSetting] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });

}

function CreateCallBackReason(reason, hangupCause, callback) {

    var jsonString;
    DbConn.CampCallBackReasons
        .create(
        {
            Reason: reason,
            HangupCause: hangupCause,
            Status: true
        }
    ).then(function ( cmp) {
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
            logger.info('[DVP-CampCallBackReasons.CreateCallBackReasons] - [PGSQL] - inserted successfully. [%s] ', jsonString);
            callback.end(jsonString);
        }).error(function (err) {
            logger.error('[DVP-CampCallBackReasons.CreateCallBackReasons] - [%s] - [PGSQL] - insertion  failed-[%s]', reason, err);
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });

}

function EditCallBackReason(reasonId, reason, hangupCause, callback) {

    var jsonString;
    DbConn.CampCallBackReasons
        .update(
        {
            Reason: reason,
            HangupCause: hangupCause
        },
        {
            where: [{ReasonId: reasonId}]
        }
    ).then(function (results) {

            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampCallBackReasons.EditCallBackReasons] - [PGSQL] - Updated successfully.[%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampCallBackReasons.EditCallBackReasons] - [%s] - [PGSQL] - Updation failed-[%s]', reasonId, err);
            callback.end(jsonString);
        });

}


function DeleteCallbackInfo(callBackId, tenantId, companyId, callback) {

    var jsonString;
    DbConn.CampCallbackInfo
        .update(
        {
            CallbackStatus: false
        },
        {
            where: [{CallBackId: callBackId}]
        }
    ).then(function (results) {

            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampCallbackInfo.DeleteCallbackInfo] - [PGSQL] - Updated successfully.[%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampCallbackInfo.DeleteCallbackInfo] - [%s] - [PGSQL] - Updation failed-[%s]', callBackId, err);
            callback.end(jsonString);
        });

}

function GetCallBackReason(tenantId, companyId, reasonId, callBack) {
    var jsonString;
    DbConn.CampCallBackReasons.find({where: [{ReasonId: reasonId}]}).then(function (CamObject) {

        if (CamObject) {
            logger.info('[DVP-CampCallBackReasons.GetCallBackReason] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString= messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCallBackReasons.GetCallBackReason] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

    }).error(function (err) {
        logger.error('[DVP-CampCallBackReasons.GetCallBackReason] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetAllCallBackReasons(tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampCallBackReasons.findAll().then(function (CamObject) {

        if (CamObject) {
            logger.info('[DVP-CampCallBackReasons.GetAllCallBackReason] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString= messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCallBackReasons.GetAllCallBackReason] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

    }).error(function (err) {
        logger.error('[DVP-CampCallBackReasons.GetAllCallBackReason] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });

}


function SetCampaignStartDate(tenantId, companyId, configureId, campaignId, startDate, endDate, callBack) {

    var convertedStartDate = moment(startDate);
    var convertedEndDate = moment(endDate);

    DbConn.CampConfigurations
        .update(
        {
            StartDate: convertedStartDate,
            EndDate: convertedEndDate
        },
        {
            where: {
                TenantId: tenantId,
                CompanyId: companyId,
                CampaignId: campaignId,
                ConfigureId: configureId
            }
        }
    ).then(function (results) {


            logger.info('[DVP-CampConfigurations.SetCampaignStartDate] - [%s] - [PGSQL] - Updated successfully', campaignId);
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            callBack.end(jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampConfigurations.SetCampaignStartDate] - [%s] - [PGSQL] - Updation failed-[%s]', campaignId, err);
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
module.exports.GetCallbackConfigurationByConfigID = GetCallbackConfigurationByConfigID;
module.exports.DeleteCallbackConfigurationByID = DeleteCallbackConfigurationByID;
module.exports.SetCampaignStartDate = SetCampaignStartDate;
