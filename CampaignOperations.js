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
                callback(err, undefined);
            }
            else {
                logger.debug('[DVP-CampaignOperations.StartCampaign] - [%s] - [PGSQL] - StartCampaign successfully ', campaignId);
                callback(undefined, cmp);
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
                callback(err, undefined);
            }
            else {
                logger.debug('[DVP-CampaignOperations.StopCampaign] - [%s] - [PGSQL] - StopCampaign successfully ', campaignId);
                callback(undefined, cmp);
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
                callback(err, undefined);
            }
            else {
                logger.debug('[DVP-CampaignOperations.PauseCampaign] - [%s] - [PGSQL] - PauseCampaign successfully ', campaignId);
                callback(undefined, cmp);
            }
        });
}

function ResumeCampaign(campaignId, callback) {


    DbConn.CampOngoingCampaign.find({where: [{CampaignState: 'pause'}, {CampaignId: campaignId}]}).complete(function (errDev, resDev) {
        if (errDev) {
            logger.error('[DVP-CampaignOperations.ResumeCampaign] - [PGSQL] - Error occurred find records of Campaing %s ', campaignId, errDev);
            callback(errDev, undefined);
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
                            callback(err, undefined);
                        }
                        else {
                            logger.debug('[DVP-CampaignOperations.PauseCampaign] - [%s] - [PGSQL] - ResumeCampaign successfully ', campaignId);
                            callback(undefined, cmp);
                        }
                    });
            }
            else {
                callback(new Error('Invalid Campaign ID'), undefined);
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
                callback(err, undefined);
            }
            else {
                logger.debug('[DVP-CampaignOperations.EndCampaign] - [%s] - [PGSQL] - EndCampaign successfully ', campaignId);
                callback(undefined, cmp);
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
                callback(err, undefined);
            }
            else {
                logger.debug('[DVP-CampaignOperations.EndCampaign] - [%s] - [PGSQL] - EndCampaign successfully ', campaignId);
                callback(undefined, cmp);
            }
        });
}


module.exports.StartCampaign = StartCampaign;
module.exports.StopCampaign = StopCampaign;
module.exports.PauseCampaign = PauseCampaign;
module.exports.ResumeCampaign = ResumeCampaign;
module.exports.EndCampaign = EndCampaign;
module.exports.UpdateOperationState = UpdateOperationState;
