/**
 * Created by Rajinda on 6/26/2015.
 */
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('DVP-DBModels');
var List = require("collections/list");
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');

function UploadContacts(contacts, tenantId, companyId, callBack) {
    var ids = [];
    for (var i = 0; i < contacts.length; i++) {

        DbConn.CampContactInfo
            .create(
            {
                ContactId: contacts[i],
                Status: true,
                TenantId: tenantId,
                CompanyId: companyId
            }
        ).complete(function (err, cmp) {

                if (err) {

                    logger.error('[DVP-CampContactInfo.UploadContacts] - [%s] - [PGSQL] - insertion  failed', contacts[i], err);
                    ids.push(contacts[i]);
                }
                else {
                    logger.debug('[DVP-CampContactInfo.UploadContacts] - [%s] - [PGSQL] - inserted successfully ', contacts[i]);

                }
            });

    }

    var jsonString = messageFormatter.FormatMessage(ids, "success", true, undefined);
    callBack.end(undefined, jsonString);


}

function UploadContactsToCampaign(contacts, campaignId, tenantId, companyId, callBack) {

    var ids = [];
    for (var i = 0; i < contacts.length; i++) {

        DbConn.CampContactInfo
            .create(
            {
                ContactId: contacts[i],
                Status: true,
                TenantId: tenantId,
                CompanyId: companyId
            }
        ).complete(function (err, cmp) {

                if (err) {

                    logger.error('[DVP-CampContactInfo.UploadContactsToCampaign] - [%s] - [PGSQL] - insertion[CampContactInfo]  failed', contacts[i], err);
                    ids.push(contacts[i]);
                }
                else {
                    logger.debug('[DVP-CampContactInfo.UploadContactsToCampaign] - [%s] - [PGSQL] - inserted[CampContactInfo] successfully ', contacts[i]);

                    DbConn.CampContactSchedule
                        .create(
                        {
                            CampaignId: campaignId,
                            CamScheduleId: cmp.CamContactId
                        }
                    ).complete(function (err, cmp) {

                            if (err) {

                                logger.error('[DVP-CampContactInfo.UploadContactsToCampaign] - [%s] - [PGSQL] - insertion[CampContactSchedule]  failed', contacts[i], err);
                                ids.push(contacts[i]);
                            }
                            else {
                                logger.debug('[DVP-CampContactInfo.UploadContactsToCampaign] - [%s] - [PGSQL] - inserted[CampContactSchedule] successfully ', contacts[i]);
                            }
                        });
                }
            });

    }
    var jsonString = messageFormatter.FormatMessage(ids, "success", true, undefined);
    callBack.end(undefined, jsonString);
}

function UploadContactsToCampaignWithSchedule(contacts, campaignId, camScheduleId, tenantId, companyId, callBack) {

    var ids = [];
    for (var i = 0; i < contacts.length; i++) {

        DbConn.CampContactInfo
            .create(
            {
                ContactId: contacts[i],
                Status: true,
                TenantId: tenantId,
                CompanyId: companyId
            }
        ).complete(function (err, cmp) {

                if (err) {

                    logger.error('[DVP-CampContactInfo.UploadContactsToCampaignWithSchedule] - [%s] - [PGSQL] - insertion[CampContactInfo]  failed', contacts[i], err);
                    ids.push(contacts[i]);
                }
                else {
                    logger.debug('[DVP-CampContactInfo.UploadContactsToCampaignWithSchedule] - [%s] - [PGSQL] - inserted[CampContactInfo] successfully ', contacts[i]);

                    DbConn.CampContactSchedule
                        .create(
                        {
                            CampaignId: campaignId,
                            CamScheduleId: cmp.CamContactId,
                            CamScheduleId: camScheduleId
                        }
                    ).complete(function (err, cmp) {

                            if (err) {

                                logger.error('[DVP-CampContactInfo.UploadContactsToCampaignWithSchedule] - [%s] - [PGSQL] - insertion[CampContactSchedule]  failed', contacts[i], err);
                                ids.push(contacts[i]);
                            }
                            else {
                                logger.debug('[DVP-CampContactInfo.UploadContactsToCampaignWithSchedule] - [%s] - [PGSQL] - inserted[CampContactSchedule] successfully ', contacts[i]);
                            }
                        });
                }
            });

    }
    var jsonString = messageFormatter.FormatMessage(ids, "success", true, undefined);
    callBack.end(undefined, jsonString);
}

function EditContacts(contact, campaignId, tenantId, companyId, callBack) {
    DbConn.CampContactInfo
        .update(
        {
            ContactId: contact,
            TenantId: tenantId,
            CompanyId: companyId,
            Status: true
        },
        {
            where: {
                CompanyId: campaignId
            }
        }
    ).then(function (results) {


            logger.debug('[DVP-CampCampaignInfo.EditContacts] - [%s] - [PGSQL] - Updated successfully', contact);
            var jsonString = messageFormatter.FormatMessage(results, "success", true, undefined);
            callBack.end(undefined, jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampCampaignInfo.EditContacts] - [%s] - [PGSQL] - Updation failed', contact, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString, undefined);
        });
}

function DeleteContacts(contacts, campaignId, tenantId, companyId, callBack) {
    var ids = [];
    for (var i = 0; i < contacts.length; i++) {
        DbConn.CampContactInfo
            .update(
            {
                Status: false
            },
            {
                where: [{ContactId: contacts[i]}, {CompanyId: companyId}, {TenantId: tenantId}]
            }
        ).then(function (results) {


                logger.debug('[DVP-CampCampaignInfo.EditContacts] - [%s] - [PGSQL] - Updated successfully', contact);


            }).error(function (err) {
                logger.error('[DVP-CampCampaignInfo.EditContacts] - [%s] - [PGSQL] - Updation failed', contact, err);
                ids.add(contacts[i])
            });
    }
    var jsonString = messageFormatter.FormatMessage(ids, "success", true, undefined);
    callBack.end(undefined, jsonString);
}

function AssingScheduleToCampaign(campaignId, CamScheduleId, tenantId, companyId, callBack) {

    DbConn.CampContactSchedule
        .update(
        {
            CamScheduleId: CamScheduleId
        },
        {
            where: [{CampaignId: campaignId}, {CompanyId: companyId}, {TenantId: tenantId}]
        }
    ).then(function (results) {


            logger.debug('[DVP-CampCampaignInfo.EditContacts] - [%s] - [PGSQL] - Updated successfully', contact);
            var jsonString = messageFormatter.FormatMessage(results, "success", true, undefined);
            callBack.end(undefined, jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampCampaignInfo.EditContacts] - [%s] - [PGSQL] - Updation failed', contact, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString, undefined);
        });
}

function GetAllContact(tenantId, companyId, callBack) {
    DbConn.CampContactInfo.find({where: [{CompanyId: companyId}, {TenantId: tenantId}]}).complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampCampaignInfo.GetAllContact] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString, undefined);
        }

        else {

            if (CamObject) {
                logger.debug('[DVP-CampCampaignInfo.GetAllContact] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(CamObject, "success", true, undefined);
                callBack.end(undefined, jsonString);
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetAllContact] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString, undefined);
            }
        }
    });
}

function GetAllContactByCampaignId(campaignId, tenantId, companyId, callBack) {
    DbConn.CampContactInfo.find({where: [{CompanyId: companyId}, {TenantId: tenantId}, {CampaignId: campaignId}]}).complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampCampaignInfo.GetAllContactByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString, undefined);
        }

        else {

            if (CamObject) {
                logger.debug('[DVP-CampCampaignInfo.GetAllContactByCampaignId] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(CamObject, "success", true, undefined);
                callBack.end(undefined, jsonString);
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetAllContactByCampaignId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString, undefined);
            }
        }
    });
}

/*
function GetContactInfo(campaignId, tenantId, companyId, callBack){

    DbConn.CampContactInfo.find({where: [{CompanyId: companyId}, {TenantId: tenantId}, {CampaignId: campaignId}]}) .complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampCampaignInfo.GetAllContactByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            callBack.end(err, undefined);
        }

        else {

            if (CamObject) {
                logger.debug('[DVP-CampCampaignInfo.GetAllContactByCampaignId] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                console.log(CamObject);
                callBack.end(undefined, CamObject);
            }
            else {
                logger.error('[DVP-CampCampaignInfo.GetAllContactByCampaignId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                callBack.end(new Error('No record'), undefined);
            }
        }
    });

}
*/

module.exports.UploadContacts = UploadContacts;
module.exports.UploadContactsToCampaign = UploadContactsToCampaign;
module.exports.UploadContactsToCampaignWithSchedule = UploadContactsToCampaignWithSchedule;
module.exports.EditContacts = EditContacts;
module.exports.DeleteContacts = DeleteContacts;
module.exports.AssingScheduleToCampaign = AssingScheduleToCampaign;
module.exports.GetAllContact = GetAllContact;
module.exports.GetAllContactByCampaignId = GetAllContactByCampaignId;
//module.exports.GetContactInfo = GetContactInfo;