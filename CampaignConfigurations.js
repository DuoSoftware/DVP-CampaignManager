/**
 * Created by Rajinda on 6/26/2015.
 */
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('DVP-DBModels');

function CreateConfiguration(campaignId, channelConcurrency, allowCallBack, maxCallBackCount, status, callBack) {
    DbConn.CampConfigurations
        .create(
        {
            CampaignId: campaignId,
            ChannelConcurrency: channelConcurrency,
            AllowCallBack: allowCallBack,
            MaxCallBackCount: maxCallBackCount,
            Status: Boolean(status)
        }
    ).complete(function (err, cmp) {

            if (err) {

                logger.error('[DVP-CampaignOperations.CreateConfiguration] - [%s] - [PGSQL] - insertion  failed', campaignId, err);
                callBack(err, undefined);
            }
            else {
                logger.debug('[DVP-CampaignOperations.CreateConfiguration] - [%s] - [PGSQL] - inserted successfully ', campaignId);
                callBack(undefined, cmp);
            }
        });

}

function EditConfiguration(configureId, campaignId, channelConcurrency, allowCallBack, status, callBack) {

    DbConn.CampCampaignInfo
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


            logger.debug('[DVP-CampCampaignInfo.EditCampaign] - [%s] - [PGSQL] - Updated successfully', campaignId);
            callBack(undefined, results);

        }).error(function (err) {
            logger.error('[DVP-CampCampaignInfo.EditCampaign] - [%s] - [PGSQL] - Updation failed', campaignId, err);
            callBack(err, undefined);
        });
}

function DeleteConfiguration(configureId, callBack) {
    DbConn.CampCampaignInfo
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


            logger.debug('[DVP-CampCampaignInfo.EditCampaign] - [%s] - [PGSQL] - Updated successfully', campaignId);
            callBack(undefined, results);

        }).error(function (err) {
            logger.error('[DVP-CampCampaignInfo.EditCampaign] - [%s] - [PGSQL] - Updation failed', campaignId, err);
            callBack(err, undefined);
        });
}

function GetAllConfiguration(callBack) {

}

function GetConfiguration(ConfigureId, callBack) {

}


module.exports.CreateConfiguration = CreateConfiguration;
module.exports.EditConfiguration = EditConfiguration;
module.exports.DeleteConfiguration = DeleteConfiguration;
module.exports.GetAllConfiguration = GetAllConfiguration;
module.exports.GetConfiguration = GetConfiguration;