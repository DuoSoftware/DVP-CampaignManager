/**
 * Created by Heshan.i on 7/28/2017.
 */

var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('dvp-dbmodels');
var util = require('util');


function CreateScheduledCallbackInfo(tenantId, companyId, reqBody, callback) {
    var jsonString;


    if(reqBody.CallbackData && util.isObject(reqBody.CallbackData)) {
        var callBackString = JSON.stringify(reqBody.CallbackData);
        reqBody.CallbackData = callBackString;
    }

    DbConn.ScheduledCallback
        .create(
        {
            Class: reqBody.Class,
            Type: reqBody.Type,
            CompanyId: companyId,
            TenantId: tenantId,
            Category: reqBody.Category,
            SessionId: reqBody.SessionId,
            ContactId: reqBody.ContactId,
            CallbackData: reqBody.CallbackData,
            RequestedTime: reqBody.RequestedTime,
            Duration: reqBody.Duration

        }
    ).then(function (cmp) {

            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
            logger.info('[DVP-CampCallbackInfo.CreateScheduledCallbackInfo] - [PGSQL] - inserted successfully. [%s] ', jsonString);
            callback.end(jsonString);


        }).error(function (err) {
            logger.error('[DVP-CampCallbackInfo.CreateScheduledCallbackInfo] - [PGSQL] - insertion  failed-[%s]', err);
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callback.end(jsonString);

        });


}





function EditScheduledCallbackInfo(tenantId, companyId, sessionId, dispatchedTime, callback) {


    DbConn.ScheduledCallback
        .update(
        {
            DispatchedTime: dispatchedTime
        },
        {
            where: [{SessionId: sessionId}, {CompanyId: companyId}, {TenantId: tenantId}]
        }
    ).then(function (results) {

            var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, results);
            logger.info('[DVP-CampCallbackInfo.EditScheduledCallbackInfo] - [PGSQL] - Updated successfully.[%s] ', jsonString);
            callback.end(jsonString);

        }).error(function (err) {
            var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            logger.error('[DVP-CampCallbackInfo.EditScheduledCallbackInfo] - [PGSQL] - Updation failed-[%s]', err);
            callback.end(jsonString);
        });

}

function GetScheduledCallbackInfo(sessionId, tenantId, companyId, callBack) {
    var jsonString;
    DbConn.ScheduledCallback.find({where: [{SessionId: sessionId}, {CompanyId: companyId}, {TenantId: tenantId}]})
        .then(function (callbackObject) {

            if (callbackObject) {

                if(callbackObject.CallbackData)
                {
                    var dataObj = JSON.parse(callbackObject.CallbackData);
                    callbackObject.CallbackData=dataObj;
                }
                logger.info('[DVP-CampCallbackInfo.GetScheduledCallbackInfo] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(callbackObject));
                jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, callbackObject);
                callBack.end(jsonString);

            }
            else {
                logger.error('[DVP-CampCallbackInfo.GetScheduledCallbackInfo] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
                jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", false, undefined);
                callBack.end(jsonString);

            }

        }).error(function (err) {
            logger.error('[DVP-CampCallbackInfo.GetScheduledCallbackInfo] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);

        });
}



function GetAllScheduledCallbackInfo(tenantId, companyId, callBack) {
    var jsonString;
    DbConn.ScheduledCallback.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}]}).then(function (callbackObject) {

        if (callbackObject) {

            var callBackDataObj = callbackObject.map(function (item) {

                if(item.CallbackData)
                {
                   var cbObj = JSON.parse(item.CallbackData);
                   item.CallbackData=cbObj;
                }

                return item;

            });

            logger.info('[DVP-CampCallbackInfo.GetAllScheduledCallbackInfo] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(callBackDataObj));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, callBackDataObj);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCallbackInfo.GetAllScheduledCallbackInfo] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

    }).error(function (err) {
        logger.error('[DVP-CampCallbackInfo.GetAllScheduledCallbackInfo] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });

}

function GetScheduledCallbackInfoByClassTypeCategory(tenantId, companyId, callbackClass, callbackType, callbackCategory, callBack) {
    var jsonString;
    DbConn.ScheduledCallback.findAll({where: [{CompanyId: companyId}, {TenantId: tenantId}, {Class: callbackClass}, {Type: callbackType}, {Category: callbackCategory}]}).then(function (callbackObject) {

        if (callbackObject) {

            var callBackDataObj = callbackObject.map(function (item) {

                if(item.CallbackData)
                {
                    var cbObj = JSON.parse(item.CallbackData);
                    item.CallbackData=cbObj;
                }

                return item;

            });
            logger.info('[DVP-CampCallbackInfo.GetScheduledCallbackInfoByClassTypeCategory] - [%s] - [PGSQL]  - Data found  - %s-[%s]', tenantId, companyId, JSON.stringify(callBackDataObj));
            jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, callBackDataObj);
            callBack.end(jsonString);
        }
        else {
            logger.error('[DVP-CampCallbackInfo.GetScheduledCallbackInfoByClassTypeCategory] - [PGSQL]  - No record found for %s - %s  ', tenantId, companyId);
            jsonString = messageFormatter.FormatMessage(undefined, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        }

    }).error(function (err) {
        logger.error('[DVP-CampCallbackInfo.GetScheduledCallbackInfoByClassTypeCategory] - [%s] - [%s] - [PGSQL]  - Error in searching.', tenantId, companyId, err);
        jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
        callBack.end(jsonString);
    });

}

module.exports.CreateScheduledCallbackInfo = CreateScheduledCallbackInfo;
module.exports.EditScheduledCallbackInfo = EditScheduledCallbackInfo;
module.exports.GetScheduledCallbackInfo = GetScheduledCallbackInfo;
module.exports.GetAllScheduledCallbackInfo = GetAllScheduledCallbackInfo;
module.exports.GetScheduledCallbackInfoByClassTypeCategory = GetScheduledCallbackInfoByClassTypeCategory;