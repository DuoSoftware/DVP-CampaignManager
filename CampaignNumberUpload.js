/**
 * Created by Rajinda on 6/26/2015.
 */

var List = require("collections/list");

function UploadContacts(contacts,tenantId,companyId,callBack){

}

function UploadContactsToCampaign(contacts,campaignId,tenantId,companyId,callBack){

}

function UploadContactsToCampaignWithSchedule(contacts,campaignId,CamScheduleId,tenantId,companyId,callBack){

}

function EditContacts(contacts,campaignId,tenantId,companyId,callBack){

}

function DeleteContacts(contacts,tenantId,companyId,callBack){

}

function DeleteContacts(contacts,campaignId,tenantId,companyId,callBack){

}

function AssingScheduleToCampaign(campaignId,CamScheduleId,tenantId,companyId,callBack){

}

function GetAllContact(tenantId,companyId,callBack){

}

function GetAllContactByCampaignId(campaignId,tenantId,companyId,callBack){

}


module.exports.UploadContacts = UploadContacts;
module.exports.UploadContactsToCampaign = UploadContactsToCampaign;
module.exports.UploadContactsToCampaignWithSchedule = UploadContactsToCampaignWithSchedule;
module.exports.EditContacts = EditContacts;
module.exports.DeleteContacts = DeleteContacts;
module.exports.AssingScheduleToCampaign = AssingScheduleToCampaign;
module.exports.GetAllContact = GetAllContact;
module.exports.GetAllContactByCampaignId = GetAllContactByCampaignId;