/**
 * Created by Rajinda on 6/26/2015.
 */

var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var DbConn = require('DVP-DBModels');


/*
 Campaign has dialout mechanism, channel class and campaign modes, User can select combinations and validation should made from backend and UI components
 */
function CreateCampaign(campaignName,campaignMode,campaignChannel,dialoutMechanism,tenantId,companyId,campaignClass,campaignType,campaignCategory,callback){

}

function EditCampaign(campaignId,campaignMode,campaignChannel,dialoutMechanism,tenantId,companyId,campaignClass,campaignType,campaignCategory,callback){

}

function DeleteCampaign(campaignId,callback){

}

function GetAllCampaign(tenantId,companyId,callback){

}

function GetAllCampaignByCampaignId(campaignId,callback){

}

function GetOngoingCampaign(tenantId,companyId,callback){

}

function GetAllCampaignByCampaignState(tenantId,companyId,campaignState,callback){

}

function GetPendingCampaign(tenantId,companyId,dialerId,callback){

}



module.exports.CreateCampaign = CreateCampaign;
module.exports.EditCampaign = EditCampaign;
module.exports.DeleteCampaign = DeleteCampaign;
module.exports.GetAllCampaign = GetAllCampaign;
module.exports.GetAllCampaignByCampaignId = GetAllCampaignByCampaignId;
module.exports.GetOngoingCampaign = GetOngoingCampaign;
module.exports.GetAllCampaignByCampaignState = GetAllCampaignByCampaignState;
module.exports.GetPendingCampaign = GetPendingCampaign;