/**
 * Created by Rajinda on 6/26/2015.
 */
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('dvp-dbmodels');
var Sequelize = require('sequelize');

function StartCampaign(campaignId, dialerId,tenantId,companyId, callback) {
    var jsonString;
    DbConn.CampOngoingCampaign.find({where: [{CampaignId: campaignId}, {DialerId: dialerId}]}).then(function ( cmp) {
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
            ).then(function (cmp) {
                    logger.info('[DVP-CampaignOperations.StartCampaign] - [%s] - [PGSQL] - StartCampaign successfully ', campaignId);
                    jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
                    callback.end(jsonString);
                }).error(function (err) {
                    logger.error('[DVP-CampaignOperations.StartCampaign] - [%s] - [PGSQL] - StartCampaign  failed', campaignId, err);
                    jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                    callback.end(jsonString);
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
            ).then(function (cmp) {
                    logger.info('[DVP-CampaignOperations.StartCampaign-create] - [%s] - [PGSQL] - StartCampaign successfully ', campaignId);

                    DbConn.CampCampaignInfo
                        .update(
                        {
                            OperationalStatus: "ongoing"
                        },
                        {
                            where: [{CampaignId: campaignId}]
                        }
                    ).then(function (cmp) {
                            logger.info('[DVP-CampaignOperations.StartCampaign-create-update OperationalStatus] - [%s] - [PGSQL] - StartCampaign successfully ', campaignId);
                            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
                            callback.end(jsonString);
                        }).error(function (err) {
                            logger.error('[DVP-CampaignOperations.StartCampaign-create-update OperationalStatus] - [%s] - [PGSQL] - StartCampaign  failed', campaignId, err);
                            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                            callback.end(jsonString);
                        });
                }).error(function (err) {
                    logger.error('[DVP-CampaignOperations.StartCampaign-create] - [%s] - [PGSQL] - StartCampaign  failed', campaignId, err);
                    jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                    callback.end(jsonString);
                });
        }
    }).error(function (err) {
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        logger.error('[DVP-GetOngoingCampaign.find] - [%s] - [%s] - [PGSQL]  - Error in searching.', campaignId, dialerId, err);
        callback.end(jsonString);
    });


}

function StopCampaign(campaignId, callback) {
    var jsonString;
    DbConn.CampOngoingCampaign
        .update(
        {
            CampaignState: 'stop'
        },
        {
            where: [{CampaignId: campaignId}]
        }
    ).then(function ( cmp) {
            logger.info('[DVP-CampaignOperations.StopCampaign] - [%s] - [PGSQL] - StopCampaign successfully ', campaignId);
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
            callback.end(jsonString);
        }).error(function (err) {
            logger.error('[DVP-CampaignOperations.StopCampaign] - [%s] - [PGSQL] - StopCampaign  failed', campaignId, err);
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
}

function PauseCampaign(campaignId, callback) {
    var jsonString;
    DbConn.CampOngoingCampaign
        .update(
        {
            CampaignState: 'pause'
        },
        {
            where: [{CampaignId: campaignId}]
        }
    ).then(function (cmp) {
            logger.info('[DVP-CampaignOperations.PauseCampaign] - [%s] - [PGSQL] - PauseCampaign successfully ', campaignId);
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
            callback.end(jsonString);
        }).error(function (err) {
            logger.error('[DVP-CampaignOperations.PauseCampaign] - [%s] - [PGSQL] - PauseCampaign  failed', campaignId, err);
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
}

function ResumeCampaign(campaignId, callback) {

    var jsonString;
    DbConn.CampOngoingCampaign.find({where: [{CampaignState: 'pause'}, {CampaignId: campaignId}]}).then(function (resDev) {
        if (resDev) {

            DbConn.CampOngoingCampaign
                .update(
                {
                    CampaignState: 'start'
                },
                {
                    where: {CampaignId: campaignId}
                }
            ).then(function (cmp) {
                    logger.info('[DVP-CampaignOperations.PauseCampaign] - [%s] - [PGSQL] - ResumeCampaign successfully ', campaignId);
                    jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
                    callback.end(jsonString);
                }).error(function (err) {
                    logger.error('[DVP-CampaignOperations.PauseCampaign] - [%s] - [PGSQL] - ResumeCampaign  failed', campaignId, err);
                    jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                    callback.end(jsonString);
                });
        }
        else {
            jsonString = messageFormatter.FormatMessage(new Error('Invalid Campaign ID'), "EXCEPTION", false, undefined);
            callback.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampaignOperations.ResumeCampaign] - [PGSQL] - Error occurred find records of Campaing %s ', campaignId, err);
        jsonString = messageFormatter.FormatMessage(errDev, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    });
}

function EndCampaign(campaignId, callback) {
    var jsonString;
    DbConn.CampOngoingCampaign
        .update(
        {
            CampaignState: 'done'
        },
        {
            where: {CampaignId: campaignId}
        }
    ).then(function (cmp) {
            logger.info('[DVP-CampaignOperations.EndCampaign] - [%s] - [PGSQL] - EndCampaign successfully ', campaignId);
            DbConn.CampCampaignInfo
                .update(
                {
                    OperationalStatus: "done"
                },
                {
                    where: [{CampaignId: campaignId}]
                }
            ).then(function (cmp) {
                    logger.info('[DVP-CampaignOperations.EndCampaign-create-update OperationalStatus] - [%s] - [PGSQL] - EndCampaign successfully ', campaignId);
                    jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
                    callback.end(jsonString);
                }).error(function (err) {
                    logger.error('[DVP-CampaignOperations.EndCampaign-create-update OperationalStatus] - [%s] - [PGSQL] - EndCampaign  failed', campaignId, err);
                    jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                    callback.end(jsonString);
                });
        }).error(function (err) {
            logger.error('[DVP-CampaignOperations.EndCampaign] - [%s] - [PGSQL] - EndCampaign  failed', campaignId, err);
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
}

/*
 Dialer should call this method every 5 min
 */
function UpdateOperationState(campaignId, dialerId, campaignState, callback) {
    var jsonString;
    DbConn.CampOngoingCampaign
        .update(
        {
            LastResponsTime: new Date()
        },
        {
            where: [{CampaignId: campaignId}, {DialerId: dialerId},{CampaignState: campaignState}]
        }
    ).then(function (cmp) {

            logger.info('[DVP-CampaignOperations.UpdateOperationState] - [%s] - [PGSQL] - UpdateOperationState successfully ', campaignId);
            DbConn.CampOngoingCampaign.find({where: [{CampaignId: campaignId}, {DialerId: dialerId}],attributes: ['CampaignId','DialerId','CampaignState']}).then(function (sta) {
                logger.info('[DVP-CampaignOperations.UpdateOperationState-findAll] - [%s] - [PGSQL] - UpdateOperationState successfully ', campaignId);
                jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, sta);
                callback.end(jsonString);
            }).error(function (err) {
                logger.error('[DVP-CampaignOperations.UpdateOperationState-findAll] - [%s] - [PGSQL] - UpdateOperationState  failed', campaignId, err);
                jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback.end(jsonString);
            });
        }).error(function (err) {
            logger.error('[DVP-CampaignOperations.UpdateOperationState] - [%s] - [PGSQL] - UpdateOperationState  failed', campaignId, err);
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
}

function GetPendingCampaign(tenantId, companyId, callback) {

    var jsonString ;
    try {



        DbConn.CampOngoingCampaign.findAll({where: [ Sequelize.or({CampaignState: 'stop'}, {CampaignState: 'pause'}, {CampaignState: 'resume'})],
            include:[{model: DbConn.CampCampaignInfo,
                as: "CampCampaignInfo", where:[{TenantId: tenantId}, {CompanyId: companyId}]}]

        }).then(function (CamObject) {
            if (CamObject) {
                logger.info('[DVP-CampCampaignInfo.GetPendingCampaign] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callback.end(jsonString);
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetPendingCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }
        }).error(function (err) {
            logger.error('[DVP-CampCampaignInfo.GetPendingCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [%s] - [PGSQL]  - Error %s - %s  ', tenantId, companyId, ex);
        jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    }
}

function GetPendingCampaignByDialerId(tenantId, companyId, dialerId, callback) {
    var jsonString;
    try {

        DbConn.CampOngoingCampaign.findAll({where: [{DialerId: dialerId}, Sequelize.or({CampaignState: 'stop'}, {CampaignState: 'pause'}, {CampaignState: 'resume'})],
            include:[{model: DbConn.CampCampaignInfo,
                as: "CampCampaignInfo", where:[{TenantId: tenantId}, {CompanyId: companyId}]}]}).then(function (CamObject) {
            if (CamObject) {
                logger.info('[DVP-CampCampaignInfo.GetPendingCampaign] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callback.end(jsonString);
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetPendingCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }
        }).error(function (err) {
            logger.error('[DVP-CampCampaignInfo.GetPendingCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [%s] - [PGSQL]  - Error %s - %s  ', tenantId, companyId, ex);
        jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    }
}

function GetOngoingCampaign(tenantId, companyId, callback) {
    var jsonString;
    try {

        DbConn.CampOngoingCampaign.findAll({where: [{CampaignState: 'start'}],
            include:[{model: DbConn.CampCampaignInfo,
                as: "CampCampaignInfo", where:[{TenantId: tenantId}, {CompanyId: companyId}]}]
        }).then(function (CamObject) {
            if (CamObject) {
                logger.info('[DVP-CampCampaignInfo.GetOngoingCampaign] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callback.end(jsonString);
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetOngoingCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }
        }).error(function (err) {
            logger.error('[DVP-CampCampaignInfo.GetOngoingCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetOngoingCampaign] - [%s] - [PGSQL]  - Error %s - %s  ', tenantId, companyId, ex);
        jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
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
module.exports.GetOngoingCampaign = GetOngoingCampaign;
