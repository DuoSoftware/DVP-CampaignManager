/**
 * Created by Rajinda on 6/26/2015.
 */

var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('DVP-DBModels');
var moment = require('moment')
var Sequelize = require('sequelize');

/*
 Campaign has dialout mechanism, channel class and campaign modes, User can select combinations and validation should made from backend and UI components
 */
function CreateCampaign(campaignName, campaignMode, campaignChannel, dialoutMechanism, tenantId, companyId, campaignClass, campaignType, campaignCategory,extension, callback) {


    DbConn.CampCampaignInfo
        .create(
        {
            CampaignName: campaignName,
            CampaignMode: campaignMode,
            CampaignChannel: campaignChannel,
            DialoutMechanism: dialoutMechanism,
            TenantId: tenantId,
            CompanyId: companyId,
            Class: campaignClass,
            Type: campaignType,
            Category: campaignCategory,
            Extensions:extension,
            Status: true
        }
    ).complete(function (err, cmp) {

            if (err) {

                logger.error('[DVP-CampCampaignInfo.CreateCampaign] - [%s] - [PGSQL] - insertion  failed', campaignName, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }
            else {
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
                logger.info('[DVP-CampCampaignInfo.CreateCampaign] - [PGSQL] - inserted successfully. [%s] ', jsonString);
                callback.end(jsonString);
            }
        });


    /*

     var CampaignObject = DbConn.CampCampaignInfo.build(
     {
     CampaignName: campaignName,
     CampaignMode: campaignMode,
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
     callback.end(err, undefined);
     }else{
     logger.info('[DVP-CampaignManager] - [%s] - [PGSQL] - New Campaign %s is added successfully',req.body);
     callback.end(undefined,result);
     }


     });*/
}

function EditCampaign(campaignId, campaignName, campaignMode, campaignChannel, dialoutMechanism, tenantId, companyId, campaignClass, campaignType, campaignCategory,extension, callback) {

    DbConn.CampCampaignInfo
        .update(
        {
            CampaignName: campaignName,
            CampaignMode: campaignMode,
            CampaignChannel: campaignChannel,
            DialoutMechanism: dialoutMechanism,
            TenantId: tenantId,
            CompanyId: companyId,
            Class: campaignClass,
            Type: campaignType,
            Category: campaignCategory,
            Extensions:extension,
            Status: true
        },
        {
            where: {
                id: campaignId
            }
        }
    ).then(function (results) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampCampaignInfo.EditCampaign] - [PGSQL] - Updated successfully.[%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampCampaignInfo.EditCampaign] - [%s] - [PGSQL] - Updation failed', campaignId, err);
            callback.end(jsonString);
        });


}

function DeleteCampaign(campaignId, tenantId, companyId, callback) {

    try {

        DbConn.CampCampaignInfo
            .update(
            {
                Status: false
            },
            {
                where: [{id: campaignId}, {TenantId: tenantId}, {CompanyId: companyId}]
            }
        ).then(function (results) {
                logger.info('[DVP-CampCampaignInfo.DeleteCampaign] - [%s] - [PGSQL] - Updated successfully', campaignId);
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
                callback.end(jsonString);

            }).error(function (err) {
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                logger.error('[DVP-CampCampaignInfo.DeleteCampaign] - [PGSQL] - Updation failed. [%s]', jsonString, err);
                callback.end(jsonString);
            });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.DeleteCampaign] - [%s] - [PGSQL] - Exception in updating.', campaignId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    }
}

function GetAllCampaign(tenantId, companyId, callback) {

    try {

        /*

         DbConn.Extension.find({where: [{Extension: Ext}, {TenantId: Tenant},{CompanyId:Company}],
         include: [{model: DbConn.SipUACEndpoint, as: "SipUACEndpoint"}]}).complete(function (errExtUser, resExtUser) {


         */

        //DbConn.CampCampaignInfo.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}, {Status: true}]}).complete(function (err, CamObject) {

        DbConn.CampCampaignInfo.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}, {Status: true}]}).complete(function (err, CamObject) {

            if (err) {
                logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }
            else {

                if (CamObject) {
                    logger.debug('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                    var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);

                    callback.end(jsonString);
                }
                else {
                    logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                    var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                    callback.end(jsonString);
                }

            }
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [PGSQL]  - Error %s - %s  ', tenantId, companyId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    }
}

function GetAllCampaignPage(tenantId, companyId,count, callback) {

    try {
        DbConn.CampCampaignInfo.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}, {Status: true}],limit :count,order: 'id DESC' }).complete(function (err, CamObject) {

            if (err) {
                logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }
            else {

                if (CamObject) {
                    logger.debug('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                    var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);

                    callback.end(jsonString);
                }
                else {
                    logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                    var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                    callback.end(jsonString);
                }

            }
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [PGSQL]  - Error %s - %s  ', tenantId, companyId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    }
}



function GetAllCampaignByCampaignId(tenantId, companyId, campaignId, callback) {

    try {
        DbConn.CampCampaignInfo.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}, {id: campaignId}]}).complete(function (err, CamObject) {

            if (err) {
                logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }

            else {

                if (CamObject) {
                    logger.debug('[DVP-CampCampaignInfo.GetAllCampaignByCampaignId] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                    var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                    callback.end(jsonString);
                }
                else {
                    logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                    var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                    callback.end(jsonString);
                }
            }
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignId] - [%s] - [PGSQL]  - Error %s - %s  ', tenantId, companyId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    }
}

function GetOngoingCampaign(tenantId, companyId, callback) {

    try {
        DbConn.CampOngoingCampaign.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}]}).complete(function (err, CamObject) {

            if (err) {
                logger.error('[DVP-CampCampaignInfo.GetOngoingCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }

            else {

                if (CamObject) {
                    logger.debug('[DVP-CampCampaignInfo.GetOngoingCampaign] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                    var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                    callback.end(jsonString);
                }
                else {
                    logger.error('[DVP-CampCampaignInfo.GetOngoingCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                    var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                    callback.end(jsonString);
                }
            }
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetOngoingCampaign] - [%s] - [PGSQL]  - Error %s - %s  ', tenantId, companyId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    }
}

function GetAllCampaignByCampaignState(tenantId, companyId, campaignState, callback) {

    try {
        DbConn.CampOngoingCampaign.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}, {CampaignState: campaignState}, {Status: true}]}).complete(function (err, CamObject) {

            if (err) {
                logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }

            else {

                if (CamObject) {
                    logger.debug('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                    var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                    callback.end(jsonString);
                }
                else {
                    logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
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
        {where: [Sequelize.and({DialerId: dialerId}, {TenantId: tenantId},{CompanyId:companyId}, Sequelize.or({CampaignState: 'stop'}, {CampaignState: 'pause'}, {CampaignState: 'resume'}))]}



        DbConn.CampOngoingCampaign.findAll().complete(function (err, CamObject) {

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

function GetOfflineCampaign(tenantId, companyId, callback) {

    DbConn.CampOngoingCampaign.findAll({where: [{TenantId: tenantId}, {CompanyId: companyId}]}).complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampCampaignInfo.GetOfflineCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
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
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callback.end(jsonString);
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetOfflineCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }
        }
    });
}

module.exports.CreateCampaign = CreateCampaign;
module.exports.EditCampaign = EditCampaign;
module.exports.DeleteCampaign = DeleteCampaign;
module.exports.GetAllCampaign = GetAllCampaign;
module.exports.GetAllCampaignPage = GetAllCampaignPage;
module.exports.GetAllCampaignByCampaignId = GetAllCampaignByCampaignId;
module.exports.GetOngoingCampaign = GetOngoingCampaign;
module.exports.GetAllCampaignByCampaignState = GetAllCampaignByCampaignState;
module.exports.GetPendingCampaign = GetPendingCampaign;
module.exports.GetOfflineCampaign = GetOfflineCampaign;