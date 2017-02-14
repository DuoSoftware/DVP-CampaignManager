/**
 * Created by Heshan.i on 2/13/2017.
 */


var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('dvp-dbmodels');


function CreateDncRecord(contactIds, tenantId, companyId, res) {
    var jsonString;

    var contactDetails = [];

    if (contactIds) {
        for (var i = 0; i < contactIds.length; i++) {
            var no = {
                ContactId: contactIds[i],
                TenantId: tenantId,
                CompanyId: companyId
            };
            contactDetails.add(no);
        }
    }

    DbConn.CampDncInfo.bulkCreate(
        contactDetails, {validate: false, individualHooks: true}
    ).then(function ( dnc) {
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, dnc);
            logger.info('[DVP-CampDncInfo.CreateDncRecord] - [PGSQL] - inserted successfully. [%s] ', jsonString);
            res.end(jsonString);
        }).error(function (err) {
            logger.error('[DVP-CampDncInfo.CreateDncRecord] - [%s] - [PGSQL] - insertion  failed-[%s]', contactIds, err);
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            res.end(jsonString);
        });
}

function DeleteDncRecord(contactIds, tenantId, companyId, res) {
    var jsonString;

    DbConn.CampDncInfo
        .destroy(
        {
            where: [
                {
                    TenantId: tenantId
                },
                {
                    CompanyId: companyId
                },
                {
                    ContactId: {$in:contactIds}
                }
            ]
        }
    ).then(function (dnc) {
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", dnc>0, dnc);
            logger.info('[DVP-CampDncInfo.DeleteDncRecord] - [PGSQL] - delete successfully. [%s] ', jsonString);
            res.end(jsonString);
        }).error(function (err) {
            logger.error('[DVP-CampDncInfo.DeleteDncRecord] - [%s] - [PGSQL] - delete  failed-[%s]', contactId, err);
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            res.end(jsonString);
        });
}


function GetDncList(tenantId, companyId, res) {
    var jsonString;

    DbConn.CampDncInfo.findAll({
        where: {
            $or: [
                {
                    $and: [
                        {
                            TenantId: tenantId
                        },
                        {
                            CompanyId: companyId

                        }
                    ]
                },
                {
                    $and: [
                        {
                            TenantId: -1
                        },
                        {
                            CompanyId: -1

                        }
                    ]
                }
            ]
        }
    }).then(function (dncObjects) {
        if (dncObjects) {
            logger.info('[DVP-CampDncInfo.GetDncList] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(dncObjects));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, dncObjects);

            res.end(jsonString);
        }
        else {
            logger.error('[DVP-CampDncInfo.GetDncList] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(new Error('No record'), "EXCEPTION", false, undefined);
            res.end(jsonString);
        }
    }).error(function (err) {
        logger.error('[DVP-CampDncInfo.GetDncList] - [%s] - [%s] - [PGSQL]  - Error in searching.-[%s]', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        res.end(jsonString);
    });
}



module.exports.CreateDncRecord = CreateDncRecord;
module.exports.DeleteDncRecord = DeleteDncRecord;
module.exports.GetDncList = GetDncList;