/**
 * Created by Rajinda on 6/26/2015.
 */
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('DVP-DBModels');

function CreateConfiguration(campaignId, channelConcurrency, allowCallBack, maxCallBackCount,tenantId,companyId, status, callBack) {
    DbConn.CampConfigurations
        .create(
        {
            CampaignId: campaignId,
            ChannelConcurrency: channelConcurrency,
            AllowCallBack: allowCallBack,
            MaxCallBackCount: maxCallBackCount,
            TenantId:tenantId,
            CompanyId:companyId,
            Status: Boolean(status)
        }
    ).complete(function (err, cmp) {

            if (err) {

                logger.error('[DVP-CampConfigurations.CreateConfiguration] - [%s] - [PGSQL] - insertion  failed', campaignId, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callBack.end(jsonString, undefined);
            }
            else {
                logger.debug('[DVP-CampConfigurations.CreateConfiguration] - [%s] - [PGSQL] - inserted successfully ', campaignId);
                var jsonString = messageFormatter.FormatMessage(cmp, "success", true, undefined);
                callBack.end(undefined, jsonString);
            }
        });

}

function EditConfiguration(configureId, campaignId, channelConcurrency, allowCallBack, status, callBack) {

    DbConn.CampConfigurations
        .update(
        {
            CampaignId: campaignId,
            ChannelConcurrency: channelConcurrency,
            AllowCallBack: allowCallBack,
            MaxCallBackCount: maxCallBackCount,
            Status: Boolean(status)
        },
        {
            where: {
                ConfigureId: configureId
            }
        }
    ).then(function (results) {


            logger.debug('[DVP-CampConfigurations.EditCampaign] - [%s] - [PGSQL] - Updated successfully', campaignId);
            var jsonString = messageFormatter.FormatMessage(results, "success", true, undefined);
            callBack.end(undefined, jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampConfigurations.EditCampaign] - [%s] - [PGSQL] - Updation failed', campaignId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString, undefined);
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


            logger.debug('[DVP-CampConfigurations.EditCampaign] - [%s] - [PGSQL] - Updated successfully', campaignId);
            var jsonString = messageFormatter.FormatMessage(results, "success", true, undefined);
            callBack.end(undefined, jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampConfigurations.EditCampaign] - [%s] - [PGSQL] - Updation failed', campaignId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString, undefined);
        });
}

function GetAllConfiguration(tenantId,companyId,callBack) {
    DbConn.CampConfigurations.find({where: [{CompanyId: companyId}, {TenantId: tenantId}]}).complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampConfigurations.GetAllConfiguration] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString, undefined);
        }

        else {

            if (CamObject) {
                logger.debug('[DVP-CampCampaignInfo.GetAllConfiguration] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(CamObject, "success", true, undefined);
                callBack.end(undefined, jsonString);
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetAllConfiguration] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString, undefined);
            }
        }
    });
}

function GetConfiguration(configureId,tenantId,companyId, callBack) {

    DbConn.CampConfigurations.find({where: [{CompanyId: companyId}, {TenantId: tenantId},{ConfigureId:configureId}]}).complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampConfigurations.GetConfiguration] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString, undefined);
        }

        else {

            if (CamObject) {
                logger.debug('[DVP-CampCampaignInfo.GetConfiguration] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(CamObject, "success", true, undefined);
                callBack.end(undefined, jsonString);
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetConfiguration] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString, undefined);
            }
        }
    });
}


module.exports.CreateConfiguration = CreateConfiguration;
module.exports.EditConfiguration = EditConfiguration;
module.exports.DeleteConfiguration = DeleteConfiguration;
module.exports.GetAllConfiguration = GetAllConfiguration;
module.exports.GetConfiguration = GetConfiguration;