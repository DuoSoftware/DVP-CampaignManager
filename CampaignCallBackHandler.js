/**
 * Created by Rajinda on 8/10/2015.
 */

var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('DVP-DBModels');
var List = require("collections/list");
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');

function CreateCampaign(campaignName, campaignMode, campaignChannel, dialoutMechanism, tenantId, companyId, campaignClass, campaignType, campaignCategory, extension, callback) {


    DbConn.CampCampaignInfo
        .create(
        {
            CampaignName: campaignName,
            CampaignMode: campaignMode,
            CampaignChannel: campaignChannel,
            DialoutMechanism: dialoutMechanism,
            TenantId: tenantId,
            CompanyId: companyId,
            Class: campaignClass,
            Type: campaignType,
            Category: campaignCategory,
            Extensions: extension,
            OperationalStatus: "create",
            Status: true
        }
    ).complete(function (err, cmp) {

            if (err) {

                logger.error('[DVP-CampCampaignInfo.CreateCampaign] - [%s] - [PGSQL] - insertion  failed-[%s]', campaignName, err);
                var jsonString = messageFormatter.FormatMessage(err, "EXCEPTION", false, undefined);
                callback.end(jsonString);
            }
            else {
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, cmp);
                logger.info('[DVP-CampCampaignInfo.CreateCampaign] - [PGSQL] - inserted successfully. [%s] ', jsonString);
                callback.end(jsonString);
            }
        });



}
