/**
 * Created by Rajinda on 6/26/2015.
 */

function StartCampaign(campaignId,dialerId,callback){

}

function StopCampaign(campaignId,callback){

}

function PauseCampaign(campaignId,callback){

}

function ResumeCampaign(campaignId,callback){

}

function EndCampaign(campaignId,callback){

}

/*
 Dialer should call this method every 5 min
 */
function UpdateOperationState(campaignId,dialerId,callback){

}


module.exports.StartCampaign = StartCampaign;
module.exports.StopCampaign = StopCampaign;
module.exports.PauseCampaign = PauseCampaign;
module.exports.ResumeCampaign = ResumeCampaign;
module.exports.EndCampaign = EndCampaign;
module.exports.UpdateOperationState = UpdateOperationState;
