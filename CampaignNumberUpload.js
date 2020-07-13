/**
 * Created by Rajinda on 6/26/2015.
 */
var logger = require("dvp-common-lite/LogHandler/CommonLogHandler.js").logger;
var DbConn = require("dvp-dbmodels");
//var List = require("collections/list"); --violate with sequelize library
var messageFormatter = require("dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js");
var async = require("async");
let redis_handler = require("./redis_handler");
let dialerRedisHandler = require("./DialerRedisHandler.js");

function UploadContacts(contacts, tenantId, companyId, categoryID, callBack) {
  var jsonString;
  var startTime = new Date();

  var nos = [];

  if (contacts) {
    logger.info("UploadContacts - 1 - %s ", contacts.length);

    for (var i = 0; i < contacts.length; i++) {
      var no = {
        ContactId: contacts[i],
        Status: true,
        TenantId: tenantId,
        CompanyId: companyId,
        CategoryID: categoryID,
      };
      nos.add(no);
    }
  }

  logger.info(
    "UploadContacts - 2 - %s - %s ms",
    contacts.length,
    new Date() - startTime
  );

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
  DbConn.CampContactInfo.bulkCreate(nos, {
    validate: false,
    individualHooks: true,
  })
    .then(function (results) {
      jsonString = messageFormatter.FormatMessage(
        undefined,
        "SUCCESS",
        true,
        "done"
      );
      logger.info(
        "[DVP-CampCampaignInfo.UploadContacts] - [PGSQL] - UploadContacts successfully.[%s] ",
        jsonString
      );
      callBack.end(jsonString);
    })
    .catch(function (err) {
      jsonString = messageFormatter.FormatMessage(
        err,
        "EXCEPTION",
        false,
        undefined
      );
      logger.error(
        "[DVP-CampCampaignInfo.UploadContacts] - [%s] - [PGSQL] - UploadContacts failed",
        companyId,
        err
      );
      callBack.end(jsonString);
    })
    .finally(function () {
      logger.info(
        "UploadContacts - %s - %s ms Done.",
        contacts.length,
        new Date() - startTime
      );
    });
}

function UploadContactsToCampaign(
  contacts,
  campaignId,
  tenantId,
  companyId,
  categoryID,
  extraData,
  callBack
) {
  var ids = [];
  var j = 0;

  function UploadContactsToCampaignThen(cmp) {
    j++;
    logger.info(
      "[DVP-CampContactInfo.UploadContactsToCampaign] - [%s] - [PGSQL] - inserted[CampContactInfo] successfully ",
      contacts[j - 1]
    );

    DbConn.CampContactSchedule.create({
      CampaignId: campaignId,
      CamContactId: cmp.CamContactId,
      ExtraData: extraData,
      DialerStatus: "added",
    })
      .then(function (j) {
        logger.info(
          "[DVP-CampContactInfo.UploadContactsToCampaign] - [%s] - [PGSQL] - inserted[CampContactSchedule] successfully ",
          contacts[j - 1]
        );
        redis_handler.process_counters(
          tenantId,
          companyId,
          campaignId,
          "0000",
          1,
          1
        );
      })
      .error(function (err) {
        logger.error(
          "[DVP-CampContactInfo.UploadContactsToCampaign] - [%s] - [PGSQL] - insertion[CampContactSchedule]  failed- [%s]",
          contacts[j - 1],
          err
        );
        ids.add(cmp.ContactId);
      });

    if (j >= contacts.length) {
      var msg = undefined;
      if (ids.length > 0) {
        msg = new Error("Validation Error");
      }
      var jsonString = messageFormatter.FormatMessage(
        msg,
        "OPERATIONS COMPLETED",
        ids.length === 0,
        ids
      );
      callBack.end(jsonString);
    }
  }

  function UploadContactsToCampaignError(err) {
    j++;
    logger.error(
      "[DVP-CampContactInfo.UploadContactsToCampaign] - [%s] - [PGSQL] - insertion[CampContactInfo]  failed - [%s]",
      contacts[j - 1],
      err
    );
    //ids.add(cmp.ContactId);
  }

  for (var i = 0; i < contacts.length; i++) {
    DbConn.CampContactInfo.create({
      ContactId: contacts[i],
      Status: true,
      TenantId: tenantId,
      CompanyId: companyId,
      CategoryID: categoryID,
    })
      .then(UploadContactsToCampaignThen)
      .error(UploadContactsToCampaignError);
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

function UploadContactsToCampaignWithSchedule(
  items,
  campaignId,
  camScheduleId,
  schedule,
  tenantId,
  companyId,
  categoryID,
  extraData,
  callBackm
) {
  var task = [];
  var CampScheduleTask = [];
  var camContactId = [];
  var errList = [];

  function CampScheduleCallback(err, result) {
    AddMapData(
      campaignId,
      camScheduleId,
      categoryID,
      schedule,
      tenantId,
      companyId
    );
    var jsonString = messageFormatter.FormatMessage(
      err,
      "OPERATIONS COMPLETED",
      errList.length === 0,
      errList
    );
    redis_handler.process_counters(
      tenantId,
      companyId,
      campaignId,
      camScheduleId,
      items.length,
      items.length
    );
    callBackm.end(jsonString);
  }

  function callback(err, result) {
    if (result) {
      result.forEach(function (item) {
        if (item) {
          /////////////added extra data//////////////////////
          var extraData = {};
          if (typeof item === "object" && item.CamContactId) {
            if (item.ExtraData) {
              extraData = item.ExtraData;
            }
            item = item.CamContactId;
          }

          /////////////////////////////////////////////////////////////////////////////////

          CampScheduleTask.push(function createContact(CampScheduleCallback) {
            DbConn.CampContactSchedule.create({
              CampaignId: campaignId,
              CamContactId: item,
              CamScheduleId: camScheduleId,
              ExtraData: JSON.stringify(extraData),
              DialerStatus: "added",
            })
              .then(function (cmp) {
                CampScheduleCallback(null, cmp);
              })
              .error(function (err) {
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
    /////////////added extra data//////////////////////
    var extraData = {};
    if (typeof item === "object" && item.contact) {
      if (item.otherdata) {
        extraData = item.otherdata;
      }
      item = item.contact;
    }

    // split the number record by first colon, to seperate the preview data..
    var num_PreviewData = item.split(/:(.+)/);

    if (num_PreviewData.length > 1) {
      extraData = JSON.parse(num_PreviewData[1]);
      item = num_PreviewData[0];
    }
    ///////////////////////////////////////////////////////

    task.push(function createContact(callback) {
      DbConn.CampContactInfo.create({
        ContactId: item,
        Status: true,
        TenantId: tenantId,
        CompanyId: companyId,
        CategoryID: categoryID,
      })
        .then(function (cmp) {
          camContactId.push(cmp.CamContactId);
          cmp.ExtraData = extraData;
          callback(null, cmp);
        })
        .error(function (err) {
          errList.push(item);
          callback(null, null);
        });
    });
  });

  async.parallel(task, callback);
}

function AddExistingContactsToCampaign(
  tenantId,
  companyId,
  contactIds,
  campaignId,
  callBack
) {
  var nos = [];
  var jsonString;
  for (var i = 0; i < contactIds.length; i++) {
    var no = {
      CampaignId: campaignId,
      CamContactId: contactIds[i],
      DialerStatus: "added",
    };
    nos.add(no);
  }

  DbConn.CampContactSchedule.bulkCreate(nos)
    .then(function (results) {
      redis_handler.process_counters(
        tenantId,
        companyId,
        campaignId,
        "0000",
        nos.length,
        nos.length
      );
      jsonString = messageFormatter.FormatMessage(
        undefined,
        "SUCCESS",
        true,
        results
      );
      logger.info(
        "[DVP-CampaignNumberUpload.AddExistingContactsToCampaign] - [PGSQL] - Updated successfully.[%s] ",
        jsonString
      );
      callBack.end(jsonString);
    })
    .error(function (err) {
      jsonString = messageFormatter.FormatMessage(
        err,
        "EXCEPTION",
        false,
        undefined
      );
      logger.error(
        "[DVP-CampaignNumberUpload.AddExistingContactsToCampaign] - [%s] - [PGSQL] - Updation failed- [%s]",
        campaignId,
        err
      );
      callBack.end(jsonString);
    });
}

function EditContact(
  contact,
  campaignId,
  tenantId,
  companyId,
  categoryID,
  callBack
) {
  var jsonString;
  DbConn.CampContactInfo.update(
    {
      CampaignId: campaignId,
      TenantId: tenantId,
      CompanyId: companyId,
      CategoryID: categoryID,
      Status: true,
    },
    {
      where: {
        ContactId: contact,
      },
    }
  )
    .then(function (results) {
      logger.info(
        "[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updated successfully",
        contact
      );
      jsonString = messageFormatter.FormatMessage(
        undefined,
        "SUCCESS",
        true,
        results
      );
      callBack.end(jsonString);
    })
    .error(function (err) {
      logger.error(
        "[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updation failed- [%s]",
        contact,
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

function EditContacts(
  contacts,
  campaignId,
  tenantId,
  companyId,
  categoryID,
  callBack
) {
  var jsonString;
  var ids = [];
  var j = 0;

  function EditContactsThen(results) {
    j++;
    logger.info(
      "[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updated successfully",
      contacts[j - 1]
    );
    if (j >= contacts.length) {
      var msg = undefined;
      if (ids.length > 0) {
        msg = new Error("Validation Error");
      }
      jsonString = messageFormatter.FormatMessage(
        msg,
        "OPERATIONS COMPLETED",
        ids.length === 0,
        ids
      );
      callBack.end(jsonString);
    }
  }

  function EditContactsError(err) {
    j++;
    logger.error(
      "[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updation failed- [%s]",
      contacts[j - 1],
      err
    );

    ids.add(contacts[j - 1]);
    if (j >= contacts.length) {
      var msg = undefined;
      if (ids.length > 0) {
        msg = new Error("Validation Error");
      }
      jsonString = messageFormatter.FormatMessage(
        msg,
        "OPERATIONS COMPLETED",
        ids.length === 0,
        ids
      );
      callBack.end(jsonString);
    }
  }

  for (var i = 0; i < contacts.length; i++) {
    DbConn.CampContactInfo.update(
      {
        CampaignId: campaignId,
        TenantId: tenantId,
        CompanyId: companyId,
        CategoryID: categoryID,
        Status: true,
      },
      {
        where: {
          ContactId: contacts[i],
        },
      }
    )
      .then(EditContactsThen)
      .error(EditContactsError);
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
    logger.info(
      "[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updated successfully",
      contacts[j - 1]
    );
    if (j >= contacts.length) {
      var msg = undefined;
      if (ids.length > 0) {
        msg = new Error("Validation Error");
      }
      jsonString = messageFormatter.FormatMessage(
        msg,
        "OPERATIONS COMPLETED",
        ids.length === 0,
        ids
      );
      callBack.end(jsonString);
    }
  }

  function DeleteContactsError(err) {
    logger.error(
      "[DVP-CampaignNumberUpload.EditContacts] - [%s] - [PGSQL] - Updation failed- [%s]",
      contacts[j - 1],
      err
    );
    ids.add(contacts[j - 1]);
    if (j >= contacts.length) {
      var msg = undefined;
      if (ids.length > 0) {
        msg = new Error("Validation Error");
      }
      jsonString = messageFormatter.FormatMessage(
        msg,
        "OPERATIONS COMPLETED",
        ids.length === 0,
        ids
      );
      callBack.end(jsonString);
    }
  }

  for (var i = 0; i < contacts.length; i++) {
    DbConn.CampContactInfo.update(
      {
        Status: false,
      },
      {
        where: [
          { ContactId: contacts[i] },
          { CompanyId: companyId },
          { TenantId: tenantId },
          { CampaignId: campaignId },
        ],
      }
    )
      .then(DeleteContactsThen)
      .error(DeleteContactsError);
  }
  /* var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, ids);
     callBack.end(jsonString);*/
}

function GetAllContact(tenantId, companyId, callBack) {
  var jsonString;
  DbConn.CampContactInfo.findAll({
    where: [
      { CompanyId: companyId },
      { TenantId: tenantId },
      { DialerStatus: "added" },
    ],
  })
    .then(function (CamObject) {
      if (CamObject) {
        logger.info(
          "[DVP-CampaignNumberUpload.GetAllContact] - [%s] - [PGSQL]  - Data found  - %s",
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
          "[DVP-CampaignNumberUpload.GetAllContact] - [PGSQL]  - No record found for %s - %s  ",
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
        "[DVP-CampaignNumberUpload.GetAllContact] - [%s] - [%s] - [PGSQL]  - Error in searching.",
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

function GetAllContactByCampaignId(campaignId, tenantId, companyId, callBack) {
  var jsonString;
  DbConn.CampContactSchedule.findAll({
    where: [{ CampaignId: campaignId }, { DialerStatus: "added" }],
    attributes: ["ExtraData"],
    include: [
      {
        model: DbConn.CampContactInfo,
        as: "CampContactInfo",
        attributes: ["ContactId"],
      },
    ],
  })
    .then(function (CamObject) {
      if (CamObject) {
        //var values = {CampaignId:campaignId,CamScheduleId:scheduleId,RowCount:rowCount,Offset:-990099,PageNo:pageNo};
        /*update_loaded_numbers(CamObject, campaignId, -8, null);*/
        logger.info(
          "[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [%s] - [PGSQL]  - Data found  - %s - [%s]",
          tenantId,
          companyId,
          JSON.stringify(CamObject)
        );
        update_loaded_numbers(CamObject, callBack);

        /*jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);*/
      } else {
        logger.error(
          "[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [PGSQL]  - No record found for %s - %s  ",
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
        "[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]",
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

function GetAllContactByCategoryID(categoryId, tenantId, companyId, callBack) {
  var jsonString;
  var query = {
    where: [
      {
        CategoryID: categoryId,
        TenantId: tenantId,
        CompanyId: companyId,
        DialerStatus: "added",
      },
    ],
    include: [
      {
        model: DbConn.CampContactInfo,
        as: "CampContactInfo",
        attributes: ["ContactId"],
        where: [{ CategoryID: categoryId }],
      },
    ],
  };

  if (!categoryId) {
    query = {
      where: [{ TenantId: tenantId, CompanyId: companyId }],
      include: [
        {
          model: DbConn.CampContactInfo,
          as: "CampContactInfo",
          attributes: ["ContactId"],
          where: [{ CategoryID: categoryId }],
        },
      ],
    };
  }
  DbConn.CampContactCategory.find(query)
    .then(function (CamObject) {
      if (CamObject) {
        /*update_loaded_numbers(CamObject, -8, -8, null);*/
        logger.info(
          "[DVP-CampaignNumberUpload.GetAllContactByCategoryID] - [%s] - [PGSQL]  - Data found  - %s - [%s]",
          tenantId,
          companyId,
          JSON.stringify(CamObject)
        );
        update_loaded_numbers(CamObject, callBack);
        /*jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);*/
      } else {
        logger.error(
          "[DVP-CampaignNumberUpload.GetAllContactByCategoryID] - [PGSQL]  - No record found for %s - %s  ",
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
        "[DVP-CampaignNumberUpload.GetAllContactByCategoryID] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]",
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

function GetAllContactByCampaignIdScheduleId(
  campaignId,
  scheduleId,
  rowCount,
  pageNo,
  tenantId,
  companyId,
  callBack
) {
  var jsonString;

  DbConn.CampContactSchedule.findAll({
    where: [
      { CampaignId: campaignId },
      { CamScheduleId: scheduleId },
      { DialerStatus: "added" },
    ],
    attributes: ["ExtraData"],
    //offset: ((pageNo - 1) * rowCount),
    limit: rowCount,
    include: [
      {
        model: DbConn.CampContactInfo,
        as: "CampContactInfo",
        attributes: ["ContactId"],
        order: [["CamContactId", "DESC"]],
      },
    ],
  })
    .then(function (CamObject) {
      if (CamObject) {
        /*var values = {
                CampaignId: campaignId,
                CamScheduleId: scheduleId,
                RowCount: rowCount,
                Offset: -990099,
                PageNo: pageNo
            };
            update_loaded_numbers(CamObject, campaignId, scheduleId, values);*/
        logger.info(
          "[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [%s] - [PGSQL]  - Data found  - %s- [%s]",
          tenantId,
          companyId,
          JSON.stringify(CamObject)
        );
        update_loaded_numbers(CamObject, callBack);

        /*jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);*/
      } else {
        logger.error(
          "[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [PGSQL]  - No record found for %s - %s  ",
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
        "[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]",
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

  /*function get_numbers() {
        DbConn.CampContactSchedule.findAll({
            where: [{CampaignId: campaignId}, {CamScheduleId: scheduleId}, {DialerStatus: 'added'}],
            attributes: ['ExtraData'],
            //offset: ((pageNo - 1) * rowCount),
            limit: rowCount,
            include: [{
                model: DbConn.CampContactInfo,
                as: "CampContactInfo",
                attributes: ['ContactId'],
                order: [['CamContactId', 'DESC']]
            }]
        }).then(function (CamObject) {
            if (CamObject) {
                /!*var values = {
                    CampaignId: campaignId,
                    CamScheduleId: scheduleId,
                    RowCount: rowCount,
                    Offset: -990099,
                    PageNo: pageNo
                };
                update_loaded_numbers(CamObject, campaignId, scheduleId, values);*!/
                update_loaded_numbers(CamObject);
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

    if (pageNo < 0 && rowCount < 0) {
        DbConn.CampNumberLoadInfo.findAll({
            where: [{CampaignId: campaignId}, {CamScheduleId: scheduleId}]
        }).then(function (CamObject) {
            rowCount = CamObject.dataValues.RowCount;
            pageNo = CamObject.dataValues.PageNo;
            get_numbers();
        }).error(function (err) {
            logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]', tenantId, companyId, err);
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        });
    } else {
        get_numbers();
    }*/
}

function GetAllContactByCampaignIdScheduleIdWithoutPaging(
  campaignId,
  scheduleId,
  tenantId,
  companyId,
  callBack
) {
  var jsonString;
  //DbConn.CampContactSchedule.findAll({where: [{CampaignId: campaignId},{CamScheduleId:scheduleId}],offset: ((pageNo - 1)*rowCount),limit: rowCount,attributes: [],include:[{model:DbConn.CampContactInfo, as :"CampContactInfo" ,attributes: ['ContactId']}]}).complete(function (err, CamObject) {
  DbConn.CampContactSchedule.findAll({
    where: [
      { CampaignId: campaignId },
      { CamScheduleId: scheduleId },
      { DialerStatus: "added" },
    ],
    attributes: ["ExtraData"],
    include: [
      {
        model: DbConn.CampContactInfo,
        as: "CampContactInfo",
        attributes: ["ContactId"],
        order: [["CamContactId", "DESC"]],
      },
    ],
  })
    .then(function (CamObject) {
      if (CamObject) {
        /*update_loaded_numbers(CamObject, campaignId, scheduleId, null);*/
        logger.info(
          "[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleIdWithoutPaging] - [%s] - [PGSQL]  - Data found  - %s- [%s]",
          tenantId,
          companyId,
          JSON.stringify(CamObject)
        );
        update_loaded_numbers(CamObject, callBack);

        /*  jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
            callBack.end(jsonString);*/
      } else {
        logger.error(
          "[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleIdWithoutPaging] - [PGSQL]  - No record found for %s - %s  ",
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
        "[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleIdWithoutPaging] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]",
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

function GetExtraDataByContactId(
  campaignId,
  contactId,
  rowCount,
  pageNo,
  tenantId,
  companyId,
  callBack
) {
  var jsonString;
  DbConn.CampContactSchedule.findAll({
    where: [{ CampaignId: campaignId }, { DialerStatus: "added" }],
    attributes: ["ExtraData"],
    //offset: ((pageNo - 1) * rowCount),//dialer want only top requested items
    limit: rowCount,
    include: [
      {
        model: DbConn.CampContactInfo,
        as: "CampContactInfo",
        attributes: ["ContactId"],
        where: [{ ContactId: contactId }],
        order: [["CamContactId", "DESC"]],
      },
    ],
  })
    .then(function (CamObject) {
      if (CamObject) {
        logger.info(
          "[DVP-CampaignNumberUpload.GetExtraDataByContactId] - [%s] - [PGSQL]  - Data found  - %s- [%s]",
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
          "[DVP-CampaignNumberUpload.GetExtraDataByContactId] - [PGSQL]  - No record found for %s - %s  ",
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
        "[DVP-CampaignNumberUpload.GetExtraDataByContactId] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]",
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

function CreateContactCategory(categoryName, tenantId, companyId, callBack) {
  var jsonString;
  DbConn.CampContactCategory.create({
    CategoryName: categoryName,
    TenantId: tenantId,
    CompanyId: companyId,
  })
    .then(function (results) {
      jsonString = messageFormatter.FormatMessage(
        undefined,
        "SUCCESS",
        true,
        results
      );
      logger.info(
        "[DVP-CampContactCategory.CreateContactCategory] - [PGSQL] - CreateContactCategory successfully.[%s] ",
        jsonString
      );
      callBack.end(jsonString);
    })
    .error(function (err) {
      jsonString = messageFormatter.FormatMessage(
        err,
        "EXCEPTION",
        false,
        undefined
      );
      logger.error(
        "[DVP-CampContactCategory.CreateContactCategory] - [%s] - [PGSQL] - CreateContactCategory failed- [%s]",
        categoryName,
        err
      );
      callBack.end(jsonString);
    });
}

function EditContactCategory(
  categoryID,
  categoryName,
  tenantId,
  companyId,
  callBack
) {
  var jsonString;
  DbConn.CampContactCategory.update(
    {
      CategoryName: categoryName,
    },
    {
      where: [
        { TenantId: tenantId },
        { CompanyId: companyId },
        { CategoryID: categoryID },
      ],
    }
  )
    .then(function (results) {
      jsonString = messageFormatter.FormatMessage(
        undefined,
        "SUCCESS",
        true,
        results
      );
      logger.info(
        "[DVP-CampContactCategory.CreateContactCategory] - [PGSQL] - CreateContactCategory successfully.[%s] ",
        jsonString
      );
      callBack.end(jsonString);
    })
    .error(function (err) {
      jsonString = messageFormatter.FormatMessage(
        err,
        "EXCEPTION",
        false,
        undefined
      );
      logger.error(
        "[DVP-CampContactCategory.CreateContactCategory] - [%s] - [PGSQL] - CreateContactCategory failed- [%s]",
        categoryName,
        err
      );
      callBack.end(jsonString);
    });
}

function GetContactCategory(tenantId, companyId, callBack) {
  var jsonString;
  DbConn.CampContactCategory.findAll({
    where: [{ CompanyId: companyId }, { TenantId: tenantId }],
  })
    .then(function (results) {
      jsonString = messageFormatter.FormatMessage(
        undefined,
        "SUCCESS",
        true,
        results
      );
      logger.info(
        "[DVP-CampContactCategory.GetContactCategory] - [PGSQL] - GetContactCategory successfully.[%s] ",
        jsonString
      );
      callBack.end(jsonString);
    })
    .error(function (err) {
      jsonString = messageFormatter.FormatMessage(
        err,
        "EXCEPTION",
        false,
        undefined
      );
      logger.error(
        "[DVP-CampContactCategory.GetContactCategory] - [%s] - [PGSQL] - GetContactCategory failed- [%s]",
        companyId,
        err
      );
      callBack.end(jsonString);
    });
}

/*function mapNumberToCampaign(req, res) {
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

}*/

function mapNumberToCampaign(req, res) {
  var jsonString;

  var tenantId = req.user.tenant;
  var companyId = req.user.company;

  DbConn.CampContactInfo.findAll({
    where: [
      { CompanyId: companyId },
      { TenantId: tenantId },
      { CategoryID: req.params.CategoryID },
    ],
  })
    .then(function (cmp) {
      if (cmp && Array.isArray(cmp) && cmp.length > 0) {
        var condition = [
          { CampaignId: req.params.CampaignId },
          { BatchNo: cmp[0].BatchNo },
        ];
        if (req.body.camScheduleId) {
          condition.push({ CamScheduleId: req.body.camScheduleId });
        }
        DbConn.CampContactSchedule.find({ where: condition })
          .then(function (results) {
            if (results) {
              jsonString = messageFormatter.FormatMessage(
                new Error("Invalid Batch No"),
                "EXCEPTION",
                false,
                undefined
              );
              logger.error(
                "CampContactInfo - bulkCreate failed- [%s]",
                new Error("Invalid Batch No")
              );
              res.end(jsonString);
            } else {
              var nos = cmp.map(function (item) {
                return {
                  CampaignId: req.params.CampaignId,
                  CamContactId: item.CamContactId,
                  BatchNo: cmp[0].BatchNo,
                  DialerStatus: "added",
                };
              });

              DbConn.CampContactSchedule.bulkCreate(nos)
                .then(function (results) {
                  AddMapData(
                    req.params.CampaignId,
                    req.body.camScheduleId,
                    req.params.CategoryID,
                    req.body.ScheduleName,
                    tenantId,
                    companyId
                  );
                  redis_handler.process_counters(
                    tenantId,
                    companyId,
                    req.params.CampaignId,
                    req.body.camScheduleId,
                    nos.length,
                    nos.length
                  );
                  jsonString = messageFormatter.FormatMessage(
                    undefined,
                    "SUCCESS",
                    true,
                    results
                  );
                  logger.info(
                    "CampContactInfo - bulkCreate successfully.[%s] ",
                    jsonString
                  );
                  res.end(jsonString);
                })
                .error(function (err) {
                  jsonString = messageFormatter.FormatMessage(
                    err,
                    "EXCEPTION",
                    false,
                    undefined
                  );
                  logger.error(
                    "CampContactInfo - bulkCreate failed- [%s]",
                    err
                  );
                  res.end(jsonString);
                });
            }
          })
          .error(function (err) {
            jsonString = messageFormatter.FormatMessage(
              err,
              "EXCEPTION",
              false,
              undefined
            );
            logger.error("CampContactInfo ---", err);
            res.end(jsonString);
          });
      } else {
        jsonString = messageFormatter.FormatMessage(
          new Error("Invalid Category or No Number found."),
          "EXCEPTION",
          false,
          undefined
        );
        logger.error(
          "[mapNumberToCompaign] - mapNumberToCompaign failed- [%s]",
          new Error("Invalid Category")
        );
        res.end(jsonString);
      }
    })
    .error(function (err) {
      jsonString = messageFormatter.FormatMessage(
        err,
        "EXCEPTION",
        false,
        undefined
      );
      logger.error(
        "[mapNumberToCompaign] - mapNumberToCompaign failed- [%s]",
        err
      );
      res.end(jsonString);
    });
}

function mapScheduleToCampaign(req, res) {
  var jsonString;

  var tenantId = req.user.tenant;
  var companyId = req.user.company;
  DbConn.CampScheduleInfo.find({
    where: [
      { CampaignId: req.params.CampaignId },
      { CamScheduleId: req.params.CamScheduleId },
      { CompanyId: companyId },
      { TenantId: tenantId },
    ],
  })
    .then(function (cmp) {
      if (cmp) {
        jsonString = messageFormatter.FormatMessage(
          new Error(
            "You need to Add Schedule To Campaign Before You Map Them to Campaign."
          ),
          "EXCEPTION",
          false,
          undefined
        );
        logger.error(
          "mapScheduleToCampaign failed- [%s]",
          new Error(
            "You need to Add Schedule To Campaign Before You Map Them to Campaign."
          )
        );
        res.end(jsonString);
      } else {
        DbConn.CampContactSchedule.findAll({
          where: [
            { CampaignId: req.params.CampaignId },
            { CamScheduleId: req.params.CamScheduleId },
          ],
        })
          .then(function (cmp) {
            if (cmp && Array.isArray(cmp) && cmp.length > 0) {
              jsonString = messageFormatter.FormatMessage(
                new Error("Invalid Schedule ID OR Already Map To Campaign."),
                "EXCEPTION",
                false,
                undefined
              );
              logger.error(
                "mapScheduleToCampaign failed- [%s]",
                new Error("Invalid Schedule ID")
              );
              res.end(jsonString);
            } else {
              DbConn.CampContactSchedule.create({
                CampaignId: req.params.CampaignId,
                CamScheduleId: cmp.CamScheduleId,
                DialerStatus: "added",
              })
                .then(function (result) {
                  if (result) {
                    jsonString = messageFormatter.FormatMessage(
                      undefined,
                      "SUCCESS",
                      true,
                      result
                    );
                    logger.info(
                      "CampContactSchedule successfully.[%s] ",
                      jsonString
                    );
                    res.end(jsonString);
                  } else {
                    jsonString = messageFormatter.FormatMessage(
                      undefined,
                      "FAIL",
                      false,
                      result
                    );
                    logger.info("CampContactSchedule Fail.[%s] ", jsonString);
                    res.end(jsonString);
                  }
                })
                .error(function (err) {
                  jsonString = messageFormatter.FormatMessage(
                    err,
                    "EXCEPTION",
                    false,
                    undefined
                  );
                  logger.error("CampContactSchedule failed- [%s]", err);
                  res.end(jsonString);
                });
            }
          })
          .error(function (err) {
            jsonString = messageFormatter.FormatMessage(
              err,
              "EXCEPTION",
              false,
              undefined
            );
            logger.error("mapScheduleToCampaign failed- [%s]", err);
            res.end(jsonString);
          });
      }
    })
    .error(function (err) {
      jsonString = messageFormatter.FormatMessage(
        err,
        "EXCEPTION",
        false,
        undefined
      );
      logger.error("mapScheduleToCampaign failed- [%s]", err);
      res.end(jsonString);
    });
}

function mapNumberAndScheduleToCampaign(req, res) {
  var jsonString;
  var tenantId = req.user.tenant;
  var companyId = req.user.company;

  DbConn.CampScheduleInfo.find({
    where: [
      { CompanyId: companyId },
      { TenantId: tenantId },
      { CampaignId: req.params.CampaignId },
    ],
  })
    .then(function (CamObject) {
      if (CamObject) {
        req.body.camScheduleId = CamObject.CamScheduleId;
        DbConn.CampContactSchedule.findAll({
          where: [
            { CampaignId: req.params.CampaignId },
            { CamScheduleId: CamObject.CamScheduleId },
          ],
        })
          .then(function (cmp) {
            if (cmp && Array.isArray(cmp) && cmp.length > 0) {
              mapNumberToCampaign(req, res);
            } else {
              DbConn.CampContactSchedule.create({
                CampaignId: req.params.CampaignId,
                CamScheduleId: CamObject.CamScheduleId,
                DialerStatus: "added",
              })
                .then(function (result) {
                  if (result) {
                    mapNumberToCampaign(req, res);
                  } else {
                    jsonString = messageFormatter.FormatMessage(
                      undefined,
                      "FAIL",
                      false,
                      result
                    );
                    logger.info(
                      "mapNumberAndScheduleToCampaign Fail.[%s] ",
                      jsonString
                    );
                    res.end(jsonString);
                  }
                })
                .error(function (err) {
                  jsonString = messageFormatter.FormatMessage(
                    err,
                    "EXCEPTION",
                    false,
                    undefined
                  );
                  logger.error(
                    "mapNumberAndScheduleToCampaign failed- [%s]",
                    err
                  );
                  res.end(jsonString);
                });
            }
          })
          .error(function (err) {
            jsonString = messageFormatter.FormatMessage(
              err,
              "EXCEPTION",
              false,
              undefined
            );
            logger.error("mapNumberAndScheduleToCampaign failed- [%s]", err);
            res.end(jsonString);
          });
      } else {
        logger.error("Fail To Find CampScheduleInfo", new Error("No record"));
        jsonString = messageFormatter.FormatMessage(
          new Error("No record"),
          "EXCEPTION",
          false,
          undefined
        );
        res.end(jsonString);
      }
    })
    .error(function (err) {
      logger.error("Fail To Find CampScheduleInfo", err);
      jsonString = messageFormatter.FormatMessage(
        err,
        "EXCEPTION",
        false,
        undefined
      );
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

function getAssignedCategory(campaignId, tenantId, companyId, callBack) {
  var jsonString;
  DbConn.CampMapContactSchedule.findAll({
    where: [{ CampaignId: campaignId }],
    include: [{ model: DbConn.CampContactCategory, as: "CampContactCategory" }],
  })
    .then(function (CamObject) {
      if (CamObject) {
        logger.info(
          "getAssignedCategory - [%s] - [PGSQL]  - Data found  - %s - [%s]",
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
          "getAssignedCategory - [PGSQL]  - No record found for %s - %s  ",
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
        "getAssignedCategory - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]",
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

function AddMapData(
  campaignId,
  camScheduleId,
  categoryID,
  schedule,
  tenantId,
  companyId
) {
  try {
    DbConn.CampMapContactSchedule.create({
      CampaignId: campaignId,
      CamScheduleId: camScheduleId,
      CamSchedule: schedule,
      CategoryID: categoryID,
      TenantId: tenantId,
      CompanyId: companyId,
    })
      .then(function (result) {
        console.log(
          messageFormatter.FormatMessage(undefined, "then", true, result)
        );
      })
      .error(function (err) {
        console.log(
          messageFormatter.FormatMessage(undefined, "error", false, err)
        );
      });
  } catch (ex) {
    console.log(ex);
  }
}

function upsert(values, condition) {
  return Model.findOne({ where: condition }).then(function (obj) {
    if (obj) {
      // update
      return obj.update(values);
    } else {
      // insert
      return Model.create(values);
    }
  });
}

function update_loaded_numbers(Numbers, callBack) {
  try {
    let ids = Numbers.map(function (item) {
      return item.dataValues.ContactScheduleId;
    });

    DbConn.CampContactSchedule.update(
      {
        DialerStatus: "pick",
      },
      {
        where: [
          {
            ContactScheduleId: { $in: ids },
          },
        ],
      }
    )
      .then(function (results) {
        var jsonString = messageFormatter.FormatMessage(
          undefined,
          "SUCCESS",
          true,
          Numbers
        );
        logger.info("update_loaded_numbers completed [%s]", results);
        callBack.end(jsonString);
      })
      .catch(function (err) {
        logger.error("update_loaded_numbers ---.- [%s]", err);
        var jsonString = messageFormatter.FormatMessage(
          err,
          "update_loaded_numbers",
          false,
          undefined
        );
        callBack.end(jsonString);
      });
  } catch (err) {
    logger.error("update_loaded_numbers.- [%s]", err);
    var jsonString = messageFormatter.FormatMessage(
      err,
      "update_loaded_numbers",
      false,
      undefined
    );
    callBack.end(jsonString);
  }
}

/*function update_loaded_numbers(Numbers, campaignId, camScheduleId, values) {

    try {
        let ids = Numbers.map(function (item) {
            return item.dataValues.ContactScheduleId;
        });

        DbConn.CampContactSchedule.update({
                DialerStatus: "pick"
            },
            {
                where: [
                    {
                        ContactScheduleId: {$in: ids}
                    }
                ]
            }
        ).then(function (results) {
            logger.error('update_loaded_numbers completed [%s]', results);
        }).catch(function (err) {
            logger.error('update_loaded_numbers ---.- [%s]', err);
        });

        if (values) {
            DbConn.CampNumberLoadInfo.findOne(
                {
                    where: [{CampaignId: campaignId}, {CamScheduleId: camScheduleId}]
                }
            ).then(function (results) {
                if (results) { // update
                    return results.update(values);
                }
                else { // insert
                    return DbConn.CampNumberLoadInfo.create(values);
                }
            }).catch(function (err) {
                logger.error('CampNumberLoadInfo ---.- [%s]', err);
            });
        }


    } catch (err) {
        logger.error('update_loaded_numbers.- [%s]', err);
    }
}*/

function RemoveCampaignNumbers(campaignId, tenantId, companyId, callback) {
  DbConn.CampConfigurations.find({
    where: [
      { CampaignId: campaignId, TenantId: tenantId, CompanyId: companyId },
    ],
  })
    .then(function (campConf) {
      if (campConf) {
        if (campConf.NumberLoadingMethod === "NUMBER") {
          //Change state to removed

          DbConn.CampContactSchedule.update(
            {
              DialerStatus: "removed_by_api",
            },
            {
              where: {
                CampaignId: campaignId,
                DialerStatus: "added",
              },
            }
          )
            .then(function (updateRes) {
              //remove from redis
              let pattern =
                "CampaignNumbers:" +
                companyId +
                ":" +
                tenantId +
                ":" +
                campaignId +
                ":*";
              dialerRedisHandler.GetKeys(pattern, function (err, keys) {
                keys.forEach(function (key) {
                  dialerRedisHandler.DeleteObject(key);
                });
              });
              callback(null, true);
            })
            .catch(function (err) {
              callback(err, false);
            });
        } else if (campConf.NumberLoadingMethod === "CONTACT") {
          DbConn.CampContactbaseNumbers.update(
            {
              DialerStatus: "removed_by_api",
            },
            {
              where: {
                CampaignId: campaignId,
                DialerStatus: "added",
              },
            }
          )
            .then(function (updateRes) {
              //remove from redis
              let key =
                "CampaignContacts:" +
                companyId +
                ":" +
                tenantId +
                ":" +
                campaignId;
              dialerRedisHandler.DeleteObject(key);
              callback(null, true);
            })
            .catch(function (err) {
              callback(err, false);
            });
        } else {
          callback(new Error("Invalid number loading type"), false);
        }
      } else {
        callback(new Error("Campaign not found"), false);
      }
    })
    .catch(function (err) {
      callback(err, false);
    });
}

function GetAllContactByCampaignIdScheduleIdOffset(
  campaignId,
  scheduleId,
  rowCount,
  offset,
  tenantId,
  companyId,
  callBack
) {
  var jsonString;

  DbConn.CampContactSchedule.findAll({
    where: [
      { CampaignId: campaignId },
      { CamScheduleId: scheduleId },
      { DialerStatus: "added" },
    ],
    //offset: offset, //dialer want only top requested items
    limit: rowCount,
    include: [
      {
        model: DbConn.CampContactInfo,
        as: "CampContactInfo",
        attributes: ["ContactId", "BusinessUnit"],
        order: [["CamContactId", "DESC"]],
      },
    ],
  })
    .then(function (CamObject) {
      if (CamObject) {
        logger.info(
          "[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [%s] - [PGSQL]  - Data found  - %s- [%s]",
          tenantId,
          companyId,
          JSON.stringify(CamObject)
        );
        /*var values = {
                CampaignId: campaignId,
                CamScheduleId: scheduleId,
                RowCount: rowCount,
                Offset: offset,
                PageNo: -990099
            };
            update_loaded_numbers(CamObject, campaignId, scheduleId, values);*/
        update_loaded_numbers(CamObject, callBack);
      } else {
        logger.error(
          "[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [PGSQL]  - No record found for %s - %s  ",
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
        "[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]",
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

  /*function get_numbers() {
        DbConn.CampContactSchedule.findAll({
            where: [{CampaignId: campaignId}, {CamScheduleId: scheduleId}, {DialerStatus: 'added'}],
            attributes: ['ExtraData'],
            //offset: offset, //dialer want only top requested items
            limit: rowCount,
            include: [{
                model: DbConn.CampContactInfo,
                as: "CampContactInfo",
                attributes: ['ContactId','BusinessUnit'],
                order: [['CamContactId', 'DESC']]
            }]
        }).then(function (CamObject) {
            if (CamObject) {
                logger.info('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [%s] - [PGSQL]  - Data found  - %s- [%s]', tenantId, companyId, JSON.stringify(CamObject));
                jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, CamObject);
                callBack.end(jsonString);
            }
            else {
                /!*var values = {
                    CampaignId: campaignId,
                    CamScheduleId: scheduleId,
                    RowCount: rowCount,
                    Offset: offset,
                    PageNo: -990099
                };
                update_loaded_numbers(CamObject, campaignId, scheduleId, values);*!/
                update_loaded_numbers(CamObject);
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

    if (rowCount < 0 && offset < 0) {
        DbConn.CampNumberLoadInfo.findAll({
            where: [{CampaignId: campaignId}, {CamScheduleId: scheduleId}]
        }).then(function (CamObject) {
            rowCount = CamObject.dataValues.RowCount;
            offset = CamObject.dataValues.Offset;
            get_numbers();
        }).error(function (err) {
            logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [%s] - [%s] - [PGSQL]  - Error in searching.- [%s]', tenantId, companyId, err);
            jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
            callBack.end(jsonString);
        });

    }else{
        get_numbers();
    }*/
}

function addAbandonedCallToCampaign(req, res) {
  try {
    function AddtocontactSchedule(CamObject) {
      var cam_schedule = {
        CampaignId: req.params.CampaignId,
        CamContactId: CamObject.CamContactId,
        CamScheduleId: req.body.CamScheduleId,
        BatchNo: req.body.CategoryID,
        ExtraData: req.body.ExtraData,
        DialerStatus: "added",
      };

      DbConn.CampContactSchedule.create(cam_schedule)
        .then(function (results) {
          redis_handler.process_counters(
            req.user.tenant,
            req.user.company,
            req.params.CampaignId,
            req.body.CamScheduleId,
            1,
            1
          );
          jsonString = messageFormatter.FormatMessage(
            undefined,
            "SUCCESS",
            true,
            results
          );
          logger.info(
            "[DVP-CampaignNumberUpload.addAbandonedCallToCampaign] - [PGSQL] - Updated successfully.[%s] ",
            jsonString
          );
          res.end(jsonString);
        })
        .error(function (err) {
          jsonString = messageFormatter.FormatMessage(
            err,
            "EXCEPTION",
            false,
            undefined
          );
          logger.error(
            "[DVP-CampaignNumberUpload.addAbandonedCallToCampaign] - [%s] - [PGSQL] - Updation failed- [%s]",
            req.params.CampaignId,
            err
          );
          res.end(jsonString);
        });
    }

    var tenantId = req.user.tenant;
    var companyId = req.user.company;

    var jsonString;
    DbConn.CampContactInfo.find({
      where: [
        { CompanyId: companyId },
        { TenantId: tenantId },
        { ContactId: req.params.contact_no },
      ],
    })
      .then(function (CamObject) {
        if (CamObject) {
          AddtocontactSchedule(CamObject);
        } else {
          var no = {
            ContactId: req.params.contact_no,
            Status: true,
            TenantId: tenantId,
            CompanyId: companyId,
            CategoryID: req.body.CategoryID,
            BusinessUnit: req.body.BusinessUnit,
          };
          DbConn.CampContactInfo.create(no)
            .then(function (CamObject) {
              AddtocontactSchedule(CamObject);
            })
            .error(function (err) {
              jsonString = messageFormatter.FormatMessage(
                err,
                "EXCEPTION",
                false,
                undefined
              );
              logger.error(
                "[DVP-CampaignNumberUpload.addAbandonedCallToCampaign] - [%s] - [PGSQL] - Updation failed- [%s]",
                req.params.CampaignId,
                err
              );
              res.end(jsonString);
            });
        }
      })
      .error(function (err) {
        logger.error(
          "[DVP-CampaignNumberUpload.addAbandonedCallToCampaign] - [%s] - [%s] - [PGSQL]  - Error in searching.",
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
        res.end(jsonString);
      });
  } catch (ex) {}
}

module.exports.UploadContacts = UploadContacts;
module.exports.UploadContactsToCampaign = UploadContactsToCampaign;
module.exports.UploadContactsToCampaignWithSchedule = UploadContactsToCampaignWithSchedule;
module.exports.AddExistingContactsToCampaign = AddExistingContactsToCampaign;
module.exports.EditContacts = EditContacts;
module.exports.EditContact = EditContact;
module.exports.DeleteContacts = DeleteContacts;
module.exports.RemoveCampaignNumbers = RemoveCampaignNumbers;

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
module.exports.GetAssignedCategory = getAssignedCategory;
module.exports.GetAllContactByCampaignIdScheduleIdOffset = GetAllContactByCampaignIdScheduleIdOffset;
module.exports.AddAbandonedCallToCampaign = addAbandonedCallToCampaign;
