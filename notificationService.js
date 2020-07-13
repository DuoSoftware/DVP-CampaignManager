var config = require("config");
var validator = require("validator");
var util = require("util");
var logger = require("dvp-common-lite/LogHandler/CommonLogHandler.js").logger;
var request = require("request");
let redis_handler = require("./redis_handler");
let format = require("stringformat");

function DoPost(companyInfo, eventName, serviceurl, postData, callback) {
  var jsonStr = JSON.stringify(postData);
  logger.info(
    "Notification Url:: " + serviceurl + " :: Notification Data :: " + jsonStr
  );
  var accessToken = util.format("bearer %s", config.Services.accessToken);
  var options = {
    url: serviceurl,
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: accessToken,
      companyinfo: companyInfo,
      eventname: eventName,
    },
    body: jsonStr,
  };
  try {
    request.post(options, function optionalCallback(err, httpResponse, body) {
      if (err) {
        console.log("upload failed:", err);
      }
      console.log("Server returned: %j", body);
      callback(err, httpResponse, body);
    });
  } catch (ex) {
    callback(ex, undefined, undefined);
  }
}

var requestToNotify = function (company, tenant, roomName, eventName, msgData) {
  try {
    var notificationUrl = util.format(
      "http://%s/DVP/API/%s/NotificationService/Notification/initiate/%s",
      config.Services.notificationServiceHost,
      config.Services.notificationServiceVersion,
      roomName
    );
    if (validator.isIP(config.Services.notificationServiceHost)) {
      notificationUrl = util.format(
        "http://%s:%s/DVP/API/%s/NotificationService/Notification/initiate/%s",
        config.Services.notificationServiceHost,
        config.Services.notificationServicePort,
        config.Services.notificationServiceVersion,
        roomName
      );
    }
    var companyInfo = util.format("%d:%d", tenant, company);
    DoPost(companyInfo, eventName, notificationUrl, msgData, function (
      err,
      res1,
      result
    ) {
      if (err) {
        logger.error("Do Post: Error:: " + err);
      } else {
        if (res1.statusCode === 200) {
          logger.info("Do Post: Success " + roomName + " : " + eventName);
        } else {
          logger.info("Do Post: Failed " + roomName + " : " + eventName);
        }
      }
    });
  } catch (ex) {
    logger.error("Do Post: Error:: " + ex);
  }
};

let getCount = function (
  tenant,
  company,
  businessUnit,
  window,
  param1,
  param2
) {
  return new Promise((resolve, reject) => {
    try {
      let totalCountSearch = format(
        "CAM_TOTALCOUNT:{0}:{1}:{2}",
        tenant,
        company,
        window
      );
      if (param1)
        totalCountSearch = format(
          "CAM_TOTALCOUNT:{0}:{1}:{2}:CAMPAIGN:{3}",
          tenant,
          company,
          window,
          param1
        );
      if (param1 && param2)
        totalCountSearch = format(
          "CAM_TOTALCOUNT:{0}:{1}:{2}:CAMPAIGN:{3}:SCHEDULE:{4}",
          tenant,
          company,
          window,
          param1,
          param2
        );

      redis_handler
        .get_value(totalCountSearch)
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          resolve(-1);
        });
    } catch (err) {
      reject(err);
    }
  });
};

let get_dashborad_data = function (
  company,
  tenant,
  businessUnit,
  window,
  eventName,
  param1,
  param2
) {
  let counts = [
    getCount(tenant, company, businessUnit, window, null, null),
    getCount(tenant, company, businessUnit, window, param1, null),
    getCount(tenant, company, businessUnit, window, param1, param2),
  ];

  return Promise.all(counts).then((results) => {
    let reply = {
      roomData: { roomName: window + ":" + eventName, eventName: eventName },
      DashboardData: {
        businessUnit: "*",
        window: window,
        param1: param1,
        param2: param2,
        TotalCountWindow: results[0],
        TotalCountParam1: results[1],
        TotalCountParam2: results[2],
        TotalCountAllParams: results[0],
      },
    };

    let postData = {
      message: reply.DashboardData,
      From: "contactnumberupload",
    };
    requestToNotify(
      company,
      tenant,
      reply.roomData.roomName,
      reply.roomData.eventName,
      postData
    );
  });
};

module.exports.send_notification = function (
  company,
  tenant,
  campaignID,
  scheduleId
) {
  try {
    Promise.all([
      get_dashborad_data(
        company,
        tenant,
        "*",
        "PROFILES",
        "PROFILESCOUNT",
        campaignID,
        scheduleId
      ),
      get_dashborad_data(
        company,
        tenant,
        "*",
        "PROFILESCONTACTS",
        "PROFILESCONTACTSCOUNT",
        campaignID,
        scheduleId
      ),
    ]).then((results) => {
      console.log("Notification Send");
    });
  } catch (ex) {
    console.error(ex);
  }
};

module.exports.RequestToNotify = requestToNotify;
