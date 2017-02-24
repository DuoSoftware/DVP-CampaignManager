/**
 * Created by Rajinda on 6/26/2015.
 */
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('dvp-dbmodels');
var List = require("collections/list");
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var async = require("async");


function UploadContacts(contacts, tenantId, companyId, categoryID, callBack) {
    var jsonString;
    var startTime = new Date();

    var nos = [];

    if (contacts) {

        logger.info('UploadContacts - 1 - %s ', contacts.length);

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
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, "done");
            logger.info('[DVP-CampCampaignInfo.UploadContacts] - [PGSQL] - UploadContacts successfully.[%s] ', jsonString);
            callBack.end(jsonString);
        }).catch(function (err) {
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampCampaignInfo.UploadContacts] - [%s] - [PGSQL] - UploadContacts failed', companyId, err);
            callBack.end(jsonString);
        }).finally(function () {
            logger.info('UploadContacts - %s - %s ms Done.', contacts.length, (new Date() - startTime));
        });
}

function UploadContactsToCampaign(contacts, campaignId, tenantId, companyId, categoryID, extraData, callBack) {

    var ids = [];
    var j = 0;

    function UploadContactsToCampaignThen (cmp) {
        j++;
        logger.info('[DVP-CampContactInfo.UploadContactsToCampaign] - [%s] - [PGSQL] - inserted[CampContactInfo] successfully ', contacts[j - 1]);

        DbConn.CampContactSchedule
            .create(
                {
                    CampaignId: campaignId,
                    CamScheduleId: cmp.CamContactId,
                    ExtraData: extraData
                }
            ).then(function (cmp) {
            logger.info('[DVP-CampContactInfo.UploadContactsToCampaign] - [%s] - [PGSQL] - inserted[CampContactSchedule] successfully ', contacts[j - 1]);
        }).error(function (err) {
            logger.error('[DVP-CampContactInfo.UploadContactsToCampaign] - [%s] - [PGSQL] - insertion[CampContactSchedule]  failed- [%s]', contacts[j - 1], err);
            ids.add(cmp.ContactId);
        });

        if (j >= contacts.length) {
            var msg = undefined;
            if (ids.length > 0) {
                msg = new Error("Validation Error");
            }
            var jsonString = messageFormatter.FormatMessage(msg, "OPERATIONS COMPLETED", ids.length  === 0, ids);
            callBack.end(jsonString);
        }
    }

    function UploadContactsToCampaignError(err) {
        j++;
        logger.error('[DVP-CampContactInfo.UploadContactsToCampaign] - [%s] - [PGSQL] - insertion[CampContactInfo]  failed - [%s]', contacts[j - 1], err);
        //ids.add(cmp.ContactId);
    }

    for (var i = 0; i < contacts.length; i++) {

        DbConn.CampContactInfo
            .create(
                {
                    ContactId: contacts[i],
                    Status: true,
                    TenantId: tenantId,
                    CompanyId: companyId, CategoryID: categoryID
                }
            ).then(UploadContactsToCampaignThen ).error(UploadContactsToCampaignError);

    }

}

/*function UploadContactsToCampaignWithSchedule(contacts, campaignId, camScheduleId, tenantId, companyId, categoryID, extraData, callBack) {
 var jsonString;
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
 ).then(function (cmp) {
 j++;
 logger.info('[DVP-CampContactInfo.UploadContactsToCampaignWithSchedule] - [%s] - [PGSQL] - inserted[CampContactInfo] successfully ', contacts[j - 1]);

 DbConn.CampContactSchedule
 .create(
 {
 CampaignId: campaignId,
 CamContactId: cmp.CamContactId,
 CamScheduleId: camScheduleId,
 ExtraData: extraData
 }
 ).then(function (cmp) {
 logger.info('[DVP-CampaignNumberUpload.UploadContactsToCampaignWithSchedule] - [%s] - [PGSQL] - inserted[CampContactSchedule] successfully ', contacts[j - 1]);
 }).error(function (err) {
 logger.error('[DVP-CampContactInfo.UploadContactsToCampaignWithSchedule] - [%s] - [PGSQL] - insertion[CampContactSchedule]  failed- [%s]', contacts[j - 1], err);
 ids.add(contacts[j - 1]);
 });
 if (j >= contacts.length) {
 var msg = undefined;
 if (ids.length > 0) {
 msg = new Error("Validation Error");
 }
 jsonString= messageFormatter.FormatMessage(msg, "OPERATIONS COMPLETED", ids.length  === 0, ids);
 callBack.end(jsonString);
 }
 }).error(function (err) {
 j++;
 logger.error('[DVP-CampContactInfo.UploadContactsToCampaignWithSchedule] - [%s] - [PGSQL] - insertion[CampContactInfo]  failed- [%s]', contacts[j - 1], err);
 ids.add(contacts[j - 1]);
 if (j >= contacts.length) {
 var msg = undefined;
 if (ids.length > 0) {
 msg = new Error("Validation Error");
 }
 jsonString = messageFormatter.FormatMessage(msg, "OPERATIONS COMPLETED", ids.length  === 0, ids);
 callBack.end(jsonString);}
 });

 }

 }*/

function UploadContactsToCampaignWithSchedule(items, campaignId, camScheduleId, tenantId, companyId, categoryID, extraData, callBackm) {

    var task = [];
    var CampScheduleTask = [];
    var camContactId = [];
    var errList = [];

    function CampScheduleCallback(err, result) {
        var jsonString = messageFormatter.FormatMessage(err, "OPERATIONS COMPLETED", errList.length === 0, errList);
        callBackm.end(jsonString);
    }

    function callback(err, result) {
        if (result) {

            result.forEach(function (item) {
                if (item) {
                    CampScheduleTask.push(function createContact(CampScheduleCallback) {
                        DbConn.CampContactSchedule
                            .create(
                                {
                                    CampaignId: campaignId,
                                    CamContactId: item,
                                    CamScheduleId: camScheduleId,
                                    ExtraData: extraData
                                }).then(function (cmp) {
                            CampScheduleCallback(null, cmp.ContactScheduleId);
                        }).error(function (err) {
                            CampScheduleCallback(err, null);
                        });
                    });
                }
            });

            async.parallel(CampScheduleTask, CampScheduleCallback);
        } else {
            CampScheduleCallback(null, null);
        }
    }


    items.forEach(function (item) {
        task.push(function createContact(callback) {
            DbConn.CampContactInfo
                .create(
                    {
                        ContactId: item,
                        Status: true,
                        TenantId: tenantId,
                        CompanyId: companyId,
                        CategoryID: categoryID
                    }).then(function (cmp) {
                camContactId.push(cmp.CamContactId);
                callback(null, cmp.CamContactId);
            }).error(function (err) {
                errList.push(item);
                callback(null, null);
            });
        });
    });

    async.parallel(task, callback);


}


function AddExistingContactsToCampaign(contactIds, campaignId, callBack) {
    var nos = [];
    var jsonString;
    for (var i = 0; i < contactIds.length; i++) {
        var no = {CampaignId: campaignId, CamContactId: contactIds[0]};
        nos.add(no);
    }

    DbConn.CampContactSchedule.bulkCreate(
        nos
    ).then(function (results) {

        jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
        logger.info('[DVP-CampaignNumberUpload.AddExistingContactsToCampaign] - [PGSQL] - Updated successfully.[%s] ', jsonString);
        callBack.end(jsonString);

    }).error(function (err) {
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.AddExistingContactsToCampaign] - [%s] - [PGSQL] - Updation failed- [%s]', campaignId, err);
        callBack.end(jsonString);
    });

}

function EditContact(contact, campaignId, tenantId, companyId, categoryID, callBack) {
    var jsonString;
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
        jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
        callBack.end(jsonString);

    }).error(function (err) {
        logger.error('[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updation failed- [%s]', contact, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function EditContacts(contacts, campaignId, tenantId, companyId, categoryID, callBack) {
    var jsonString;
    var ids = [];
    var j = 0;
    function EditContactsThen(results) {

        j++;
        logger.info('[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updated successfully', contacts[j - 1]);
        if (j >= contacts.length) {
            var msg = undefined;
            if (ids.length > 0) {
                msg = new Error("Validation Error");
            }
            jsonString = messageFormatter.FormatMessage(msg, "OPERATIONS COMPLETED", ids.length  === 0, ids);
            callBack.end(jsonString);
        }

    }

    function EditContactsError(err) {
        j++;
        logger.error('[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updation failed- [%s]', contacts[j - 1], err);

        ids.add(contacts[j - 1]);
        if (j >= contacts.length) {
            var msg = undefined;
            if (ids.length > 0) {
                msg = new Error("Validation Error");
            }
            jsonString = messageFormatter.FormatMessage(msg, "OPERATIONS COMPLETED", ids.length  === 0, ids);
            callBack.end(jsonString);
        }
    }

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
                        ContactId: contacts[i]
                    }
                }
            ).then(EditContactsThen).error(EditContactsError
        );


    }
    /* var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
     callBack.end(jsonString);*/
}

function DeleteContacts(contacts, campaignId, tenantId, companyId, callBack) {
    var jsonString;
    var ids = [];
    var j = 0;

    function DeleteContactsThen(results) {

        j++;
        logger.info('[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updated successfully', contacts[j - 1]);
        if (j >= contacts.length) {
            var msg = undefined;
            if (ids.length > 0) {
                msg = new Error("Validation Error");
            }
            jsonString = messageFormatter.FormatMessage(msg, "OPERATIONS COMPLETED", ids.length  === 0, ids);
            callBack.end(jsonString);
        }

    }

    function DeleteContactsError(err) {
        logger.error('[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updation failed- [%s]', contacts[j - 1], err);
        ids.add(contacts[j - 1])
        if (j >= contacts.length) {
            var msg = undefined;
            if (ids.length > 0) {
                msg = new Error("Validation Error");
            }
            jsonString = messageFormatter.FormatMessage(msg, "OPERATIONS COMPLETED", ids.length  === 0, ids);
            callBack.end(jsonString);
        }
    }

    for (var i = 0; i < contacts.length; i++) {
        DbConn.CampContactInfo
            .update(
                {
                    Status: false
                },
                {
                    where: [{ContactId: contacts[i]}, {CompanyId: companyId}, {TenantId: tenantId}, {CampaignId: campaignId}]
                }
            ).then(DeleteContactsThen).error(DeleteContactsError);
    }
    /* var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, ids);
     callBack.end(jsonString);*/
}

function GetAllContact(tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampContactInfo.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}]}).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampaignNumberUpload.GetAllContact] - [%s] - [PGSQL]  - Data found  - %s', tenantId, companyId, JSON.stringify(CamObject));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampaignNumberUpload.GetAllContact] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampaignNumberUpload.GetAllContact] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetAllContactByCampaignId(campaignId, tenantId, companyId, callBack) {

    var jsonString;
    DbConn.CampContactSchedule.findAll({
        where: [{CampaignId: campaignId}],
        attributes: ['ExtraData'],
        include: [{model: DbConn.CampContactInfo, as: "CampContactInfo", attributes: ['ContactId']}]
    }).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [%s] - [PGSQL]  - Data found  - %s - [%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetAllContactByCategoryID(categoryId, tenantId, companyId, callBack) {

    var jsonString;
    var query = {
        where: [{CategoryID: categoryId, TenantId: tenantId, CompanyId: companyId}],
        include: [{
            model: DbConn.CampContactInfo,
            as: "CampContactInfo",
            attributes: ['ContactId'],
            where: [{'CategoryID': categoryId}]
        }]
    };

    if(!categoryId){
        query = {
            where: [{TenantId: tenantId, CompanyId: companyId}],
            include: [{
                model: DbConn.CampContactInfo,
                as: "CampContactInfo",
                attributes: ['ContactId'],
                where: [{'CategoryID': categoryId}]
            }]
        };
    }
    DbConn.CampContactCategory.find(query).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampaignNumberUpload.GetAllContactByCategoryID] - [%s] - [PGSQL]  - Data found  - %s - [%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampaignNumberUpload.GetAllContactByCategoryID] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampaignNumberUpload.GetAllContactByCategoryID] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetAllContactByCampaignIdScheduleId(campaignId, scheduleId, rowCount, pageNo, tenantId, companyId, callBack) {
    var jsonString;
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
    }).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [%s] - [PGSQL]  - Data found  - %s- [%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetAllContactByCampaignIdScheduleIdWithoutPaging(campaignId, scheduleId, tenantId, companyId, callBack) {
    var jsonString;
    //DbConn.CampContactSchedule.findAll({where: [{CampaignId: campaignId},{CamScheduleId:scheduleId}],offset: ((pageNo - 1)*rowCount),limit: rowCount,attributes: [],include:[{model:DbConn.CampContactInfo, as :"CampContactInfo" ,attributes: ['ContactId']}]}).complete(function (err, CamObject) {
    DbConn.CampContactSchedule.findAll({
        where: [{CampaignId: campaignId}, {CamScheduleId: scheduleId}],
        attributes: ['ExtraData'],
        include: [{
            model: DbConn.CampContactInfo,
            as: "CampContactInfo",
            attributes: ['ContactId'],
            order: '"CamContactId" DESC'
        }]
    }).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleIdWithoutPaging] - [%s] - [PGSQL]  - Data found  - %s- [%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleIdWithoutPaging] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleIdWithoutPaging] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function GetExtraDataByContactId(campaignId, contactId, rowCount, pageNo, tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampContactSchedule.findAll({
        where: [{CampaignId: campaignId}],
        attributes: ['ExtraData'],
        offset: ((pageNo - 1) * rowCount),
        limit: rowCount,
        include: [{
            model: DbConn.CampContactInfo,
            as: "CampContactInfo",
            attributes: ['ContactId'], where: [{'ContactId': contactId}],
            order: '"CamContactId" DESC'
        }]
    }).then(function (CamObject) {
        if (CamObject) {
            logger.info('[DVP-CampaignNumberUpload.GetExtraDataByContactId] - [%s] - [PGSQL]  - Data found  - %s- [%s]', tenantId, companyId, JSON.stringify(CamObject));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampaignNumberUpload.GetExtraDataByContactId] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampaignNumberUpload.GetExtraDataByContactId] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });
}

function CreateContactCategory(categoryName, tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampContactCategory
        .create(
            {
                CategoryName: categoryName,
                TenantId: tenantId,
                CompanyId: companyId,
            }
        ).then(function (results) {

        jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
        logger.info('[DVP-CampContactCategory.CreateContactCategory] - [PGSQL] - CreateContactCategory successfully.[%s] ', jsonString);
        callBack.end(jsonString);

    }).error(function (err) {
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampContactCategory.CreateContactCategory] - [%s] - [PGSQL] - CreateContactCategory failed- [%s]', categoryName, err);
        callBack.end(jsonString);
    });
}

function EditContactCategory(categoryID, categoryName, tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampContactCategory
        .update(
            {
                CategoryName: categoryName
            },
            {where: [{TenantId: tenantId}, {CompanyId: companyId}, {CategoryID: categoryID}]}
        ).then(function (results) {

        jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
        logger.info('[DVP-CampContactCategory.CreateContactCategory] - [PGSQL] - CreateContactCategory successfully.[%s] ', jsonString);
        callBack.end(jsonString);

    }).error(function (err) {
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampContactCategory.CreateContactCategory] - [%s] - [PGSQL] - CreateContactCategory failed- [%s]', categoryName, err);
        callBack.end(jsonString);
    });
}


function GetContactCategory(tenantId, companyId, callBack) {
    var jsonString;
    DbConn.CampContactCategory
        .findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}]}
        ).then(function (results) {

        jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
        logger.info('[DVP-CampContactCategory.GetContactCategory] - [PGSQL] - GetContactCategory successfully.[%s] ', jsonString);
        callBack.end(jsonString);

    }).error(function (err) {
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampContactCategory.GetContactCategory] - [%s] - [PGSQL] - GetContactCategory failed- [%s]', companyId, err);
        callBack.end(jsonString);
    });
}

function mapNumberToCampaign(req, res) {
    var jsonString;

    var tenantId = req.user.tenant;
    var companyId = req.user.company;

    DbConn.CampContactInfo
        .findAll(
            {where: [{CompanyId: companyId}, {TenantId: tenantId}, {CategoryID: req.params.CategoryID}]}).then(function (cmp) {
        if (cmp && Array.isArray(cmp) && cmp.length > 0) {

            DbConn.CampContactSchedule
                .find({where: [{CampaignId: req.params.CampaignId}, {BatchNo: cmp[0].BatchNo}]}
                ).then(function (results) {

                if (results) {
                    jsonString = messageFormatter.FormatMessage(new Error("Invalid Batch No"), "EXCEPTION", false, undefined);
                    logger.error('CampContactInfo - bulkCreate failed- [%s]', new Error("Invalid Batch No"));
                    res.end(jsonString);
                }
                else {
                    var nos = cmp.map(function (item) {
                        return {
                            CampaignId: req.params.CampaignId,
                            CamContactId: item.CamContactId,
                            BatchNo: cmp[0].BatchNo
                        };
                    });

                    DbConn.CampContactSchedule.bulkCreate(
                        nos
                    ).then(function (results) {

                        jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
                        logger.info('CampContactInfo - bulkCreate successfully.[%s] ', jsonString);
                        res.end(jsonString);

                    }).error(function (err) {
                        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                        logger.error('CampContactInfo - bulkCreate failed- [%s]', err);
                        res.end(jsonString);
                    });
                }
            }).error(function (err) {
                jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                logger.error('CampContactInfo ---', err);
                res.end(jsonString);
            });
        }
        else {
            jsonString = messageFormatter.FormatMessage(new Error("Invalid Category or No Number found."), "EXCEPTION", false, undefined);
            logger.error('[mapNumberToCompaign] - mapNumberToCompaign failed- [%s]', new Error("Invalid Category"));
            res.end(jsonString);
        }
    }).error(function (err) {
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        logger.error('[mapNumberToCompaign] - mapNumberToCompaign failed- [%s]', err);
        res.end(jsonString);
    });

}

function mapScheduleToCampaign(req, res) {
    var jsonString;

    var tenantId = req.user.tenant;
    var companyId = req.user.company;
    DbConn.CampScheduleInfo
        .find(
            {where: [{CampaignId: req.params.CampaignId}, {CamScheduleId: req.params.CamScheduleId},{CompanyId: companyId}, {TenantId: tenantId}]}).then(function (cmp) {
        if(cmp){
            jsonString = messageFormatter.FormatMessage(new Error("You need to Add Schedule To Campaign Before You Map Them to Campaign."), "EXCEPTION", false, undefined);
            logger.error('mapScheduleToCampaign failed- [%s]', new Error("You need to Add Schedule To Campaign Before You Map Them to Campaign."));
            res.end(jsonString);
        }
        else{
            DbConn.CampContactSchedule
                .findAll(
                    {where: [{CampaignId: req.params.CampaignId}, {CamScheduleId: req.params.CamScheduleId}]}).then(function (cmp) {
                if (cmp && Array.isArray(cmp) && cmp.length > 0) {
                    jsonString = messageFormatter.FormatMessage(new Error("Invalid Schedule ID OR Already Map To Campaign."), "EXCEPTION", false, undefined);
                    logger.error('mapScheduleToCampaign failed- [%s]', new Error("Invalid Schedule ID"));
                    res.end(jsonString);
                }
                else {
                    DbConn.CampContactSchedule
                        .create(
                            {
                                CampaignId: req.params.CampaignId,
                                CamScheduleId: cmp.CamScheduleId
                            }
                        ).then(function (result) {
                        if (result) {
                            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, result);
                            logger.info('CampContactSchedule successfully.[%s] ', jsonString);
                            res.end(jsonString);
                        } else {
                            jsonString = messageFormatter.FormatMessage(undefined, "FAIL", false, result);
                            logger.info('CampContactSchedule Fail.[%s] ', jsonString);
                            res.end(jsonString);
                        }
                    }).error(function (err) {
                        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                        logger.error('CampContactSchedule failed- [%s]', err);
                        res.end(jsonString);
                    });

                }
            }).error(function (err) {
                jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                logger.error('mapScheduleToCampaign failed- [%s]', err);
                res.end(jsonString);
            });
        }
    }).error(function (err) {
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        logger.error('mapScheduleToCampaign failed- [%s]', err);
        res.end(jsonString);
    });





}

function mapNumberAndScheduleToCampaign(req, res) {
    var jsonString;
    var tenantId = req.user.tenant;
    var companyId = req.user.company;

    DbConn.CampScheduleInfo.find({where: [{CompanyId: companyId}, {TenantId: tenantId}, {CampaignId: req.params.CampaignId}]}).then(function (CamObject) {
        if (CamObject) {

            DbConn.CampContactSchedule
                .findAll(
                    {where: [{CampaignId: req.params.CampaignId}, {CamScheduleId: CamObject.CamScheduleId}]}).then(function (cmp) {
                if (cmp && Array.isArray(cmp) && cmp.length > 0) {
                    mapNumberToCampaign(req, res);
                }
                else {
                    DbConn.CampContactSchedule
                        .create(
                            {
                                CampaignId: req.params.CampaignId,
                                CamScheduleId: CamObject.CamScheduleId
                            }
                        ).then(function (result) {
                        if (result) {
                            mapNumberToCampaign(req, res);
                        } else {
                            jsonString = messageFormatter.FormatMessage(undefined, "FAIL", false, result);
                            logger.info('mapNumberAndScheduleToCampaign Fail.[%s] ', jsonString);
                            res.end(jsonString);
                        }
                    }).error(function (err) {
                        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                        logger.error('mapNumberAndScheduleToCampaign failed- [%s]', err);
                        res.end(jsonString);
                    });
                }
            }).error(function (err) {
                jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                logger.error('mapNumberAndScheduleToCampaign failed- [%s]', err);
                res.end(jsonString);
            });

        }
        else {
            logger.error('Fail To Find CampScheduleInfo', new Error('No record'));
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            res.end(jsonString);
        }
    }).error(function (err) {
        logger.error('Fail To Find CampScheduleInfo',err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        res.end(jsonString);
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

module.exports.GetAllContact = GetAllContact;
module.exports.GetAllContactByCampaignId = GetAllContactByCampaignId;
module.exports.GetAllContactByCategoryID = GetAllContactByCategoryID;
module.exports.GetAllContactByCampaignIdScheduleId = GetAllContactByCampaignIdScheduleId;
module.exports.GetExtraDataByContactId = GetExtraDataByContactId;
module.exports.CreateContactCategory = CreateContactCategory;
module.exports.GetContactCategory = GetContactCategory;
module.exports.EditContactCategory = EditContactCategory;
module.exports.GetAllContactByCampaignIdScheduleIdWithoutPaging = GetAllContactByCampaignIdScheduleIdWithoutPaging;
module.exports.MapNumberToCampaign = mapNumberToCampaign;
module.exports.MapScheduleToCampaign = mapScheduleToCampaign;
module.exports.MapNumberAndScheduleToCampaign = mapNumberAndScheduleToCampaign;

