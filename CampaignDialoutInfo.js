/**
 * Created by Rajinda on 7/20/2015.
 */

var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('DVP-DBModels');

function CreateDialoutInfo(campaignId,dialerId,dialerStatus,dialtime,reason,sessionId,tryCount,tenantId, companyId, callBack){
    DbConn.CampDialoutInfo
        .create(
        {
            CampaignId: campaignId,
            CompanyId: companyId,
            TenantId: tenantId,
            DialerId: dialerId,
            DialerStatus: dialerStatus,
            Dialtime: dialtime,
            Reason: reason,
            SessionId: sessionId,
            TryCount:tryCount
        }
    ).then(function (results) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampDialoutInfo.CreateDialoutInfo] - [PGSQL] - CreateDialoutInfo successfully.[%s] ', jsonString);
            callBack.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampDialoutInfo.CreateDialoutInfo] - [%s] - [PGSQL] - CreateDialoutInfo failed', campaignId, err);
            callBack.end(jsonString);
        });
}

function EditDialoutInfo(dialoutId,campaignId,dialerId,dialerStatus,dialtime,reason,sessionId,tryCount,tenantId, companyId, callBack){
    DbConn.CampDialoutInfo
        .update(
        {
            CampaignId: campaignId,
            CompanyId: companyId,
            TenantId: tenantId,
            DialerId: dialerId,
            DialerStatus: dialerStatus,
            Dialtime: dialtime,
            Reason: reason,
            SessionId: sessionId,
            TryCount:tryCount
        },
        {where:[{TenantId: tenantId}, { CompanyId:companyId},{CategoryID:categoryID},{DialoutId:dialoutId}]}
    ).then(function (results) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampDialoutInfo.EditContactCategory] - [PGSQL] - EditContactCategory successfully.[%s] ', jsonString);
            callBack.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampDialoutInfo.EditContactCategory] - [%s] - [PGSQL] - EditContactCategory failed', categoryName, err);
            callBack.end(jsonString);
        });
}

function GetDialoutInfoByDialoutId(dialoutId,tenantId, companyId, callBack){
    DbConn.CampDialoutInfo
        .findAll({where: [{CompanyId: companyId}, {TenantId: tenantId},{DialoutId:dialoutId}]}
    ).then(function (results) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampDialoutInfo.GetDialoutInfoByDialoutId] - [PGSQL] - GetDialoutInfoByDialoutId successfully.[%s] ', jsonString);
            callBack.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampDialoutInfo.GetDialoutInfoByDialoutId] - [%s] - [PGSQL] - GetDialoutInfoByDialoutId failed', companyId, err);
            callBack.end(jsonString);
        });
}

function GetDialoutInfo(tenantId, companyId, callBack){
    DbConn.CampDialoutInfo
        .findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}]}
    ).then(function (results) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampDialoutInfo.GetDialoutInfo] - [PGSQL] - GetDialoutInfo successfully.[%s] ', jsonString);
            callBack.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampDialoutInfo.GetDialoutInfo] - [%s] - [PGSQL] - GetDialoutInfo failed', companyId, err);
            callBack.end(jsonString);
        });
}


module.exports.CreateDialoutInfo = CreateDialoutInfo;
module.exports.EditDialoutInfo = EditDialoutInfo;
module.exports.GetDialoutInfoByDialoutId = GetDialoutInfoByDialoutId;
module.exports.GetDialoutInfo = GetDialoutInfo;