/**
 * Created by Rajinda on 6/26/2015.
 */
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('DVP-DBModels');

function StartCampaign(campaignId, dialerId, callback) {

    DbConn.CampOngoingCampaign.find({where: [{CampaignId: campaignId}, {DialerId: dialerId}]}).complete(function (err, cmp) {

        if (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-GetOngoingCampaign.find] - [%s] - [%s] - [PGSQL]  - Error in searching.', campaignId, dialerId, err);
            callback.end(jsonString);
        }

        else {

            if (cmp) {
                logger.info('[DVP-CampCampaignInfo.StartCampaign find exsiting item] - [%s] - [PGSQL]  - Data found  - %s', campaignId, dialerId, JSON.stringify(cmp));

                DbConn.CampOngoingCampaign
                    .update(
                    {
                        CampaignState: 'start',
                        LastResponsTime: new Date()
                    },
                    {
                        where: [{DialerId: dialerId}, {CampaignId: campaignId}]
                    }
                ).complete(function (err, cmp) {

                        if (err) {

                            logger.error('[DVP-CampaignOperations.StartCampaign] - [%s] - [PGSQL] - StartCampaign  failed', campaignId, err);
                            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                            callback.end(jsonString);
                        }
                        else {
                            logger.debug('[DVP-CampaignOperations.StartCampaign] - [%s] - [PGSQL] - StartCampaign successfully ', campaignId);
                            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
                            callback.end(jsonString);
                        }
                    });
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [PGSQL]  - No record found for %s - %s  ', campaignId, dialerId);

                DbConn.CampOngoingCampaign
                    .create(
                    {
                        CampaignId: campaignId,
                        DialerId: dialerId,
                        LastResponsTime: new Date(),
                        CampaignState: 'start'
                    }
                ).complete(function (err, cmp) {

                        if (err) {

                            logger.error('[DVP-CampaignOperations.StartCampaign-create] - [%s] - [PGSQL] - StartCampaign  failed', campaignId, err);
                            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                            callback.end(jsonString);
                        }
                        else {
                            logger.debug('[DVP-CampaignOperations.StartCampaign-create] - [%s] - [PGSQL] - StartCampaign successfully ', campaignId);

                            DbConn.CampCampaignInfo
                                .update(
                                {
                                    OperationalStatus:"ongoing"
                                },
                                {
                                    where: [{id : campaignId}]
                                }
                            ).complete(function (err, cmp) {

                                    if (err) {

                                        logger.error('[DVP-CampaignOperations.StartCampaign-create-update OperationalStatus] - [%s] - [PGSQL] - StartCampaign  failed', campaignId, err);
                                        var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                                        callback.end(jsonString);
                                    }
                                    else {
                                        logger.debug('[DVP-CampaignOperations.StartCampaign-create-update OperationalStatus] - [%s] - [PGSQL] - StartCampaign successfully ', campaignId);
                                        var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
                                        callback.end(jsonString);
                                    }
                                });
                        }
                    });
            }
        }

    });


}

function StopCampaign(campaignId, callback) {
    DbConn.CampOngoingCampaign
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
                callback.end(jsonString);
            }
            else {
                logger.debug('[DVP-CampaignOperations.StopCampaign] - [%s] - [PGSQL] - StopCampaign successfully ', campaignId);
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
                callback.end(jsonString);
            }
        });
}

function PauseCampaign(campaignId, callback) {
    DbConn.CampOngoingCampaign
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
                callback.end(jsonString);
            }
            else {
                logger.debug('[DVP-CampaignOperations.PauseCampaign] - [%s] - [PGSQL] - PauseCampaign successfully ', campaignId);
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
                callback.end(jsonString);
            }
        });
}

function ResumeCampaign(campaignId, callback) {


    DbConn.CampOngoingCampaign.find({where: [{CampaignState: 'pause'}, {CampaignId: campaignId}]}).complete(function (errDev, resDev) {
        if (errDev) {
            logger.error('[DVP-CampaignOperations.ResumeCampaign] - [PGSQL] - Error occurred find records of Campaing %s ', campaignId, errDev);
            var jsonString = messageFormatter.FormatMessage(errDev, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        }
        else {
            if (resDev) {

                DbConn.CampOngoingCampaign
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
                            callback.end(jsonString);
                        }
                        else {
                            logger.debug('[DVP-CampaignOperations.PauseCampaign] - [%s] - [PGSQL] - ResumeCampaign successfully ', campaignId);
                            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
                            callback.end(jsonString);
                        }
                    });
            }
            else {
                var jsonString = messageFormatter.FormatMessage(new Error('Invalid Campaign ID'), "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }
        }
    })


}

function EndCampaign(campaignId, callback) {

    DbConn.CampOngoingCampaign
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
                callback.end(jsonString);
            }
            else {
                logger.debug('[DVP-CampaignOperations.EndCampaign] - [%s] - [PGSQL] - EndCampaign successfully ', campaignId);
                DbConn.CampCampaignInfo
                    .update(
                    {
                        OperationalStatus:"done"
                    },
                    {
                        where: [{id : campaignId}]
                    }
                ).complete(function (err, cmp) {

                        if (err) {

                            logger.error('[DVP-CampaignOperations.EndCampaign-create-update OperationalStatus] - [%s] - [PGSQL] - EndCampaign  failed', campaignId, err);
                            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                            callback.end(jsonString);
                        }
                        else {
                            logger.debug('[DVP-CampaignOperations.EndCampaign-create-update OperationalStatus] - [%s] - [PGSQL] - EndCampaign successfully ', campaignId);
                            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
                            callback.end(jsonString);
                        }
                    });
            }
        });
}

/*
 Dialer should call this method every 5 min
 */
function UpdateOperationState(campaignId, dialerId,campaignState, callback) {

    DbConn.CampOngoingCampaign
        .update(
        {
            updatedAt: new Date(),
            CampaignState:campaignState
        },
        {
            where: [{CampaignId: campaignId}, {DialerId: dialerId}]
        }
    ).complete(function (err, cmp) {

            if (err) {

                logger.error('[DVP-CampaignOperations.EndCampaign] - [%s] - [PGSQL] - EndCampaign  failed', campaignId, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }
            else {
                logger.debug('[DVP-CampaignOperations.EndCampaign] - [%s] - [PGSQL] - EndCampaign successfully ', campaignId);
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
                callback.end(jsonString);
            }
        });
}

function GetPendingCampaign(tenantId, companyId, callback) {
    try {

        /*
         var condition = {
         where: Sequelize.and(
         { name: 'a project' },
         Sequelize.or(
         { id: [1,2,3] },
         { id: { lt: 10 } }
         )
         )
         };
         */


        DbConn.CampOngoingCampaign.findAll({where: [Sequelize.and( {TenantId: tenantId},{CompanyId:companyId}, Sequelize.or({CampaignState: 'stop'}, {CampaignState: 'pause'}, {CampaignState: 'resume'}))]}).complete(function (err, CamObject) {

            if (err) {
                logger.error('[DVP-CampCampaignInfo.GetPendingCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }

            else {

                if (CamObject) {
                    logger.debug('[DVP-CampCampaignInfo.GetPendingCampaign] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                    var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                    callback.end(jsonString);
                }
                else {
                    logger.error('[DVP-CampCampaignInfo.GetPendingCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                    var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                    callback.end(jsonString);
                }
            }
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [%s] - [PGSQL]  - Error %s - %s  ', tenantId, companyId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    }
}


function GetPendingCampaignByDialerId(tenantId, companyId, dialerId, callback) {
    try {

        /*
         var condition = {
         where: Sequelize.and(
         { name: 'a project' },
         Sequelize.or(
         { id: [1,2,3] },
         { id: { lt: 10 } }
         )
         )
         };
         */




        DbConn.CampOngoingCampaign.findAll({where: [Sequelize.and({DialerId: dialerId}, {TenantId: tenantId},{CompanyId:companyId}, Sequelize.or({CampaignState: 'stop'}, {CampaignState: 'pause'}, {CampaignState: 'resume'}))]}).complete(function (err, CamObject) {

            if (err) {
                logger.error('[DVP-CampCampaignInfo.GetPendingCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }

            else {

                if (CamObject) {
                    logger.debug('[DVP-CampCampaignInfo.GetPendingCampaign] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                    var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                    callback.end(jsonString);
                }
                else {
                    logger.error('[DVP-CampCampaignInfo.GetPendingCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                    var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                    callback.end(jsonString);
                }
            }
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [%s] - [PGSQL]  - Error %s - %s  ', tenantId, companyId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    }
}


module.exports.StartCampaign = StartCampaign;
module.exports.StopCampaign = StopCampaign;
module.exports.PauseCampaign = PauseCampaign;
module.exports.ResumeCampaign = ResumeCampaign;
module.exports.EndCampaign = EndCampaign;
module.exports.UpdateOperationState = UpdateOperationState;
module.exports.GetPendingCampaign = GetPendingCampaign;
module.exports.GetPendingCampaignByDialerId = GetPendingCampaignByDialerId;
