/**
 * Created by Rajinda on 6/26/2015.
 */

var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('DVP-DBModels');

function CreateSchedule(campaignId, scheduleId, scheduleType,tenantId,companyId, callBack) {

    DbConn.CampScheduleInfo
        .create(
        {
            CampaignId:campaignId,
            ScheduleId:scheduleId,
            ScheduleType:scheduleType,
            TenantId:tenantId,
            CompanyId:companyId,
            Status: true
        }
    ).complete(function (err, cmp) {

            if (err) {

                logger.error('[DVP-CampScheduleInfo.CreateSchedule] - [%s] - [PGSQL] - insertion  failed', campaignId, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }
            else {
                logger.debug('[DVP-CampScheduleInfo.CreateSchedule] - [%s] - [PGSQL] - inserted successfully ', campaignId);
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
                callBack.end(jsonString);
            }
        });
}

function EditSchedule(camscheduleId, campaignId, scheduleId, scheduleType,tenantId,companyId, callBack) {

    DbConn.CampScheduleInfo
        .update(
        {
            CampaignId:campaignId,
            ScheduleId:scheduleId,
            ScheduleType:scheduleType
        },
        {
            where: [{CamScheduleId: camscheduleId},{TenantId:tenantId},{CompanyId:companyId}]
        }
    ).then(function (results) {


            logger.debug('[DVP-CampScheduleInfo.EditSchedule] - [%s] - [PGSQL] - Updated successfully', camscheduleId);
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
            callBack.end(jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampScheduleInfo.EditSchedule] - [%s] - [PGSQL] - Updation failed', camscheduleId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        });
}

function DeleteSchedule(camScheduleId,tenantId,companyId, callBack) {
    DbConn.CampScheduleInfo
        .update(
        {
            Status:false
        },
        {
            where: [{CamScheduleId: camScheduleId},{TenantId:tenantId},{CompanyId:companyId}]
        }
    ).then(function (results) {


            logger.debug('[DVP-CampScheduleInfo.DeleteSchedule] - [%s] - [PGSQL] - Updated successfully', camscheduleId);
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
            callBack.end(jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampScheduleInfo.DeleteSchedule] - [%s] - [PGSQL] - Updation failed', camscheduleId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        });
}

function GetAllSchedule(tenantId,companyId,callBack) {
    DbConn.CampScheduleInfo.find({where: [{CompanyId: companyId}, {TenantId: tenantId}]}).complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampScheduleInfo.GetAllSchedule] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

        else {

            if (CamObject) {
                logger.debug('[DVP-CampScheduleInfo.GetAllSchedule] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callBack.end(jsonString);
            }
            else {
                logger.error('[DVP-CampScheduleInfo.GetAllSchedule] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }
        }
    });
}

function GetSchedule(camScheduleId, callBack) {
    DbConn.CampScheduleInfo.find({where: [{CompanyId: companyId}, {TenantId: tenantId},{CamScheduleId: camScheduleId}]}).complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampScheduleInfo.GetSchedule] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

        else {

            if (CamObject) {
                logger.debug('[DVP-CampScheduleInfo.GetSchedule] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callBack.end(jsonString);
            }
            else {
                logger.error('[DVP-CampScheduleInfo.GetSchedule] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }
        }
    });
}

function GetScheduleByCampaignId(campaignId,tenantId,companyId, callBack) {
    DbConn.CampScheduleInfo.find({where: [{CompanyId: companyId}, {TenantId: tenantId},{CampaignId: campaignId}]}).complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampScheduleInfo.GetScheduleByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

        else {

            if (CamObject) {
                logger.debug('[DVP-CampScheduleInfo.GetScheduleByCampaignId] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callBack.end(jsonString);
            }
            else {
                logger.error('[DVP-CampScheduleInfo.GetScheduleByCampaignId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }
        }
    });
}

function GetScheduleByScheduleType(scheduleType,tenantId,companyId, callBack) {
    DbConn.CampScheduleInfo.find({where: [{CompanyId: companyId}, {TenantId: tenantId},{ScheduleType: scheduleType}]}).complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampScheduleInfo.GetScheduleByScheduleType] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

        else {

            if (CamObject) {
                logger.debug('[DVP-CampScheduleInfo.GetScheduleByScheduleType] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callBack.end(jsonString);
            }
            else {
                logger.error('[DVP-CampScheduleInfo.GetScheduleByScheduleType] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }
        }
    });
}

function GetScheduleByCampaignIdScheduleType(campaignId, scheduleType,tenantId,companyId, callBack) {
    DbConn.CampScheduleInfo.find({where: [{CompanyId: companyId}, {TenantId: tenantId},{CampaignId:campaignId},{ScheduleType: scheduleType}]}).complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampScheduleInfo.GetScheduleByCampaignIdScheduleType] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

        else {

            if (CamObject) {
                logger.debug('[DVP-CampScheduleInfo.GetScheduleByCampaignIdScheduleType] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callBack.end(jsonString);
            }
            else {
                logger.error('[DVP-CampScheduleInfo.GetScheduleByCampaignIdScheduleType] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }
        }
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