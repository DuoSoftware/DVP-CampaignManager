/**
 * Created by Rajinda on 8/10/2015.
 */

var messageFormatter = require("dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js");
var logger = require("dvp-common-lite/LogHandler/CommonLogHandler.js").logger;
var DbConn = require("dvp-dbmodels");

function CreateCallbackInfo(req, cmp, tenantId, companyId, callback) {
  var jsonString;
  var campaignId = req.params.CampaignId;
  var contactId = cmp.ContactId;
  var dialoutTime = cmp.DialoutTime;
  var callBackCount = cmp.CallBackCount;
  var callbackClass = cmp.CallbackClass;
  var callbackType = cmp.CallbackType;
  var callbackCategory = cmp.CallbackCategory;

  DbConn.CampConfigurations.find({
    where: [
      { CompanyId: companyId },
      { TenantId: tenantId },
      { CampaignId: campaignId },
    ],
  }).then(
    function (CamObject) {
      if (CamObject) {
        var b = Date.parse(dialoutTime);
        var startDate = Date.parse(CamObject.StartDate);
        var endDate = Date.parse(CamObject.EndDate);
        if (b - startDate > 0 && endDate - b > 0) {
          DbConn.CampCallbackInfo.create({
            CampaignId: campaignId,
            ContactId: contactId,
            DialoutTime: dialoutTime,
            CallBackCount: callBackCount,
            CallbackStatus: true,
            Class: callbackClass,
            Type: callbackType,
            Category: callbackCategory,
          })
            .then(function (cmp) {
              jsonString = messageFormatter.FormatMessage(
                undefined,
                "SUCCESS",
                true,
                cmp
              );
              logger.info(
                "[DVP-CampCallbackInfo.CreateCallbackInfo] - [PGSQL] - inserted successfully. [%s] ",
                jsonString
              );
              callback.end(jsonString);
            })
            .error(function (err) {
              logger.error(
                "[DVP-CampCallbackInfo.CreateCallbackInfo] - [%s] - [PGSQL] - insertion  failed-[%s]",
                contactId,
                err
              );
              jsonString = messageFormatter.FormatMessage(
                err,
                "EXCEPTION",
                false,
                undefined
              );
              callback.end(jsonString);
            });
        } else {
          logger.error(
            "[DVP-CampCallbackInfo.CreateCallbackInfo-date validate] - [%s] - [PGSQL] - [%s]",
            contactId,
            err
          );
          jsonString = messageFormatter.FormatMessage(
            new Error("invalid Date range."),
            "EXCEPTION",
            false,
            undefined
          );
          callback.end(jsonString);
        }
      }
    },
    function (err) {
      logger.error(
        "[DVP-CampConfigurations.GetConfiguration] - [%s] - [%s] - [PGSQL]  - Error in searching.",
        tenantId,
        companyId,
        err
      );
      jsonString = messageFormatter.FormatMessage(
        err,
        "EXCEPTION",
        false,
        undefined
      );
      callback.end(jsonString);
    }
  );
}

function EditCallbackInfo(
  callBackId,
  campaignId,
  contactId,
  dialoutTime,
  callBackCount,
  tenantId,
  companyId,
  callback
) {
  DbConn.CampCallbackInfo.update(
    {
      CampaignId: campaignId,
      ContactId: contactId,
      DialoutTime: dialoutTime,
      CallBackCount: callBackCount,
      CallbackStatus: true,
    },
    {
      where: [{ CallBackId: callBackId }],
    }
  )
    .then(function (results) {
      var jsonString = messageFormatter.FormatMessage(
        undefined,
        "SUCCESS",
        true,
        results
      );
      logger.info(
        "[DVP-CampCallbackInfo.EditCallbackInfo] - [PGSQL] - Updated successfully.[%s] ",
        jsonString
      );
      callback.end(jsonString);
    })
    .error(function (err) {
      var jsonString = messageFormatter.FormatMessage(
        err,
        "EXCEPTION",
        false,
        undefined
      );
      logger.error(
        "[DVP-CampCallbackInfo.EditCallbackInfo] - [%s] - [PGSQL] - Updation failed-[%s]",
        campaignId,
        err
      );
      callback.end(jsonString);
    });
}

function GetCallbackInfo(callBackId, tenantId, companyId, callBack) {
  var jsonString;
  DbConn.CampCallbackInfo.find({ where: [{ CallBackId: callBackId }] })
    .then(function (CamObject) {
      if (CamObject) {
        logger.info(
          "[DVP-CampCallbackInfo.GetCallbackInfo] - [%s] - [PGSQL]  - Data found  - %s-[%s]",
          tenantId,
          companyId,
          JSON.stringify(CamObject)
        );
        jsonString = messageFormatter.FormatMessage(
          undefined,
          "SUCCESS",
          true,
          CamObject
        );
        callBack.end(jsonString);
      } else {
        logger.error(
          "[DVP-CampCallbackInfo.GetCallbackInfo] - [PGSQL]  - No record found for %s - %s  ",
          tenantId,
          companyId
        );
        jsonString = messageFormatter.FormatMessage(
          new Error("No record"),
          "EXCEPTION",
          false,
          undefined
        );
        callBack.end(jsonString);
      }
    })
    .error(function (err) {
      logger.error(
        "[DVP-CampCallbackInfo.GetCallbackInfo] - [%s] - [%s] - [PGSQL]  - Error in searching.",
        tenantId,
        companyId,
        err
      );
      jsonString = messageFormatter.FormatMessage(
        err,
        "EXCEPTION",
        false,
        undefined
      );
      callBack.end(jsonString);
    });
}

function GetAllCallbackInfos(tenantId, companyId, callBack) {
  var jsonString;
  DbConn.CampCallbackInfo.findAll()
    .then(function (CamObject) {
      if (CamObject) {
        logger.info(
          "[DVP-CampCallbackInfo.GetAllCallbackInfos] - [%s] - [PGSQL]  - Data found  - %s-[%s]",
          tenantId,
          companyId,
          JSON.stringify(CamObject)
        );
        jsonString = messageFormatter.FormatMessage(
          undefined,
          "SUCCESS",
          true,
          CamObject
        );
        callBack.end(jsonString);
      } else {
        logger.error(
          "[DVP-CampCallbackInfo.GetAllCallbackInfos] - [PGSQL]  - No record found for %s - %s  ",
          tenantId,
          companyId
        );
        jsonString = messageFormatter.FormatMessage(
          new Error("No record"),
          "EXCEPTION",
          false,
          undefined
        );
        callBack.end(jsonString);
      }
    })
    .error(function (err) {
      logger.error(
        "[DVP-CampCallbackInfo.GetAllCallbackInfos] - [%s] - [%s] - [PGSQL]  - Error in searching.",
        tenantId,
        companyId,
        err
      );
      jsonString = messageFormatter.FormatMessage(
        err,
        "EXCEPTION",
        false,
        undefined
      );
      callBack.end(jsonString);
    });
}

function GetCallbackInfosByCampaignId(
  campaignId,
  tenantId,
  companyId,
  callBack
) {
  var jsonString;
  DbConn.CampCallbackInfo.findAll({ where: [{ CampaignId: campaignId }] })
    .then(function (CamObject) {
      if (CamObject) {
        logger.info(
          "[DVP-CampCallbackInfo.GetCallbackInfosByCampaignId] - [%s] - [PGSQL]  - Data found  - %s-[%s]",
          tenantId,
          companyId,
          JSON.stringify(CamObject)
        );
        jsonString = messageFormatter.FormatMessage(
          undefined,
          "SUCCESS",
          true,
          CamObject
        );
        callBack.end(jsonString);
      } else {
        logger.error(
          "[DVP-CampCallbackInfo.GetCallbackInfosByCampaignId] - [PGSQL]  - No record found for %s - %s  ",
          tenantId,
          companyId
        );
        jsonString = messageFormatter.FormatMessage(
          new Error("No record"),
          "EXCEPTION",
          false,
          undefined
        );
        callBack.end(jsonString);
      }
    })
    .error(function (err) {
      logger.error(
        "[DVP-CampCallbackInfo.GetCallbackInfosByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.",
        tenantId,
        companyId,
        err
      );
      jsonString = messageFormatter.FormatMessage(
        err,
        "EXCEPTION",
        false,
        undefined
      );
      callBack.end(jsonString);
    });
}

function GetCallbackInfosByClassTypeCategory(
  tenantId,
  companyId,
  callbackClass,
  callbackType,
  callbackCategory,
  callBack
) {
  var jsonString;
  DbConn.CampCallbackInfo.findAll({
    where: [
      { Class: callbackClass },
      { Type: callbackType },
      { Category: callbackCategory },
    ],
  })
    .then(function (CamObject) {
      if (CamObject) {
        logger.info(
          "[DVP-CampCallbackInfo.GetCallbackInfosByClassTypeCategory] - [%s] - [PGSQL]  - Data found  - %s-[%s]",
          tenantId,
          companyId,
          JSON.stringify(CamObject)
        );
        jsonString = messageFormatter.FormatMessage(
          undefined,
          "SUCCESS",
          true,
          CamObject
        );
        callBack.end(jsonString);
      } else {
        logger.error(
          "[DVP-CampCallbackInfo.GetCallbackInfosByClassTypeCategory] - [PGSQL]  - No record found for %s - %s  ",
          tenantId,
          companyId
        );
        jsonString = messageFormatter.FormatMessage(
          new Error("No record"),
          "EXCEPTION",
          false,
          undefined
        );
        callBack.end(jsonString);
      }
    })
    .error(function (err) {
      logger.error(
        "[DVP-CampCallbackInfo.GetCallbackInfosByClassTypeCategory] - [%s] - [%s] - [PGSQL]  - Error in searching.",
        tenantId,
        companyId,
        err
      );
      jsonString = messageFormatter.FormatMessage(
        err,
        "EXCEPTION",
        false,
        undefined
      );
      callBack.end(jsonString);
    });
}

module.exports.CreateCallbackInfo = CreateCallbackInfo;
module.exports.EditCallbackInfo = EditCallbackInfo;
module.exports.GetCallbackInfo = GetCallbackInfo;
module.exports.GetAllCallbackInfos = GetAllCallbackInfos;
module.exports.GetCallbackInfosByCampaignId = GetCallbackInfosByCampaignId;
module.exports.GetCallbackInfosByClassTypeCategory = GetCallbackInfosByClassTypeCategory;
