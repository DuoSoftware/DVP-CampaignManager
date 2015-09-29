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
function CreateCampaign(campaignName, campaignMode, campaignChannel, dialoutMechanism, tenantId, companyId, campaignClass, campaignType, campaignCategory, extension, callback) {


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
            Extensions: extension,
            OperationalStatus: "create",
            Status: true
        }
    ).then(function ( cmp) {
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
            logger.info('[DVP-CampCampaignInfo.CreateCampaign] - [PGSQL] - inserted successfully. [%s] ', jsonString);
            callback.end(jsonString);
        }).error(function (err) {
            logger.error('[DVP-CampCampaignInfo.CreateCampaign] - [%s] - [PGSQL] - insertion  failed-[%s]', campaignName, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
}

function StartCampaign(campaignId, tenantId, companyId, callback) {

    DbConn.CampCampaignInfo
        .update(
        {
            OperationalStatus: "start",
            Status: true
        },
        {
            where: {
                CampaignId: campaignId
            }
        }
    ).then(function (results) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampCampaignInfo.StartCampaign] - [PGSQL] - Updated successfully.[%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampCampaignInfo.StartCampaign] - [%s] - [PGSQL] - Updation failed-[%s]', campaignId, err);
            callback.end(jsonString);
        });


}

function EditCampaign(campaignId, campaignName, campaignMode, campaignChannel, dialoutMechanism, tenantId, companyId, campaignClass, campaignType, campaignCategory, extension, callback) {

    DbConn.CampOngoingCampaign
        .find(
        {
            where: [{CampaignId: campaignId},{CampaignState: 'ongoing'}]
        }
    ).then(function ( cmp) {
            if(!cmp){
                var err = new Error("Try to modify ongoing Campaign");
                logger.error('[DVP-CampCampaignInfo.EditCampaign] - [%s] - [PGSQL] - EditCampaign  failed', campaignId,err );
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback.end(jsonString);
                return;
            }

        }).error(function (err) {
            logger.error('[DVP-CampCampaignInfo.EditCampaign] - [%s] - [PGSQL] - EditCampaign  failed', campaignId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
            return;
        });

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
            Extensions: extension,
            OperationalStatus: "create",
            Status: true
        },
        {
            where: {
                CampaignId: campaignId
            }
        }
    ).then(function (results) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampCampaignInfo.EditCampaign] - [PGSQL] - Updated successfully.[%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampCampaignInfo.EditCampaign] - [%s] - [PGSQL] - Updation failed-[%s]', campaignId, err);
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
                where: [{CampaignId: campaignId}, {TenantId: tenantId}, {CompanyId: companyId}]
            }
        ).then(function (results) {
                logger.info('[DVP-CampCampaignInfo.DeleteCampaign] - [%s] - [PGSQL] - Updated successfully', campaignId);
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
                callback.end(jsonString);

            }).error(function (err) {
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                logger.error('[DVP-CampCampaignInfo.DeleteCampaign] - [PGSQL] - Updation failed. [%s]-[%s]', jsonString, err);
                callback.end(jsonString);
            });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.DeleteCampaign] - [%s] - [PGSQL] - Exception in updating.-[%s]', campaignId, ex);
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

        DbConn.CampCampaignInfo.findAll({
            where: [{CompanyId: companyId}, {TenantId: tenantId}, {Status: true}],
            include: [{model: DbConn.CampContactSchedule, as: "CampContactSchedule"}, {
                model: DbConn.CampConfigurations,
                as: "CampConfigurations"
            }]
        }).then(function (CamObject) {
            if (CamObject) {
                logger.info('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);

                callback.end(jsonString);
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }
        }).error(function (err) {
            logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [PGSQL]  - Error %s - %s  ', tenantId, companyId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    }
}

function GetAllCampaignPage(tenantId, companyId, count, callback) {

    try {


        DbConn.CampCampaignInfo.findAll({
            where: [{CompanyId: companyId}, {TenantId: tenantId}, {Status: true}],
            limit: count,
            order: '"CampaignId" DESC',
        }).then(function ( CamObject) {
            if (CamObject) {
                logger.info('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);

                callback.end(jsonString);
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }

        }).error(function (err) {
            logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [PGSQL]  - Error %s -[%s]  ', tenantId, companyId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    }
}

function GetAllCampaignByCampaignId(tenantId, companyId, campaignId, callback) {

    try {
        DbConn.CampCampaignInfo.findAll({
            where: [{CompanyId: companyId}, {TenantId: tenantId}, {CampaignId: campaignId}],
            include: [{model: DbConn.CampContactSchedule, as: "CampContactSchedule"}]
        }).then(function (CamObject) {
            if (CamObject) {
                logger.info('[DVP-CampCampaignInfo.GetAllCampaignByCampaignId] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callback.end(jsonString);
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }
        }).error(function (err) {
            logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignId] - [%s] - [PGSQL]  - Error %s -[%s]', tenantId, companyId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    }
}

function GetOngoingCampaign(tenantId, companyId, callback) {

    try {
        DbConn.CampOngoingCampaign.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}]}).then(function (CamObject) {
            var jsonString;
            if (CamObject) {
                logger.info('[DVP-CampCampaignInfo.GetOngoingCampaign] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
                jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callback.end(jsonString);
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetOngoingCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }
        }).error(function (err) {
            logger.error('[DVP-CampCampaignInfo.GetOngoingCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetOngoingCampaign] - [%s] - [PGSQL]  - Error %s -[%s]', tenantId, companyId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    }
}

function GetAllCampaignByCampaignState(tenantId, companyId, campaignState, callback) {

    try {
        DbConn.CampOngoingCampaign.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}, {CampaignState: campaignState}, {Status: true}]}).then(function (CamObject) {

            if (CamObject) {
                logger.info('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callback.end(jsonString);
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }
        }).error(function (err) {
            logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetAllCampaignByCampaignState] - [%s] - [PGSQL]  - Error %s-[%s]', tenantId, companyId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    }
}

function GetOfflineCampaign(tenantId, companyId, callback) {

    DbConn.CampOngoingCampaign.findAll({where: [{TenantId: tenantId}, {CompanyId: companyId}]}).then(function ( CamObject) {
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
    }).error(function (err) {
        logger.error('[DVP-CampCampaignInfo.GetOfflineCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
        var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    });
}

function GetPendingCampaign(tenantId, companyId, count, callback) {

    try {

//DbConn.CampCampaignInfo.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}, {Status: true}], required: true,attributes: ['CampaignId'] , include :[{model:DbConn.CampOngoingCampaign, as :"CampOngoingCampaign", required: true,attributes: []}]}).complete(function (err, CamObject) {

        DbConn.CampCampaignInfo.findAll({
            where: [{Status: true}, {OperationalStatus: "start"}],
            include: [{model: DbConn.CampScheduleInfo, as: "CampScheduleInfo"}, {
                model: DbConn.CampConfigurations,
                as: "CampConfigurations"
            }],
            limit: count
        }).then(function (CamObject) {
            if (CamObject) {
                logger.info('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);

                callback.end(jsonString);
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }
        }).error(function (err) {
            logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });
    }
    catch (ex) {
        logger.error('[DVP-CampCampaignInfo.GetAllCampaign] - [%s] - [PGSQL]  - Error %s -[%s]', tenantId, companyId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        callback.end(jsonString);
    }
}

function AddAdditionalData(dataClass, dataType, dataCategory, tenantId, companyId, additionalData, campaignId, callback) {
    DbConn.CampAdditionalData
        .create(
        {
            Class: dataClass,
            Type: dataType,
            Category: dataCategory,
            TenantId: tenantId,
            CompanyId: companyId,
            AdditionalData: additionalData,
            CampaignId: campaignId,
        }
    ).then(function (cmp) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
            logger.info('[DVP-CampAdditionalData.AddAdditionalData] - [PGSQL] - inserted successfully. [%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampAdditionalData.AddAdditionalData] - [%s] - [PGSQL] - insertion  failed-[%s]', campaignId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });

}

function EditAdditionalData(additionalDataId, dataClass, dataType, dataCategory, tenantId, companyId, additionalData, campaignId, callback) {
    DbConn.CampAdditionalData
        .update(
        {
            Class: dataClass,
            Type: dataType,
            Category: dataCategory,
            TenantId: tenantId,
            CompanyId: companyId,
            AdditionalData: additionalData,
            CampaignId: campaignId,
        },
        {
            where: [{AdditionalDataId: additionalDataId}]
        }
    ).then(function (cmp) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
            logger.info('[DVP-CampAdditionalData.EditAdditionalData] - [PGSQL] - inserted successfully. [%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampAdditionalData.EditAdditionalData] - [%s] - [PGSQL] - insertion  failed-[%s]', campaignId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);
        });

}

function GetAdditionalData(additionalDataId, tenantId, companyId, callBack) {

    DbConn.CampAdditionalData.find({where: [{AdditionalDataId: additionalDataId}, {TenantId: tenantId}, {CompanyId: companyId}]})
        .then(function (CamObject) {

            if (CamObject) {
                logger.info('[DVP-CampAdditionalData.GetAdditionalData] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callBack.end(jsonString);
            }
            else {
                logger.error('[DVP-CampAdditionalData.GetAdditionalData] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }

        }).error(function (err) {
            logger.error('[DVP-CampAdditionalData.GetAdditionalData] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        });
}

function GetAdditionalDataByCampaignId(campaignId, tenantId, companyId, callBack) {

    DbConn.CampAdditionalData.findAll({where: [{CampaignId: campaignId}, {TenantId: tenantId}, {CompanyId: companyId}]})
        .then(function (CamObject) {

            if (CamObject) {
                logger.info('[DVP-CampAdditionalData.GetAdditionalDataByCampaignId] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callBack.end(jsonString);
            }
            else {
                logger.error('[DVP-CampAdditionalData.GetAdditionalDataByCampaignId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }

        }).error(function (err) {
            logger.error('[DVP-CampAdditionalData.GetAdditionalDataByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        });
}

function GetAdditionalDataByClassTypeCategory(campaignId, tenantId, companyId, dataClass, dataType, dataCategory, callBack) {

    DbConn.CampAdditionalData.find({where: [{CampaignId: campaignId}, {TenantId: tenantId}, {CompanyId: companyId}, {Class: dataClass}, {Type: dataType}, {Category: dataCategory}]})
        .then(function (CamObject) {

            if (CamObject) {
                logger.info('[DVP-CampAdditionalData.GetAdditionalDataByCampaignId] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callBack.end(jsonString);
            }
            else {
                logger.error('[DVP-CampAdditionalData.GetAdditionalDataByCampaignId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }

        }).error(function (err) {
            logger.error('[DVP-CampAdditionalData.GetAdditionalDataByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        });
}

module.exports.CreateCampaign = CreateCampaign;
module.exports.EditCampaign = EditCampaign;
module.exports.StartCampaign = StartCampaign;
module.exports.DeleteCampaign = DeleteCampaign;
module.exports.GetAllCampaign = GetAllCampaign;
module.exports.GetAllCampaignPage = GetAllCampaignPage;
module.exports.GetAllCampaignByCampaignId = GetAllCampaignByCampaignId;
module.exports.GetOngoingCampaign = GetOngoingCampaign;
module.exports.GetAllCampaignByCampaignState = GetAllCampaignByCampaignState;
module.exports.GetOfflineCampaign = GetOfflineCampaign;
module.exports.GetPendingCampaign = GetPendingCampaign;
module.exports.AddAdditionalData = AddAdditionalData;
module.exports.EditAdditionalData = EditAdditionalData;
module.exports.GetAdditionalData = GetAdditionalData;
module.exports.GetAdditionalDataByCampaignId = GetAdditionalDataByCampaignId;
module.exports.GetAdditionalDataByCampaignId = GetAdditionalDataByCampaignId;
module.exports.GetAdditionalDataByClassTypeCategory = GetAdditionalDataByClassTypeCategory;