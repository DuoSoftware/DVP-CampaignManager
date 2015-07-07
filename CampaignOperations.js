/**
 * Created by Rajinda on 6/26/2015.
 */
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('DVP-DBModels');

function StartCampaign(campaignId, dialerId, callback) {

    DbConn.GetOngoingCampaign
        .update(
        {
            CampaignState: 'start'
        },
        {
            where: [{DialerId: dialerId}, {CampaignId: campaignId}]
        }
    ).complete(function (err, cmp) {

            if (err) {

                logger.error('[DVP-CampaignOperations.StartCampaign] - [%s] - [PGSQL] - StartCampaign  failed', campaignId, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback(jsonString, undefined);
            }
            else {
                logger.debug('[DVP-CampaignOperations.StartCampaign] - [%s] - [PGSQL] - StartCampaign successfully ', campaignId);
                var jsonString = messageFormatter.FormatMessage(cmp, "success", true, undefined);
                callback(undefined, jsonString);
            }
        });

}

function StopCampaign(campaignId, callback) {
    DbConn.GetOngoingCampaign
        .update(
        {
            CampaignState: 'stop'
        },
        {
            where: [{DialerId: dialerId}, {CampaignId: campaignId}]
        }
    ).complete(function (err, cmp) {

            if (err) {

                logger.error('[DVP-CampaignOperations.StopCampaign] - [%s] - [PGSQL] - StopCampaign  failed', campaignId, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback(jsonString, undefined);
            }
            else {
                logger.debug('[DVP-CampaignOperations.StopCampaign] - [%s] - [PGSQL] - StopCampaign successfully ', campaignId);
                var jsonString = messageFormatter.FormatMessage(cmp, "success", true, undefined);
                callback(undefined, jsonString);
            }
        });
}

function PauseCampaign(campaignId, callback) {
    DbConn.GetOngoingCampaign
        .update(
        {
            CampaignState: 'pause'
        },
        {
            where: [{DialerId: dialerId}, {CampaignId: campaignId}]
        }
    ).complete(function (err, cmp) {

            if (err) {

                logger.error('[DVP-CampaignOperations.PauseCampaign] - [%s] - [PGSQL] - PauseCampaign  failed', campaignId, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback(jsonString, undefined);
            }
            else {
                logger.debug('[DVP-CampaignOperations.PauseCampaign] - [%s] - [PGSQL] - PauseCampaign successfully ', campaignId);
                var jsonString = messageFormatter.FormatMessage(cmp, "success", true, undefined);
                callback(undefined, jsonString);
            }
        });
}

function ResumeCampaign(campaignId, callback) {


    DbConn.CampOngoingCampaign.find({where: [{CampaignState: 'pause'}, {CampaignId: campaignId}]}).complete(function (errDev, resDev) {
        if (errDev) {
            logger.error('[DVP-CampaignOperations.ResumeCampaign] - [PGSQL] - Error occurred find records of Campaing %s ', campaignId, errDev);
            var jsonString = messageFormatter.FormatMessage(errDev, "EXCEPTION", false, undefined);
            callback(jsonString, undefined);
        }
        else {
            if (resDev) {

                DbConn.GetOngoingCampaign
                    .update(
                    {
                        CampaignState: 'start'
                    },
                    {
                        where: {CampaignId: campaignId}
                    }
                ).complete(function (err, cmp) {

                        if (err) {

                            logger.error('[DVP-CampaignOperations.PauseCampaign] - [%s] - [PGSQL] - ResumeCampaign  failed', campaignId, err);
                            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                            callback(jsonString, undefined);
                        }
                        else {
                            logger.debug('[DVP-CampaignOperations.PauseCampaign] - [%s] - [PGSQL] - ResumeCampaign successfully ', campaignId);
                            var jsonString = messageFormatter.FormatMessage(cmp, "success", true, undefined);
                            callback(undefined, jsonString);
                        }
                    });
            }
            else {
                var jsonString = messageFormatter.FormatMessage(new Error('Invalid Campaign ID'), "EXCEPTION", false, undefined);
                callback(jsonString, undefined);
            }
        }
    })


}

function EndCampaign(campaignId, callback) {

    DbConn.GetOngoingCampaign
        .update(
        {
            CampaignState: 'done'
        },
        {
            where: {CampaignId: campaignId}
        }
    ).complete(function (err, cmp) {

            if (err) {

                logger.error('[DVP-CampaignOperations.EndCampaign] - [%s] - [PGSQL] - EndCampaign  failed', campaignId, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback(jsonString, undefined);
            }
            else {
                logger.debug('[DVP-CampaignOperations.EndCampaign] - [%s] - [PGSQL] - EndCampaign successfully ', campaignId);
                var jsonString = messageFormatter.FormatMessage(cmp, "success", true, undefined);
                callback(undefined, jsonString);
            }
        });
}

/*
 Dialer should call this method every 5 min
 */
function UpdateOperationState(campaignId, dialerId, callback) {

    DbConn.GetOngoingCampaign
        .update(
        {
            updatedAt: new Date()
        },
        {
            where: [{CampaignId: campaignId}, {DialerId: dialerId}]
        }
    ).complete(function (err, cmp) {

            if (err) {

                logger.error('[DVP-CampaignOperations.EndCampaign] - [%s] - [PGSQL] - EndCampaign  failed', campaignId, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback(jsonString, undefined);
            }
            else {
                logger.debug('[DVP-CampaignOperations.EndCampaign] - [%s] - [PGSQL] - EndCampaign successfully ', campaignId);
                var jsonString = messageFormatter.FormatMessage(cmp, "success", true, undefined);
                callback(undefined, jsonString);
            }
        });
}


module.exports.StartCampaign = StartCampaign;
module.exports.StopCampaign = StopCampaign;
module.exports.PauseCampaign = PauseCampaign;
module.exports.ResumeCampaign = ResumeCampaign;
module.exports.EndCampaign = EndCampaign;
module.exports.UpdateOperationState = UpdateOperationState;
