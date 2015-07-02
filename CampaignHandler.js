/**
 * Created by Rajinda on 6/26/2015.
 */

var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('DVP-DBModels');
var moment = require('moment')

/*
 Campaign has dialout mechanism, channel class and campaign modes, User can select combinations and validation should made from backend and UI components
 */
function CreateCampaign(campaignName, campaignMode, campaignChannel, dialoutMechanism, tenantId, companyId, campaignClass, campaignType, campaignCategory, callback) {

    DbConn.CampCampaignInfo
        .create(
        {
            CampaignName: campaignName,
            CampaignnMode: campaignMode,
            CampaignChannel: campaignChannel,
            DialoutMechanism: dialoutMechanism,
            TenantId: tenantId,
            CompanyId: companyId,
            Class: campaignClass,
            Type: campaignType,
            Category: campaignCategory,
            Status: true
        }
    ).complete(function (err, cmp) {

            if (err) {

                logger.error('[DVP-CampCampaignInfo.CreateCampaign] - [%s] - [PGSQL] - insertion  failed', campaignName, err);
                callback(err, undefined);
            }
            else {
                logger.debug('[DVP-CampCampaignInfo.CreateCampaign] - [%s] - [PGSQL] - inserted successfully ', campaignName);
                callback(undefined, cmp);
            }
        });


    /*

     var CampaignObject = DbConn.CampCampaignInfo.build(
     {
     CampaignName: campaignName,
     CampaignnMode: campaignMode,
     CampaignChannel: campaignChannel,
     DialoutMechanism: dialoutMechanism,
     TenantId: tenantId,
     CompanyId: companyId,
     Class: campaignClass,
     Type: campaignType,
     Category: campaignCategory
     }
     )

     CampaignObject.save().complete(function (err, result) {

     if(err)
     {
     logger.error('[DVP-CampaignManager] - [%s] - [PGSQL] - New Schedule %s saving failed unsuccessful',req.body,err);
     //var jsonString = messageFormatter.FormatMessage(err, "AppObject saving error", false, result);
     callback(err, undefined);
     }else{
     logger.info('[DVP-CampaignManager] - [%s] - [PGSQL] - New Campaign %s is added successfully',req.body);
     callback(undefined,result);
     }


     });*/
}

function EditCampaign(campaignId, campaignMode, campaignChannel, dialoutMechanism, tenantId, companyId, campaignClass, campaignType, campaignCategory, callback) {

    try {
        logger.info('[DVP-CampCampaignInfo.EditCampaign] - [%s]  ', campaignId);
        DbConn.CampCampaignInfo
            .update(
            {
                CampaignName: campaignName,
                CampaignnMode: campaignMode,
                CampaignChannel: campaignChannel,
                DialoutMechanism: dialoutMechanism,
                TenantId: tenantId,
                CompanyId: companyId,
                Class: campaignClass,
                Type: campaignType,
                Category: campaignCategory,
                Status: true
            },
            {
                where: {
                    CompanyId: campaignId
                }
            }
        ).then(function (results) {


                logger.debug('[DVP-CampCampaignInfo.EditCampaign] - [%s] - [PGSQL] - Updated successfully', campaignId);
                callback(undefined, results);

            }).error(function (err) {
                logger.error('[DVP-CampCampaignInfo.EditCampaign] - [%s] - [PGSQL] - Updation failed', campaignId, err);
                callback(err, undefined);
            });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.EditCampaign] - [%s] - [PGSQL] - Exception in updating.', campaignId, ex);
        callback(ex, undefined);
    }
}

function DeleteCampaign(campaignId, callback) {

    try {
        logger.info('[DVP-CampCampaignInfo.DeleteCampaign] - [%s]  ', campaignId);
        DbConn.CampCampaignInfo
            .update(
            {
                Status: false
            },
            {
                where: {
                    CompanyId: campaignId
                }
            }
        ).then(function (results) {


                logger.debug('[DVP-CampCampaignInfo.DeleteCampaign] - [%s] - [PGSQL] - Updated successfully', campaignId);
                callback(undefined, results);

            }).error(function (err) {
                logger.error('[DVP-CampCampaignInfo.DeleteCampaign] - [%s] - [PGSQL] - Updation failed', campaignId, err);
                callback(err, undefined);
            });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.DeleteCampaign] - [%s] - [PGSQL] - Exception in updating.', campaignId, ex);
        callback(ex, undefined);
    }
}

function GetAllCampaign(tenantId, companyId, callback) {

    try {
        DbConn.CampCampaignInfo.find({where: [{CompanyId: companyId}, {TenantId: tenantId}]}).complete(function (err, CamObject) {

            if (err) {
                logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
                callback(err, undefined);
            }

            else {

                if (CamObject) {
                    logger.debug('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                    console.log(CamObject);
                    callback(undefined, CamObject);
                }
                else {
                    logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                    callback(new Error('No record'), undefined);
                }
            }
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [PGSQL]  - Error %s - %s  ', tenantId, companyId, ex);
        callback(ex, undefined);
    }
}

function GetAllCampaignByCampaignId(tenantId, companyId, campaignId, callback) {

    try {
        DbConn.CampCampaignInfo.find({where: [{CompanyId: companyId}, {TenantId: tenantId}, {CampaignId: campaignId}]}).complete(function (err, CamObject) {

            if (err) {
                logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
                callback(err, undefined);
            }

            else {

                if (CamObject) {
                    logger.debug('[DVP-CampCampaignInfo.GetAllCampaignByCampaignId] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                    console.log(CamObject);
                    callback(undefined, CamObject);
                }
                else {
                    logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                    callback(new Error('No record'), undefined);
                }
            }
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignId] - [%s] - [PGSQL]  - Error %s - %s  ', tenantId, companyId, ex);
        callback(ex, undefined);
    }
}

function GetOngoingCampaign(tenantId, companyId, callback) {

    try {
        DbConn.CampOngoingCampaign.find({where: [{CompanyId: companyId}, {TenantId: tenantId}]}).complete(function (err, CamObject) {

            if (err) {
                logger.error('[DVP-CampCampaignInfo.GetOngoingCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
                callback(err, undefined);
            }

            else {

                if (CamObject) {
                    logger.debug('[DVP-CampCampaignInfo.GetOngoingCampaign] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                    console.log(CamObject);
                    callback(undefined, CamObject);
                }
                else {
                    logger.error('[DVP-CampCampaignInfo.GetOngoingCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                    callback(new Error('No record'), undefined);
                }
            }
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetOngoingCampaign] - [%s] - [PGSQL]  - Error %s - %s  ', tenantId, companyId, ex);
        callback(ex, undefined);
    }
}

function GetAllCampaignByCampaignState(tenantId, companyId, campaignState, callback) {

    try {
        DbConn.CampOngoingCampaign.find({where: [{CompanyId: companyId}, {TenantId: tenantId}, {CampaignState: campaignState}]}).complete(function (err, CamObject) {

            if (err) {
                logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
                callback(err, undefined);
            }

            else {

                if (CamObject) {
                    logger.debug('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                    console.log(CamObject);
                    callback(undefined, CamObject);
                }
                else {
                    logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                    callback(new Error('No record'), undefined);
                }
            }
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [%s] - [PGSQL]  - Error %s - %s  ', tenantId, companyId, ex);
        callback(ex, undefined);
    }
}

function GetPendingCampaign(tenantId, companyId, dialerId, callback) {
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

        DbConn.CampOngoingCampaign.find({where: Sequelize.and({DialerId: dialerId}, {TenantId: tenantId}, Sequelize.or({CampaignState: 'stop'}, {CampaignState: 'pause'}, {CampaignState: 'resume'}))}).complete(function (err, CamObject) {

            if (err) {
                logger.error('[DVP-CampCampaignInfo.GetPendingCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
                callback(err, undefined);
            }

            else {

                if (CamObject) {
                    logger.debug('[DVP-CampCampaignInfo.GetPendingCampaign] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                    console.log(CamObject);
                    callback(undefined, CamObject);
                }
                else {
                    logger.error('[DVP-CampCampaignInfo.GetPendingCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                    callback(new Error('No record'), undefined);
                }
            }
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [%s] - [PGSQL]  - Error %s - %s  ', tenantId, companyId, ex);
        callback(ex, undefined);
    }
}

function GetOfflineCampaign(tenantId, companyId, callback) {

    DbConn.CampOngoingCampaign.find({where: [{TenantId: tenantId}, {CompanyId: companyId}]}).complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampCampaignInfo.GetOfflineCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            callback(err, undefined);
        }

        else {

            if (CamObject) {

                var endDate = moment(new Date(), 'YYYY-M-DD HH:mm:ss');
                var campaigns = [];
                for (var i = 0; i < CamObject.length; i++) {
                    var startDate = moment(CamObject[i].updatedAt, 'YYYY-M-DD HH:mm:ss');
                    var minutesDiff = endDate.diff(startDate, 'minutes');
                    if (minutesDiff >= 5) {
                        campaigns.push(CamObject)
                    }
                }
                callback(undefined, CamObject);
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetOfflineCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                callback(new Error('No record'), undefined);
            }
        }
    });
}

module.exports.CreateCampaign = CreateCampaign;
module.exports.EditCampaign = EditCampaign;
module.exports.DeleteCampaign = DeleteCampaign;
module.exports.GetAllCampaign = GetAllCampaign;
module.exports.GetAllCampaignByCampaignId = GetAllCampaignByCampaignId;
module.exports.GetOngoingCampaign = GetOngoingCampaign;
module.exports.GetAllCampaignByCampaignState = GetAllCampaignByCampaignState;
module.exports.GetPendingCampaign = GetPendingCampaign;
module.exports.GetOfflineCampaign = GetOfflineCampaign;