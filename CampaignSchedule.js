/**
 * Created by Rajinda on 6/26/2015.
 */

var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('dvp-dbmodels');

function CreateSchedule(campaignId, scheduleId, scheduleType, tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampScheduleInfo
        .create(
            {
                CampaignId: campaignId,
                ScheduleId: scheduleId,
                ScheduleType: scheduleType,
                TenantId: tenantId,
                CompanyId: companyId,
                Status: true
            }
        ).then(function (cmp) {

        logger.info('[DVP-CampScheduleInfo.CreateSchedule] - [%s] - [PGSQL] - inserted successfully ', campaignId);
        jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
        callBack.end(jsonString);
    }).error(function (err) {
        logger.error('[DVP-CampScheduleInfo.CreateSchedule] - [%s] - [PGSQL] - insertion  failed-[%s]', campaignId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function EditSchedule(camscheduleId, campaignId, scheduleId, scheduleType, tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampScheduleInfo
        .update(
            {
                CampaignId: campaignId,
                ScheduleId: scheduleId,
                ScheduleType: scheduleType
            },
            {
                where: [{CamScheduleId: camscheduleId}, {TenantId: tenantId}, {CompanyId: companyId}]
            }
        ).then(function (cmp) {


        logger.info('[DVP-CampScheduleInfo.EditSchedule] - [%s] - [PGSQL] - Updated successfully', camscheduleId);
        jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
        callBack.end(jsonString);

    }).error(function (err) {
        logger.error('[DVP-CampScheduleInfo.EditSchedule] - [%s] - [PGSQL] - Updation failed-[%s]', camscheduleId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function DeleteSchedule(camScheduleId,campaignId, tenantId, companyId, callBack) {
    var jsonString;

    DbConn.CampContactSchedule
        .find(
            {
                where: [{CamScheduleId: camScheduleId},{CampaignId:campaignId}]
            }
        ).then(function (cmp) {
        if (cmp) {
            logger.error('[DVP-CampScheduleInfo.DeleteSchedule] - [%s] - [PGSQL] - Updation failed-[%s]', camScheduleId, undefined);
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
        else {
            DbConn.CampScheduleInfo
                .destroy(
                    {
                        where: [{CamScheduleId: camScheduleId},{CampaignId:campaignId}, {TenantId: tenantId}, {CompanyId: companyId}]
                    }
                ).then(function (cmp) {
                logger.info('[DVP-CampScheduleInfo.DeleteSchedule] - [%s] - [PGSQL] - Updated successfully', camScheduleId);
                jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", cmp==1, cmp);
                callBack.end(jsonString);

            }).error(function (err) {
                logger.error('[DVP-CampScheduleInfo.DeleteSchedule] - [%s] - [PGSQL] - Updation failed-[%s]', camScheduleId, err);
                jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            });

        }

    }).error(function (err) {
        logger.error('[DVP-CampScheduleInfo.DeleteSchedule] - [%s] - [PGSQL] - Updation failed-[%s]', camScheduleId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });



}

function GetAllSchedule(tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampScheduleInfo.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}]}).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampScheduleInfo.GetAllSchedule] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampScheduleInfo.GetAllSchedule] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampScheduleInfo.GetAllSchedule] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetSchedule(camScheduleId, callBack) {
    var jsonString;
    DbConn.CampScheduleInfo.find({where: [{CompanyId: companyId}, {TenantId: tenantId}, {CamScheduleId: camScheduleId}]}).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampScheduleInfo.GetSchedule] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampScheduleInfo.GetSchedule] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampScheduleInfo.GetSchedule] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetScheduleByCampaignId(campaignId, tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampScheduleInfo.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}, {CampaignId: campaignId}]}).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampScheduleInfo.GetScheduleByCampaignId] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampScheduleInfo.GetScheduleByCampaignId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampScheduleInfo.GetScheduleByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetAssignableScheduleByCampaignId(campaignId, tenantId, companyId, callBack) {
    var jsonString;

    DbConn.CampContactSchedule.findAll({
        where: [{CampaignId: campaignId}],
        attributes: ['ContactScheduleId']
    }).then(function (CamObject) {
        if (CamObject) {
            DbConn.CampScheduleInfo.findAll(
                {
                    where: [{CompanyId: companyId}, {TenantId: tenantId}, {
                        CamContactId: {
                            $in: CamObject           // ANY ARRAY[2, 3]::INTEGER (PG only)
                        }
                    }]
                }).then(function (CamObject) {
                if (CamObject) {
                    logger.info('[DVP-CampScheduleInfo.GetScheduleByCampaignId] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
                    jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                    callBack.end(jsonString);
                }
                else {
                    logger.error('[DVP-CampScheduleInfo.GetScheduleByCampaignId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                    jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                    callBack.end(jsonString);
                }
            }).error(function (err) {
                logger.error('[DVP-CampScheduleInfo.GetScheduleByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
                jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            });

        }
        else {
            logger.error('[DVP-CampScheduleInfo.GetassignableScheduleByCampaignId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampScheduleInfo.GetassignableScheduleByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}


function GetScheduleByScheduleType(scheduleType, tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampScheduleInfo.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}, {ScheduleType: scheduleType}]}).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampScheduleInfo.GetScheduleByScheduleType] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampScheduleInfo.GetScheduleByScheduleType] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampScheduleInfo.GetScheduleByScheduleType] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetScheduleByCampaignIdScheduleType(campaignId, scheduleType, tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampScheduleInfo.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}, {CampaignId: campaignId}, {ScheduleType: scheduleType}]}).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampScheduleInfo.GetScheduleByCampaignIdScheduleType] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampScheduleInfo.GetScheduleByCampaignIdScheduleType] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampScheduleInfo.GetScheduleByCampaignIdScheduleType] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function AssigningScheduleToCampaign(campaignId, CamScheduleId, tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampContactSchedule
        .update(
            {
                CamScheduleId: CamScheduleId
            },
            {
                where: [{CampaignId: campaignId}, {CompanyId: companyId}, {TenantId: tenantId}]
            }
        ).then(function (results) {
        logger.info('[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updated successfully', CamScheduleId);
        jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
        callBack.end(jsonString);

    }).error(function (err) {
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.EditContacts] - Updation failed : %s ', jsonString);
        callBack.end(jsonString);
    });
}

module.exports.CreateSchedule = CreateSchedule;
module.exports.EditSchedule = EditSchedule;
module.exports.DeleteSchedule = DeleteSchedule;
module.exports.GetAllSchedule = GetAllSchedule;
module.exports.GetSchedule = GetSchedule;
module.exports.GetScheduleByCampaignId = GetScheduleByCampaignId;
module.exports.GetScheduleByScheduleType = GetScheduleByScheduleType;
module.exports.GetScheduleByCampaignIdScheduleType = GetScheduleByCampaignIdScheduleType;
module.exports.AssigningScheduleToCampaign = AssigningScheduleToCampaign;
module.exports.GetAssignableScheduleByCampaignId = GetAssignableScheduleByCampaignId;




