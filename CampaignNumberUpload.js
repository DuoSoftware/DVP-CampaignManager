/**
 * Created by Rajinda on 6/26/2015.
 */
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('DVP-DBModels');
var List = require("collections/list");
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');

function UploadContacts(contacts, tenantId, companyId, categoryID, callBack) {

    var startTime = new Date();
    logger.info('UploadContacts - 1 - %s ', contacts.length);
    var nos = [];

    for (var i = 0; i < contacts.length; i++) {
        var no = {
            ContactId: contacts[i],
            Status: true,
            TenantId: tenantId,
            CompanyId: companyId,
            CategoryID: categoryID
        };
        nos.add(no);
    }

    logger.info('UploadContacts - 2 - %s - %s ms', contacts.length, (new Date() - startTime));

    /*
     DbConn.CampContactInfo.bulkCreate(
     nos
     ).then(function (results) {

     var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
     logger.info('[DVP-CampCampaignInfo.UploadContacts] - [PGSQL] - Updated successfully.[%s] ', jsonString);
     callBack.end(jsonString);

     }).error(function (err) {
     var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
     logger.error('[DVP-CampCampaignInfo.UploadContacts] - [%s] - [PGSQL] - Updation failed', companyId, err);
     callBack.end(jsonString);
     });


     */
    DbConn.CampContactInfo.bulkCreate(
        nos, {validate: false, individualHooks: true}
    ).then(function (results) {
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampCampaignInfo.UploadContacts] - [PGSQL] - UploadContacts successfully.[%s] ', jsonString);
            callBack.end(jsonString);
        }).catch(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampCampaignInfo.UploadContacts] - [%s] - [PGSQL] - UploadContacts failed', companyId, err);
            callBack.end(jsonString);
        }).finally(function () {
            logger.info('UploadContacts - %s - %s ms Done.', contacts.length, (new Date() - startTime));
        });
}

function UploadContactsToCampaign(contacts, campaignId, tenantId, companyId, categoryID, callBack) {

    var ids = [];
    var j = 0;
    for (var i = 0; i < contacts.length; i++) {

        DbConn.CampContactInfo
            .create(
            {
                ContactId: contacts[i],
                Status: true,
                TenantId: tenantId,
                CompanyId: companyId, CategoryID: categoryID
            }
        ).complete(function (err, cmp) {
                j++;
                if (err) {

                    logger.error('[DVP-CampContactInfo.UploadContactsToCampaign] - [%s] - [PGSQL] - insertion[CampContactInfo]  failed - [%s]', contacts[j-1], err);
                    ids.add(cmp.ContactId);
                }
                else {
                    logger.info('[DVP-CampContactInfo.UploadContactsToCampaign] - [%s] - [PGSQL] - inserted[CampContactInfo] successfully ', contacts[j-1]);

                    DbConn.CampContactSchedule
                        .create(
                        {
                            CampaignId: campaignId,
                            CamScheduleId: cmp.CamContactId
                        }
                    ).complete(function (err, cmp) {

                            if (err) {

                                logger.error('[DVP-CampContactInfo.UploadContactsToCampaign] - [%s] - [PGSQL] - insertion[CampContactSchedule]  failed- [%s]', contacts[j-1], err);
                                ids.add(cmp.ContactId);
                            }
                            else {
                                logger.info('[DVP-CampContactInfo.UploadContactsToCampaign] - [%s] - [PGSQL] - inserted[CampContactSchedule] successfully ', contacts[j-1]);
                            }

                        });
                }
                if (j >= contacts.length) {
                    var msg = undefined;
                    if (ids.length > 0) {
                        msg = new Error("Validation Error");
                    }
                    var jsonString = messageFormatter.FormatMessage(msg, "OPERATIONS COMPLETED", ids.length == 0, ids);
                    callBack.end(jsonString);
                }
            });

    }

}

function UploadContactsToCampaignWithSchedule(contacts, campaignId, camScheduleId, tenantId, companyId, categoryID, callBack) {

    var ids = [];
    var j = 0;
    for (var i = 0; i < contacts.length; i++) {

        DbConn.CampContactInfo
            .create(
            {
                ContactId: contacts[i],
                Status: true,
                TenantId: tenantId,
                CompanyId: companyId,
                CategoryID: categoryID
            }
        ).complete(function (err, cmp) {
                j++;
                if (err) {

                    logger.error('[DVP-CampContactInfo.UploadContactsToCampaignWithSchedule] - [%s] - [PGSQL] - insertion[CampContactInfo]  failed- [%s]', contacts[j - 1], err);
                    ids.add(contacts[j - 1]);
                }
                else {
                    logger.info('[DVP-CampContactInfo.UploadContactsToCampaignWithSchedule] - [%s] - [PGSQL] - inserted[CampContactInfo] successfully ', contacts[j - 1]);

                    DbConn.CampContactSchedule
                        .create(
                        {
                            CampaignId: campaignId,
                            CamContactId: cmp.CamContactId,
                            CamScheduleId: camScheduleId
                        }
                    ).complete(function (err, cmp) {

                            if (err) {

                                logger.error('[DVP-CampContactInfo.UploadContactsToCampaignWithSchedule] - [%s] - [PGSQL] - insertion[CampContactSchedule]  failed- [%s]', contacts[j - 1], err);
                                ids.add(contacts[j - 1]);
                            }
                            else {
                                logger.info('[DVP-CampaignNumberUpload.UploadContactsToCampaignWithSchedule] - [%s] - [PGSQL] - inserted[CampContactSchedule] successfully ', contacts[j - 1]);
                            }

                        });
                }

                if (j >= contacts.length) {
                    var msg = undefined;
                    if (ids.length > 0) {
                        msg = new Error("Validation Error");
                    }
                    var jsonString = messageFormatter.FormatMessage(msg, "OPERATIONS COMPLETED", ids.length == 0, ids);
                    callBack.end(jsonString);
                }
            });

    }

}

function AddExistingContactsToCampaign(contactIds, campaignId, callBack) {
    var nos = [];

    for (var i = 0; i < contactIds.length; i++) {
        var no = {CampaignId: campaignId, CamContactId: contactIds[0]};
        nos.add(no);
    }

    DbConn.CampContactSchedule.bulkCreate(
        nos
    ).then(function (results) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampaignNumberUpload.AddExistingContactsToCampaign] - [PGSQL] - Updated successfully.[%s] ', jsonString);
            callBack.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampaignNumberUpload.AddExistingContactsToCampaign] - [%s] - [PGSQL] - Updation failed- [%s]', campaignId, err);
            callBack.end(jsonString);
        });

}

function EditContact(contact, campaignId, tenantId, companyId, categoryID, callBack) {
    DbConn.CampContactInfo
        .update(
        {
            CampaignId: campaignId,
            TenantId: tenantId,
            CompanyId: companyId,
            CategoryID: categoryID,
            Status: true
        },
        {
            where: {
                ContactId: contact
            }
        }
    ).then(function (results) {


            logger.info('[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updated successfully', contact);
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            callBack.end(jsonString);

        }).error(function (err) {
            logger.error('[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updation failed- [%s]', contact, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        });
}

function EditContacts(contacts, campaignId, tenantId, companyId, categoryID, callBack) {

    var ids = [];
    var j = 0;
    for (var i = 0; i < contacts.length; i++) {
        DbConn.CampContactInfo
            .update(
            {
                CampaignId: campaignId,
                TenantId: tenantId,
                CompanyId: companyId,
                CategoryID: categoryID,
                Status: true
            },
            {
                where: {
                    ContactId: contact
                }
            }
        ).then(function (results) {

                j++;
                logger.info('[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updated successfully', contacts[j-1]);
                if (j >= contacts.length) {
                    var msg = undefined;
                    if (ids.length > 0) {
                        msg = new Error("Validation Error");
                    }
                    var jsonString = messageFormatter.FormatMessage(msg, "OPERATIONS COMPLETED", ids.length == 0, ids);
                    callBack.end(jsonString);
                }

            }).error(function (err) {
                j++;
                logger.error('[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updation failed- [%s]', contacts[j-1], err);

                ids.add(contacts[j-1]);
                if (j >= contacts.length) {
                    var msg = undefined;
                    if (ids.length > 0) {
                        msg = new Error("Validation Error");
                    }
                    var jsonString = messageFormatter.FormatMessage(msg, "OPERATIONS COMPLETED", ids.length == 0, ids);
                    callBack.end(jsonString);
                }
            }
        );


    }
    /* var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
     callBack.end(jsonString);*/
}

function DeleteContacts(contacts, campaignId, tenantId, companyId, callBack) {
    var ids = [];
    var j = 0;
    for (var i = 0; i < contacts.length; i++) {
        DbConn.CampContactInfo
            .update(
            {
                Status: false
            },
            {
                where: [{ContactId: contacts[i]}, {CompanyId: companyId}, {TenantId: tenantId}, {CampaignId: campaignId}]
            }
        ).then(function (results) {

                j++;
                logger.info('[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updated successfully', contacts[j - 1]);
                if (j >= contacts.length) {
                    var msg = undefined;
                    if (ids.length > 0) {
                        msg = new Error("Validation Error");
                    }
                    var jsonString = messageFormatter.FormatMessage(msg, "OPERATIONS COMPLETED", ids.length == 0, ids);
                    callBack.end(jsonString);
                }

            }).error(function (err) {
                logger.error('[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updation failed- [%s]', contacts[j - 1], err);
                ids.add(contacts[j - 1])
                if (j >= contacts.length) {
                    var msg = undefined;
                    if (ids.length > 0) {
                        msg = new Error("Validation Error");
                    }
                    var jsonString = messageFormatter.FormatMessage(msg, "OPERATIONS COMPLETED", ids.length == 0, ids);
                    callBack.end(jsonString);
                }
            });
    }
    /* var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, ids);
     callBack.end(jsonString);*/
}

function AssigningScheduleToCampaign(campaignId, CamScheduleId, tenantId, companyId, callBack) {

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
            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            callBack.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampaignNumberUpload.EditContacts] - Updation failed : %s ', jsonString);
            callBack.end(jsonString);
        });
}

function GetAllContact(tenantId, companyId, callBack) {
    DbConn.CampContactInfo.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}]}).complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampaignNumberUpload.GetAllContact] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

        else {

            if (CamObject) {
                logger.info('[DVP-CampaignNumberUpload.GetAllContact] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callBack.end(jsonString);
            }
            else {
                logger.error('[DVP-CampaignNumberUpload.GetAllContact] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }
        }
    });
}

function GetAllContactByCampaignId(campaignId, tenantId, companyId, callBack) {


    DbConn.CampContactSchedule.findAll({
        where: [{CampaignId: campaignId}],
        attributes: ['ExtraData'],
        include: [{model: DbConn.CampContactInfo, as: "CampContactInfo", attributes: ['ContactId']}]
    }).complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

        else {

            if (CamObject) {
                logger.info('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [%s] - [PGSQL]  - Data found  - %s - [%s]', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callBack.end(jsonString);
            }
            else {
                logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }
        }
    });
}

function GetAllContactByCategoryID(categoryId, tenantId, companyId, callBack) {


    DbConn.CampContactSchedule.findAll({
        where: [{CampaignId: campaignId}],
        attributes: ['ExtraData'],
        include: [{model: DbConn.CampContactInfo, as: "CampContactInfo", attributes: ['ContactId'],where :[{'CategoryID':categoryId}]}]
    }).complete(function (err, CamObject) {

        if (err) {
            logger.error('[DVP-CampaignNumberUpload.GetAllContactByCategoryID] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

        else {

            if (CamObject) {
                logger.info('[DVP-CampaignNumberUpload.GetAllContactByCategoryID] - [%s] - [PGSQL]  - Data found  - %s - [%s]', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callBack.end(jsonString);
            }
            else {
                logger.error('[DVP-CampaignNumberUpload.GetAllContactByCategoryID] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }
        }
    });
}

function GetAllContactByCampaignIdScheduleId(campaignId, scheduleId, rowCount, pageNo, tenantId, companyId, callBack) {

    //DbConn.CampContactSchedule.findAll({where: [{CampaignId: campaignId},{CamScheduleId:scheduleId}],offset: ((pageNo - 1)*rowCount),limit: rowCount,attributes: [],include:[{model:DbConn.CampContactInfo, as :"CampContactInfo" ,attributes: ['ContactId']}]}).complete(function (err, CamObject) {
    DbConn.CampContactSchedule.findAll({
        where: [{CampaignId: campaignId}, {CamScheduleId: scheduleId}],
        attributes: ['ExtraData'],
        offset: ((pageNo - 1) * rowCount),
        limit: rowCount,
        include: [{
            model: DbConn.CampContactInfo,
            as: "CampContactInfo",
            attributes: ['ContactId'],
            order: '"CamContactId" DESC'
        }]
    }).complete(function (err, CamObject) {
        if (err) {
            logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

        else {

            if (CamObject) {
                logger.info('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [%s] - [PGSQL]  - Data found  - %s- [%s]', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callBack.end(jsonString);
            }
            else {
                logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }
        }
    });
}

function GetExtraDataByContactId(campaignId, contactId, rowCount, pageNo, tenantId, companyId, callBack) {

    DbConn.CampContactSchedule.findAll({
        where: [{CampaignId: campaignId}],
        attributes: ['ExtraData'],
        offset: ((pageNo - 1) * rowCount),
        limit: rowCount,
        include: [{
            model: DbConn.CampContactInfo,
            as: "CampContactInfo",
            attributes: ['ContactId'],where:[{'ContactId':contactId}],
            order: '"CamContactId" DESC'
        }]
    }).complete(function (err, CamObject) {
        if (err) {
            logger.error('[DVP-CampaignNumberUpload.GetExtraDataByContactId] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]', tenantId, companyId, err);
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

        else {

            if (CamObject) {
                logger.info('[DVP-CampaignNumberUpload.GetExtraDataByContactId] - [%s] - [PGSQL]  - Data found  - %s- [%s]', tenantId, companyId, JSON.stringify(CamObject));
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callBack.end(jsonString);
            }
            else {
                logger.error('[DVP-CampaignNumberUpload.GetExtraDataByContactId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                var jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
                callBack.end(jsonString);
            }
        }
    });
}

function CreateContactCategory(categoryName, tenantId, companyId, callBack) {
    DbConn.CampContactCategory
        .create(
        {
            CategoryName: categoryName,
            TenantId: tenantId,
            CompanyId: companyId,
        }
    ).then(function (results) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampContactCategory.CreateContactCategory] - [PGSQL] - CreateContactCategory successfully.[%s] ', jsonString);
            callBack.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampContactCategory.CreateContactCategory] - [%s] - [PGSQL] - CreateContactCategory failed- [%s]', categoryName, err);
            callBack.end(jsonString);
        });
}

function EditContactCategory(categoryID, categoryName, tenantId, companyId, callBack) {
    DbConn.CampContactCategory
        .update(
        {
            CategoryName: categoryName
        },
        {where: [{TenantId: tenantId}, {CompanyId: companyId}, {CategoryID: categoryID}]}
    ).then(function (results) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampContactCategory.CreateContactCategory] - [PGSQL] - CreateContactCategory successfully.[%s] ', jsonString);
            callBack.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampContactCategory.CreateContactCategory] - [%s] - [PGSQL] - CreateContactCategory failed- [%s]', categoryName, err);
            callBack.end(jsonString);
        });
}

function GetContactCategory(tenantId, companyId, callBack) {
    DbConn.CampContactCategory
        .findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}]}
    ).then(function (results) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampContactCategory.GetContactCategory] - [PGSQL] - GetContactCategory successfully.[%s] ', jsonString);
            callBack.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampContactCategory.GetContactCategory] - [%s] - [PGSQL] - GetContactCategory failed- [%s]', companyId, err);
            callBack.end(jsonString);
        });
}

/*
 function GetContactInfo(campaignId, tenantId, companyId, callBack){

 DbConn.CampContactInfo.find({where: [{CompanyId: companyId}, {TenantId: tenantId}, {CampaignId: campaignId}]}) .complete(function (err, CamObject) {

 if (err) {
 logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
 callBack.end(err, undefined);
 }

 else {

 if (CamObject) {
 logger.info('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
 console.log(CamObject);
 callBack.end(undefined, CamObject);
 }
 else {
 logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
 callBack.end(new Error('No record'), undefined);
 }
 }
 });

 }
 */

module.exports.UploadContacts = UploadContacts;
module.exports.UploadContactsToCampaign = UploadContactsToCampaign;
module.exports.UploadContactsToCampaignWithSchedule = UploadContactsToCampaignWithSchedule;
module.exports.AddExistingContactsToCampaign = AddExistingContactsToCampaign;
module.exports.EditContacts = EditContacts;
module.exports.EditContact = EditContact;
module.exports.DeleteContacts = DeleteContacts;
module.exports.AssigningScheduleToCampaign = AssigningScheduleToCampaign;
module.exports.GetAllContact = GetAllContact;
module.exports.GetAllContactByCampaignId = GetAllContactByCampaignId;
module.exports.GetAllContactByCategoryID = GetAllContactByCategoryID;
module.exports.GetAllContactByCampaignIdScheduleId = GetAllContactByCampaignIdScheduleId;
module.exports.GetExtraDataByContactId = GetExtraDataByContactId;
module.exports.CreateContactCategory = CreateContactCategory;
module.exports.GetContactCategory = GetContactCategory;
module.exports.EditContactCategory = EditContactCategory;