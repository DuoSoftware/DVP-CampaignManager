/**
 * Created by Rajinda on 6/26/2015.
 */
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('DVP-DBModels');

function CreateConfiguration(campaignId, channelConcurrent, allowCallBack, maxCallBackCount, tenantId, companyId, status, caller, startDate, endDate, callBack) {
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
    ).complete(function (err, cmp) {

            if (err) {

                logger.error('[DVP-CampConfigurations.CreateConfiguration] - [%s] - [PGSQL] - insertion  failed-[%s]', campaignId, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }
            else {
                logger.info('[DVP-CampConfigurations.CreateConfiguration] - [%s] - [PGSQL] - inserted successfully ', campaignId);
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
                callBack.end(jsonString);
            }
        });

}

function EditConfiguration(configureId, campaignId, channelConcurrency, allowCallBack, status, concurrent, caller, startDate, endDate, callBack) {

    DbConn.CampConfigurations
        .update(
        {
            CampaignId: campaignId,
            ChannelConcurrency: channelConcurrency,
            AllowCallBack: allowCallBack,
            MaxCallBackCount: maxCallBackCount,
            Concurrent: concurrent,
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


            logger.info('[DVP-CampConfigurations.EditCampaign] - [%s] - [PGSQL] - Updated successfully', campaignId);
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            callBack.end(jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampConfigurations.EditCampaign] - [%s] - [PGSQL] - Updation failed-[%s]', campaignId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        });
}

function GetAllConfiguration(tenantId, companyId, callBack) {
    DbConn.CampConfigurations.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}]}).complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampConfigurations.GetAllConfiguration] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

        else {

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
        }
    });
}

function GetConfiguration(configureId, tenantId, companyId, callBack) {

    DbConn.CampConfigurations.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}, {ConfigureId: configureId}]}).complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampConfigurations.GetConfiguration] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

        else {

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
        }
    });
}


module.exports.CreateConfiguration = CreateConfiguration;
module.exports.EditConfiguration = EditConfiguration;
module.exports.DeleteConfiguration = DeleteConfiguration;
module.exports.GetAllConfiguration = GetAllConfiguration;
module.exports.GetConfiguration = GetConfiguration;