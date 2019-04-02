/**
 * Created by Pawan on 6/1/2015.
 */

var restify = require('restify');
var cors = require('cors');
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');

var config = require('config');

var port = config.Host.port || 3000;
var version = config.Host.version;
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var campaignHandler = require('./CampaignHandler');
var campaignOperations = require('./CampaignOperations');
var campaignConfigurations = require('./CampaignConfigurations');
var campaignNumberUpload = require('./CampaignNumberUpload');
var campaignSchedule = require('./CampaignSchedule');
var campaignDialoutInfo = require('./CampaignDialoutInfo');
var campaignCallBackHandler = require('./CampaignCallBackHandler');
var campaignReportHandler = require('./CampaignReportHandler');
var campaignDncInfo = require('./CampaignDncInfo');
var scheduledCallback = require('./ScheduledCallback');


//-------------------------  Restify Server ------------------------- \\
var RestServer = restify.createServer({
    name: "campaignmanager",
    version: '1.0.0'
});

restify.CORS.ALLOW_HEADERS.push('authorization');
RestServer.use(restify.CORS());
RestServer.use(restify.fullResponse());

//Server listen
RestServer.listen(port, function () {
    console.log('%s listening at %s', RestServer.name, RestServer.url);


});

//Enable request body parsing(access)
RestServer.use(restify.bodyParser());
RestServer.use(restify.acceptParser(RestServer.acceptable));
RestServer.use(restify.queryParser());
RestServer.use(cors());

// ---------------- Security -------------------------- \\
var jwt = require('restify-jwt');
var secret = require('dvp-common/Authentication/Secret.js');
var authorization = require('dvp-common/Authentication/Authorization.js');
RestServer.use(jwt({secret: secret.Secret}));
// ---------------- Security -------------------------- \\


//-------------------------  Restify Server ------------------------- \\

//-------------------------  CampaignHandler ------------------------- \\
//-------------------------  CampaignHandler ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign', authorization({
    resource: "campaign",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager.CreateCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");

        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignHandler.CreateCampaign(cmp.CampaignName, cmp.CampaignMode, cmp.CampaignChannel, cmp.DialoutMechanism, tenantId, companyId, cmp.Class, cmp.Type, cmp.Category, cmp.Extensions, res);

    }
    catch (ex) {

        logger.error('[DVP-campaignmanager.CreateCampaign] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-campaignmanager.CreateCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId', authorization({
    resource: "campaign",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager.EditCampaign] - [HTTP]  - Request received -  Data - %s %s', JSON.stringify(req.params), JSON.stringify(req.body));

        var cmp = req.body;
        var campaignId = req.params.CampaignId;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        campaignHandler.EditCampaign(campaignId, cmp.CampaignName, cmp.CampaignMode, cmp.CampaignChannel, cmp.DialoutMechanism, tenantId, companyId, cmp.Class, cmp.Type, cmp.Category, cmp.Extensions, res)

    }
    catch (ex) {
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-campaignmanager.EditCampaign] - [HTTP]  - Exception occurred -  Data - %s ', jsonString, ex);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/State/:Command', authorization({
    resource: "campaign",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager] - [HTTP]  - Request received -  Data - [%s]- %s ', req.params.CampaignId, JSON.stringify(req.body));

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        switch (req.params.Command) {
            case "start":
                campaignHandler.StartCampaign(req.params.CampaignId, tenantId, companyId, res)
                break;
            default :

                break;
        }


    }
    catch (ex) {
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-campaignmanager.StartCampaign] - [HTTP]  - Exception occurred -  Data - %s ', jsonString, ex);
        res.end(jsonString);
    }
    return next();
});

RestServer.del('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId', authorization({
    resource: "campaign",
    action: "delete"
}), function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager.DeleteCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmpId = req.params.CampaignId;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        campaignHandler.DeleteCampaign(cmpId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-campaignmanager.DeleteCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaigns/:Count', authorization({
    resource: "campaign",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager.GetAllCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        if (req.params.Count > 0) {
            var count = req.params.Count;
            campaignHandler.GetAllCampaignPage(tenantId, companyId, count, res);
        }
        else {
            campaignHandler.GetAllCampaign(tenantId, companyId, res);
        }

    }
    catch (ex) {


        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-campaignmanager.GetAllCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId', authorization({
    resource: "campaign",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager.GetAllCampaignByCampaignId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmpId = req.params.CampaignId;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignHandler.GetAllCampaignByCampaignId(tenantId, companyId, cmpId, res);

    }
    catch (ex) {


        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-campaignmanager.GetAllCampaignByCampaignId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaigns/State/:Command/:Count', authorization({
    resource: "campaign",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager.Campaign/State] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;
        var count = req.params.Count;

        switch (req.params.Command) {
            case "offline":
                campaignHandler.GetOfflineCampaign(tenantId, companyId, res);
                break;
            /*case "ongoing":
             campaignHandler.GetOngoingCampaign(tenantId, companyId, res);
             break;*/
            case "Pending":
                campaignHandler.GetPendingCampaign(tenantId, companyId, "start", count, res);
                break;
            case "create":
                campaignHandler.GetPendingCampaign(tenantId, companyId, "create", count, res);
                break;
            case "ongoing":
                campaignHandler.GetPendingCampaign(tenantId, companyId, "ongoing", count, res);
                break;
            default :
                campaignHandler.GetAllCampaignByCampaignState(tenantId, companyId, req.params.Command, res);
                break;
        }


    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-campaignmanager.GetOfflineCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/AdditionalData', authorization({
    resource: "campaign",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager.AddAdditionalData] - [HTTP]  - Request received -  Data - %s -%s', JSON.stringify(req.body), JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmp = req.body;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignHandler.AddAdditionalData(cmp.Class, cmp.Type, cmp.Category, tenantId, companyId, cmp.AdditionalData, req.params.CampaignId, res);

    }
    catch (ex) {

        logger.error('[DVP-campaignmanager.CreateCampaign] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-campaignmanager.CreateCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/AdditionalData/:AdditionalDataId', authorization({
    resource: "campaign",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager.EditAdditionalData] - [HTTP]  - Request received -  Data - %s -%s', JSON.stringify(req.body), JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmp = req.body;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignHandler.EditAdditionalData(req.params.AdditionalDataId, cmp.DataClass, cmp.DataType, cmp.DataCategory, tenantId, companyId, cmp.AdditionalData, req.params.CampaignId, res);

    }
    catch (ex) {

        logger.error('[DVP-campaignmanager.EditAdditionalData] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-campaignmanager.EditAdditionalData] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.del('/DVP/API/' + version + '/CampaignManager/Campaign/AdditionalData/:AdditionalDataId', authorization({
    resource: "campaign",
    action: "delete"
}), function (req, res, next) {
    try {
        logger.info('[DVP-campaignmanager.DeleteAdditionalDataByID] - [HTTP]  - Request received -  Data - %s -%s', JSON.stringify(req.body), JSON.stringify(req.params));
        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cam = req.params;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignHandler.DeleteAdditionalDataByID(cam.AdditionalDataId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-campaignmanager.DeleteAdditionalDataByID] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/AdditionalData/:AdditionalDataId', authorization({
    resource: "campaign",
    action: "read"
}), function (req, res, next) {
    try {
        logger.info('[DVP-campaignmanager.GetAdditionalData] - [HTTP]  - Request received -  Data - %s -%s', JSON.stringify(req.body), JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cam = req.params;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignHandler.GetAdditionalData(cam.AdditionalDataId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-campaignmanager.GetAdditionalData] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});



RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/AdditionalData', authorization({
    resource: "campaign",
    action: "read"
}), function (req, res, next) {
    try {
        logger.info('[DVP-campaignmanager.GetAdditionalDataByCampaignId] - [HTTP]  - Request received -  Data - %s -%s', JSON.stringify(req.body), JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmp = req.params;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignHandler.GetAdditionalDataByCampaignId(cmp.CampaignId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-campaignmanager.GetAdditionalDataByCampaignId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/AdditionalData/:DataClass/:DataType/:DataCategory', authorization({
    resource: "campaign",
    action: "read"
}), function (req, res, next) {
    try {
        logger.info('[DVP-campaignmanager.GetAdditionalDataByClassTypeCategory] - [HTTP]  - Request received -  Data - %s -%s', JSON.stringify(req.body), JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmp = req.params;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignHandler.GetAdditionalDataByClassTypeCategory(cmp.CampaignId, tenantId, companyId, cmp.DataClass, cmp.DataType, cmp.DataCategory, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-campaignmanager.GetAdditionalDataByClassTypeCategory] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

//------------------------- End-CampaignHandler ------------------------- \\

//------------------------- CampaignOperations ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Operations/:DialerId', authorization({
    resource: "Operations",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignOperations.StartCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        var cmp = req.params;
        campaignOperations.StartCampaign(cmp.CampaignId, cmp.DialerId, tenantId, companyId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignOperations.StartCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Operations/:Command', authorization({
    resource: "Operations",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignOperations] - [HTTP]  - Request received -  Data - %s - %s', JSON.stringify(req.body), JSON.stringify(req.params));
        var camId = req.params.CampaignId;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");


        switch (req.params.Command) {
            case "stop":
                campaignOperations.StopCampaign(camId,req, res);
                break;
            case "pause":
                campaignOperations.PauseCampaign(camId,req, res);
                break;
            case "resume":
                campaignOperations.ResumeCampaign(camId,req, res);
                break;
            case "end":
                campaignOperations.EndCampaign(camId,req, res);
                break;
            default :
                var jsonString = messageFormatter.FormatMessage(new Error("invalid Command"), "EXCEPTION", false, undefined);
                logger.error('[DVP-CampaignOperations.StopCampaign] - Request response : %s ', jsonString);
                res.end(jsonString);
                break;
        }


    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignOperations.StopCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

//change put method to get. dialer req
RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Operations/State/:DialerId/:CampaignState', authorization({
    resource: "Operations",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignOperations.UpdateOperationState] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.param));
        var campaignId = req.params.CampaignId;
        var dialerId = req.params.DialerId;
        var campaignState = req.params.CampaignState;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignOperations.UpdateOperationState(campaignId, dialerId, campaignState, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignOperations.UpdateOperationState] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaigns/Operations/State/:Command', authorization({
    resource: "Operations",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager.GetPendingCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        switch (req.params.Command) {
            case "Pending":
                campaignOperations.GetPendingCampaign(tenantId, companyId, res);
                /* if (req.body.DialerId) {
                 var dialerId = req.body.DialerId;
                 campaignOperations.GetPendingCampaignByDialerId(tenantId, companyId, dialerId, res);
                 }
                 else {
                 campaignOperations.GetPendingCampaign(tenantId, companyId, res);
                 }*/
                break;
            case "Ongoing":
                campaignOperations.GetOngoingCampaign(tenantId, companyId, res);
                break;
            default :
            {
                var jsonString = messageFormatter.FormatMessage(new Error("Invalid Command"), "EXCEPTION", false, undefined);
                res.end(jsonString);
            }
        }


    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-campaignmanager.GetPendingCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});


//------------------------- End-CampaignOperations ------------------------- \\

//------------------------- CampaignConfigurations ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Configuration', authorization({
    resource: "campaignconfiguration",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignConfigurations.CreateConfiguration] - [HTTP]  - Request received -  Data - %s %s ', JSON.stringify(req.params), JSON.stringify(req.body));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmp = req.body;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        campaignConfigurations.CreateConfiguration(req.params.CampaignId, cmp.ChannelConcurrency, cmp.AllowCallBack, tenantId, companyId, true, cmp.Caller, cmp.StartDate, cmp.EndDate, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignConfigurations.CreateConfiguration] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Configuration/:ConfigureId', authorization({
    resource: "campaignconfiguration",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignConfigurations.EditConfiguration] - [HTTP]  - Request received -  Data - %s %s ', JSON.stringify(req.params), JSON.stringify(req.body));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmp = req.body;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        campaignConfigurations.EditConfiguration(req.params.ConfigureId, req.params.CampaignId, cmp.ChannelConcurrency, cmp.AllowCallBack, tenantId, companyId, true, cmp.Caller, cmp.StartDate, cmp.EndDate, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignConfigurations.EditConfiguration] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Configuration/:ConfigureId/StartDate/:startDate/EndDate/:endDate', authorization({
    resource: "campaignconfiguration",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignConfigurations.SetCampaignStartDate] - [HTTP]  - Request received -  Data - %s %s ', JSON.stringify(req.params), JSON.stringify(req.body));
        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmp = req.body;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        campaignConfigurations.SetCampaignStartDate(tenantId, companyId,req.params.ConfigureId, req.params.CampaignId, req.params.startDate, req.params.endDate, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignConfigurations.SetCampaignStartDate] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.del('/DVP/API/' + version + '/CampaignManager/Campaign/Configuration/:ConfigureId', authorization({
    resource: "campaignconfiguration",
    action: "delete"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignConfigurations.DeleteConfiguration] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        var cmpId = req.params.ConfigureId;
        campaignConfigurations.DeleteConfiguration(cmpId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignConfigurations.DeleteConfiguration] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Configuration/Configs', authorization({
    resource: "campaignconfiguration",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignConfigurations.GetAllConfiguration] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignConfigurations.GetAllConfiguration(tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignConfigurations.GetAllConfiguration] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Configuration/Config/:ConfigureId', authorization({
    resource: "campaignconfiguration",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignConfigurations.GetConfiguration] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        var configureId = req.params.ConfigureId;
        campaignConfigurations.GetConfiguration(configureId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignConfigurations.GetConfiguration] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Configuration/:ConfigureId/all', authorization({
    resource: "campaignconfiguration",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignConfigurations.GetAllConfigurationSetting] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        var configureId = req.params.ConfigureId;
        campaignConfigurations.GetAllConfigurationSetting(configureId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignConfigurations.GetAllConfigurationSetting] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Configurations', authorization({
    resource: "campaignconfiguration",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignConfigurations.GetAllConfigurationSettingByCampaignId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        var campaignId = req.params.CampaignId;
        campaignConfigurations.GetAllConfigurationSettingByCampaignId(campaignId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignConfigurations.GetAllConfigurationSettingByCampaignId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/Configuration/:ConfigureId/Callback', authorization({
    resource: "campaignconfiguration",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CreateCallbackConfiguration] - [HTTP]  - Request received -  Data - %s -%s', JSON.stringify(req.body), JSON.stringify(req.params));

        var cmp = req.body;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignConfigurations.CreateCallbackConfiguration(parseInt(req.params.ConfigureId), cmp.MaxCallBackCount, cmp.ReasonId, cmp.CallbackInterval, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CreateCallbackConfiguration] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/Configuration/:ConfigureId/Callback/:CallBackConfId', authorization({
    resource: "campaignconfiguration",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-EditCallbackConfiguration] - [HTTP]  - Request received -  Data - %s -%s', JSON.stringify(req.body), JSON.stringify(req.params));

        var cmp = req.body;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        campaignConfigurations.EditCallbackConfiguration(req.params.CallBackConfId, req.params.ConfigureId, cmp.MaxCallBackCount, cmp.ReasonId, cmp.CallbackInterval, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-EditCallbackConfiguration] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Configuration/Callback', authorization({
    resource: "campaignconfiguration",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-GetAllCallbackConfigurations] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignConfigurations.GetAllCallbackConfigurations(tenantId, companyId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-GetAllCallbackConfigurations] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Configuration/Callback/:CallBackConfId', authorization({
    resource: "campaignconfiguration",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-GetAllCallbackConfigurations] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
        var callBackConfId = req.params.CallBackConfId;

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignConfigurations.GetCallbackConfiguration(callBackConfId, tenantId, companyId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-GetAllCallbackConfigurations] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.del('/DVP/API/' + version + '/CampaignManager/Campaign/Configuration/Callback/:CallBackConfId', authorization({
    resource: "campaignconfiguration",
    action: "delete"
}), function (req, res, next) {
    try {

        logger.info('[DVP-GetAllCallbackConfigurations] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
        var callBackConfId = parseInt(req.params.CallBackConfId);
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignConfigurations.DeleteCallbackConfigurationByID(callBackConfId, tenantId, companyId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-GetAllCallbackConfigurations] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Configuration/:configID/Callbacks', authorization({
    resource: "campaignconfiguration",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-GetCallbackConfigurationByConfigID] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
        var configID = parseInt(req.params.configID);
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignConfigurations.GetCallbackConfigurationByConfigID(configID, tenantId, companyId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-GetCallbackConfigurationByConfigID] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});


//GetCallbackConfigurationByCampaignID


RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/Configuration/Reason', authorization({
    resource: "campaigncallbackreason",
    action: "write"
}), function (req, res, next) {
    try {
        logger.info('[DVP-CreateCallBackReason] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignConfigurations.CreateCallBackReason(cmp.Reason, cmp.HangupCause, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CreateCallBackReason] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.del('/DVP/API/' + version + '/CampaignManager/Campaign/Configuration/Reason/:ReasonId', authorization({
    resource: "campaigncallbackreason",
    action: "delete"
}), function (req, res, next) {
    try {

        logger.info('[DVP-DeleteCallbackInfo] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));

        var cmp = req.params;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignConfigurations.DeleteCallbackInfo(cmp.ReasonId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-DeleteCallbackInfo] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/Configuration/Reason/:ReasonId', authorization({
    resource: "campaigncallbackreason",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-EditCallBackReason] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));

        var cmp = req.body;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignConfigurations.EditCallBackReason(req.params.ReasonId, cmp.Reason, cmp.HangupCause, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-EditCallBackReason] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Configuration/callback/Reasons', authorization({
    resource: "campaigncallbackreason",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-GetAllCallBackReasons] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignConfigurations.GetAllCallBackReasons(tenantId, companyId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-GetAllCallBackReasons] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Configuration/Reason/:ReasonId', authorization({
    resource: "campaigncallbackreason",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-GetCallBackReason] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
        var reasonId = req.params.ReasonId;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignConfigurations.GetCallBackReason(tenantId, companyId, reasonId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-GetCallBackReason] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});


//------------------------- End-CampaignConfigurations ------------------------- \\

//------------------------- CampaignNumberUpload ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignManager/CampaignNumbers', authorization({
    resource: "campaign",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.UploadContacts] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
        var cmp = req.body;

        var extraData = "";
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        if (cmp.ExtraData) {
            extraData = cmp.ExtraData;
        }

        if (cmp.CampaignId) {
            if (cmp.CamScheduleId) {
                campaignNumberUpload.UploadContactsToCampaignWithSchedule(cmp.Contacts, cmp.CampaignId, cmp.CamScheduleId,cmp.ScheduleName, tenantId, companyId, cmp.CategoryID, extraData, res);
            }
            else {
                campaignNumberUpload.UploadContactsToCampaign(cmp.Contacts, cmp.CampaignId, tenantId, companyId, cmp.CategoryID, extraData, res);
            }
        }
        else {
            campaignNumberUpload.UploadContacts(cmp.Contacts, tenantId, companyId, cmp.CategoryID, res);
        }
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.UploadContacts] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Numbers/Existing', authorization({
    resource: "campaignnumbers",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.AssigningScheduleToCampaign] - [HTTP]  - Request received -  Data - %s -%s ', JSON.stringify(req.body), JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        var cmp = req.body;


        if (cmp.ContactIds) {
            campaignNumberUpload.AddExistingContactsToCampaign(cmp.ContactIds, req.params.CampaignId, res);
        }
        else if (cmp.CamScheduleIds) {
            campaignSchedule.AssigningScheduleToCampaign(req.params.CampaignId, cmp.CamScheduleIds, tenantId, companyId, res);
        }
        else {
            var jsonString = messageFormatter.FormatMessage(new Error("Invalid Operation."), "EXCEPTION", false, undefined);
            logger.error('[DVP-CampaignNumberUpload.] - Request response : %s ', jsonString);
            res.end(jsonString);
        }

    }
    catch (ex) {
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.AssigningScheduleToCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/' + version + '/CampaignManager/CampaignNumbers/Contact/Category', authorization({
    resource: "campaignnumbers",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.CreateContactCategory] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignNumberUpload.CreateContactCategory(cmp.CategoryName, tenantId, companyId, res);

    }
    catch (ex) {
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.CreateContactCategory] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/' + version + '/CampaignManager/CampaignCategory', authorization({
    resource: "campaignnumbers",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.CreateContactCategory] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignNumberUpload.CreateContactCategory(cmp.CategoryName, tenantId, companyId, res);

    }
    catch (ex) {
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.CreateContactCategory] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Number', authorization({
    resource: "campaignnumbers",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.EditContact] - [HTTP]  - Request received -  Data - %s -%s ', JSON.stringify(req.body), JSON.stringify(req.params));

        var cmp = req.body;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignNumberUpload.EditContact(cmp.Contact, req.params.CampaignId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.EditContact] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Numbers', authorization({
    resource: "campaignnumbers",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.EditContacts] - [HTTP]  - Request received -  Data - %s -%s ', JSON.stringify(req.body), JSON.stringify(req.params));

        var cmp = req.body;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignNumberUpload.EditContacts(cmp.Contacts, req.params.CampaignId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.EditContacts] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/Numbers/Category/:CategoryID', authorization({
    resource: "campaignnumbers",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.EditContactCategory] - [HTTP]  - Request received -  Data - %s - %s', JSON.stringify(req.body), JSON.stringify(req.params));

        var cmp = req.body;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignNumberUpload.EditContactCategory(req.params.CategoryID, cmp.CategoryName, tenantId, companyId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.EditContactCategory] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.del('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Numbers/', authorization({
    resource: "campaignnumbers",
    action: "delete"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.DeleteContacts] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var contacts = req.body.Contacts;
        var campaignId = req.params.CampaignId;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignNumberUpload.DeleteContacts(contacts, campaignId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.DeleteContacts] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Numbers/all', authorization({
    resource: "campaignnumbers",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.GetAllContact] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignNumberUpload.GetAllContact(tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.GetAllContact] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Numbers', authorization({
    resource: "campaignnumbers",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var campaignId = req.params.CampaignId;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignNumberUpload.GetAllContactByCampaignId(campaignId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Numbers/Category/:CategoryID', authorization({
    resource: "campaignnumbers",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.GetAllContactByCategoryID] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var categoryId = req.params.CategoryID;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        campaignNumberUpload.GetAllContactByCategoryID(categoryId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.GetAllContactByCategoryID] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Numbers/:ScheduleId/:RowCount/:PageNo', authorization({
    resource: "campaignnumbers",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var campaignId = req.params.CampaignId;
        var scheduleId = req.params.ScheduleId;
        var rowCount = req.params.RowCount;
        var pageNo = req.params.PageNo;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        campaignNumberUpload.GetAllContactByCampaignIdScheduleId(campaignId, scheduleId, rowCount, pageNo, tenantId, companyId, res)

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Numbers/:ScheduleId', authorization({
    resource: "campaignnumbers",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleIdWithoutPaging] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var campaignId = req.params.CampaignId;
        var scheduleId = req.params.ScheduleId;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        campaignNumberUpload.GetAllContactByCampaignIdScheduleIdWithoutPaging(campaignId, scheduleId, tenantId, companyId, res)

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/CampaignCategorys', authorization({
    resource: "campaignnumbers",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.GetContactCategory] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignNumberUpload.GetContactCategory(tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.GetContactCategory] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Category/:CategoryID/map', authorization({
    resource: "campaignnumbers",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('MapNumberToCampaign - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");

        campaignNumberUpload.MapNumberToCampaign(req, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('MapNumberToCampaign - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Schedule/:CamScheduleId/map', authorization({
    resource: "campaignnumbers",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('MapScheduleToCampaign - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");

        campaignNumberUpload.MapScheduleToCampaign(req, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('MapScheduleToCampaign - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/' + version + '/CampaignManager/AbandonedCampaign/:CampaignId/Schedule/:CamScheduleId', authorization({
    resource: "campaignnumbers",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('AbandonedCampaign - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");

        campaignNumberUpload.AddAbandonedCallToCampaign(req, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('AbandonedCampaign - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Category/:CategoryID/Schedule/:CamScheduleId/map', authorization({
    resource: "campaignnumbers",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('MapNumberAndScheduleToCampaign - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");

        campaignNumberUpload.MapNumberAndScheduleToCampaign(req, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('MapNumberAndScheduleToCampaign - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Number/:contactId/:PageNo/:RowCount', authorization({
    resource: "campaignnumbers",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.GetExtraDataByContactId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var campaignId = req.params.CampaignId;
        var contactId = req.params.ScheduleId;
        var rowCount = req.params.RowCount;
        var pageNo = req.params.PageNo;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        campaignNumberUpload.GetExtraDataByContactId(campaignId, contactId, rowCount, pageNo, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.GetExtraDataByContactId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/NumberCategory', authorization({
    resource: "campaignnumbers",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('GetAssignedCategory');
        var campaignId = req.params.CampaignId;
        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignNumberUpload.GetAssignedCategory(campaignId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[GetAssignedCategory] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/NumbersByOffset/:ScheduleId/:RowCount/:Offset', authorization({
    resource: "campaignnumbers",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var campaignId = req.params.CampaignId;
        var scheduleId = req.params.ScheduleId;
        var rowCount = req.params.RowCount;
        var offset = req.params.Offset;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        campaignNumberUpload.GetAllContactByCampaignIdScheduleIdOffset(campaignId, scheduleId, rowCount, offset, tenantId, companyId, res)

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});
//------------------------- End-CampaignNumberUpload ------------------------- \\

//------------------------- CampaignSchedule ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Schedule', authorization({
    resource: "campaignnumbers",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.CreateSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmp = req.body;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignSchedule.CreateSchedule(req.params.CampaignId, cmp.ScheduleId, cmp.ScheduleType, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignSchedule.CreateSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/Schedule/:CamScheduleId', authorization({
    resource: "CampaignSchedule",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.EditSchedule] - [HTTP]  - Request received -  Data - %s %s', JSON.stringify(req.params), JSON.stringify(req.body));

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmp = req.body;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        campaignSchedule.EditSchedule(req.params.CamScheduleId, cmp.CampaignId, cmp.ScheduleId, cmp.ScheduleType, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignSchedule.EditSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.del('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Schedule/:CamScheduleId', authorization({
    resource: "campaign",
    action: "delete"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.DeleteSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var camScheduleId = req.params.CamScheduleId;
        var campaignId = req.params.CampaignId;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignSchedule.DeleteSchedule(camScheduleId,campaignId, tenantId, companyId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignSchedule.DeleteSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaigns/Schedules/all', authorization({
    resource: "CampaignSchedule",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.GetAllSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignSchedule.GetAllSchedule(tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignSchedule.GetAllSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Schedule/:CamScheduleId', authorization({
    resource: "CampaignSchedule",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.GetSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
        var camScheduleId = req.params.CamScheduleId;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignSchedule.GetSchedule(camScheduleId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignSchedule.GetSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Schedule', authorization({
    resource: "CampaignSchedule",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.GetScheduleByCampaignId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
        var campaignId = req.params.CampaignId;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignSchedule.GetScheduleByCampaignId(campaignId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignSchedule.GetScheduleByCampaignId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Schedule/Assignable', authorization({
    resource: "CampaignSchedule",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.GetScheduleByCampaignId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
        var campaignId = req.params.CampaignId;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignSchedule.GetAssignableScheduleByCampaignId(campaignId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignSchedule.GetScheduleByCampaignId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Schedule/ScheduleType/:Type', authorization({
    resource: "CampaignSchedule",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.GetScheduleByScheduleType] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
        var scheduleType = req.params.Type;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignSchedule.GetScheduleByScheduleType(scheduleType, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignSchedule.GetScheduleByScheduleType] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Schedule/:ScheduleType', authorization({
    resource: "CampaignSchedule",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.GetScheduleByCampaignIdScheduleType] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
        var campaignId = req.params.CampaignId;
        var scheduleType = req.params.ScheduleType;
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        campaignSchedule.GetScheduleByCampaignIdScheduleType(campaignId, scheduleType, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignSchedule.GetScheduleByCampaignIdScheduleType] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

//------------------------- End-CampaignSchedule ------------------------- \\

//------------------------- End-DialoutInfo ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/Session', authorization({
    resource: "CampaignSession",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-DialoutInfo.CreateDialoutInfo] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmp = req.body;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignDialoutInfo.CreateDialoutInfo(cmp.CampaignId, cmp.DialerId, cmp.DialerStatus, cmp.Dialtime, cmp.Reason, cmp.SessionId, cmp.TryCount, tenantId, companyId, cmp.CampaignName, cmp.Number, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-DialoutInfo.CreateSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/Session/:DialoutId', authorization({
    resource: "CampaignSession",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-DialoutInfo.EditDialoutInfo] - [HTTP]  - Request received -  Data - %s %s ', JSON.stringify(req.params), JSON.stringify(req.body));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmp = req.body;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignDialoutInfo.EditDialoutInfo(req.params.DialoutId, cmp.CampaignId, cmp.DialerId, cmp.DialerStatus, cmp.Dialtime, cmp.Reason, cmp.SessionId, cmp.TryCount, tenantId, companyId, cmp.CampaignName, cmp.Number, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-DialoutInfo.EditDialoutInfo] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Session/all', authorization({
    resource: "CampaignSession",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-DialoutInfo.GetDialoutInfo] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignDialoutInfo.GetDialoutInfo(tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-DialoutInfo.GetAllSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Session/:DialoutId', authorization({
    resource: "CampaignSession",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-DialoutInfo.GetSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var dialoutId = req.params.DialoutId;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignDialoutInfo.GetDialoutInfoByDialoutId(dialoutId, tenantId, companyId, res)
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-DialoutInfo.GetDialoutInfoByDialoutId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

//------------------------- End-DialoutInfo ------------------------- \\

//------------------------- CallBack ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Callback', authorization({
    resource: "CampaignCallback",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CreateCallbackInfo] - [HTTP]  - Request received -  Data - %s %s ', JSON.stringify(req.params), JSON.stringify(req.body));

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmp = req.body;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignCallBackHandler.CreateCallbackInfo(req, cmp, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CreateCallbackInfo] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Callback/:CallBackId', authorization({
    resource: "CampaignCallback",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-EditCallbackInfo] - [HTTP]  - Request received -  Data - %s %s', JSON.stringify(req.params), JSON.stringify(req.body));

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmp = req.body;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        campaignCallBackHandler.EditCallbackInfo(req.params.CallBackId, req.params.CampaignId, cmp.ContactId, cmp.DialoutTime, cmp.CallBackCount, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-EditCallbackInfo] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.del('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Callback/:CallBackId', authorization({
    resource: "CampaignCallback",
    action: "delete"
}), function (req, res, next) {
    try {

        logger.info('[DVP-DeleteCallbackInfo] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var callBackId = req.params.CallBackId;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;


        campaignConfigurations.DeleteCallbackInfo(callBackId, tenantId, companyId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-DeleteCallbackInfo] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Callback', authorization({
    resource: "CampaignCallback",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-GetAllCallbackInfos] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));

         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignCallBackHandler.GetAllCallbackInfos(tenantId, companyId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-GetAllCallbackInfos] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Callback/:CallBackId', authorization({
    resource: "CampaignCallback",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-GetCallbackInfo] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var callBackId = req.params.CallBackId;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignCallBackHandler.GetCallbackInfo(callBackId, tenantId, companyId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-GetCallbackInfo] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Callbacks/Info', authorization({
    resource: "CampaignCallback",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-GetCallbackInfosByCampaignId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var campaignId = req.params.CampaignId;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignCallBackHandler.GetCallbackInfosByCampaignId(campaignId, tenantId, companyId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-GetCallbackInfosByCampaignId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Callback/:CallbackClass/:CallbackType/:CallbackCategory', authorization({
    resource: "CampaignCallback",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-GetCallbackInfosByClassTypeCategory] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
         if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmp = req.params;
        var tenantId = req.user.tenant;
        var companyId = req.user.company;

        campaignCallBackHandler.GetCallbackInfosByClassTypeCategory(tenantId, companyId, cmp.CallbackClass, cmp.CallbackType, cmp.CallbackCategory, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-GetCallbackInfosByClassTypeCategory] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

//------------------------- End-CallBack ------------------------- \\


//------------------------- CampaignDncList ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignManager/Dnc', authorization({
    resource: "campaigndnc",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignDncInfo.CreateDncRecord] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
        var dnc = req.body;

        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = parseInt(req.user.tenant);
        var companyId = parseInt(req.user.company);


        campaignDncInfo.CreateDncRecord(dnc.ContactIds, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignDncInfo.CreateDncRecord] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/' + version + '/CampaignManager/Dnc/Delete', authorization({
    resource: "campaigndnc",
    action: "delete"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignDncInfo.DeleteDncRecord] - [HTTP]  - Request received -  Data - %s ', req.body);

        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = parseInt(req.user.tenant);
        var companyId = parseInt(req.user.company);

        var dncList = [];
        if(req.body && req.body.ContactIds){
            dncList = req.body.ContactIds;
        }


        campaignDncInfo.DeleteDncRecord(dncList, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignDncInfo.DeleteDncRecord] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Dnc', authorization({
    resource: "campaigndnc",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-CampaignDncInfo.GetDncList] - [HTTP]  - Request received');

        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = parseInt(req.user.tenant);
        var companyId = parseInt(req.user.company);


        campaignDncInfo.GetDncList(tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignDncInfo.GetDncList] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});


//------------------------- EndCampaignDncList ------------------------- \\



// ------------------------- Campaign Reports------------------------- \\

RestServer.get('/DVP/API/' + version + '/CampaignManager/Report/summery', authorization({
    resource: "campaign",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('CampaignSummeryReport');

        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");

        campaignReportHandler.CampaignSummeryReport(req,res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('CampaignSummeryReport : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Report/disposition', authorization({
    resource: "campaign",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('CampaignSummeryReport');

        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");

        campaignReportHandler.CampaignDispositionReport(req,res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('CampaignSummeryReport : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Report/summery/count', authorization({
    resource: "campaign",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('CampaignSummeryReport');

        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");

        campaignReportHandler.CampaignSummeryReportCount(req,res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('CampaignSummeryReport : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Report/disposition/count', authorization({
    resource: "campaign",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('CampaignSummeryReport');

        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");

        campaignReportHandler.CampaignDispositionReportCount(req,res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('CampaignSummeryReport : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Report/Callback/count', authorization({
    resource: "campaign",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('CampaignSummeryReport');

        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");

        campaignReportHandler.CampaignCallbackReportCount(req,res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('CampaignCallbackReport : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Report/Callback', authorization({
    resource: "campaign",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('CampaignSummeryReport');

        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");

        campaignReportHandler.CampaignCallbackReport(req,res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('CampaignCallbackReport : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Report/Attempt', authorization({
    resource: "campaign",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('CampaignSummeryReport');

        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");

        campaignReportHandler.CampaignAttemptReport(req,res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('CampaignAttemptReport : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Report/Attempt/count', authorization({
    resource: "campaign",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('CampaignSummeryReport');

        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");

        campaignReportHandler.CampaignAttemptReportCount(req,res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('CampaignAttemptReport : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

//------------------------- End Campaign Reports ------------------------- \\



//------------------------- ScheduledCallback ------------------------- \\

RestServer.post('/DVP/API/:version/CampaignManager/ScheduledCallback', authorization({
    resource: "CampaignSession",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-DialoutInfo.CreateScheduledCallback] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = parseInt(req.user.tenant);
        var companyId = parseInt(req.user.company);

        scheduledCallback.CreateScheduledCallbackInfo(tenantId, companyId, req.body, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-DialoutInfo.CreateScheduledCallback] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/:version/CampaignManager/ScheduledCallback/:sessionId/Dispatched/:time', authorization({
    resource: "CampaignSession",
    action: "write"
}), function (req, res, next) {
    try {

        logger.info('[DVP-DialoutInfo.EditScheduledCallbackInfo] - [HTTP]  - Request received -  Data - %s %s ', JSON.stringify(req.params), JSON.stringify(req.body));
        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var cmp = req.body;
        var tenantId = parseInt(req.user.tenant);
        var companyId = parseInt(req.user.company);

        scheduledCallback.EditScheduledCallbackInfo(tenantId, companyId, req.params.sessionId, req.params.time, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-DialoutInfo.EditScheduledCallbackInfo] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/:version/CampaignManager/ScheduledCallback/all', authorization({
    resource: "CampaignSession",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-DialoutInfo.GetAllScheduledCallbackInfo] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = parseInt(req.user.tenant);
        var companyId = parseInt(req.user.company);

        scheduledCallback.GetAllScheduledCallbackInfo(tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-DialoutInfo.GetAllScheduledCallbackInfo] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/:version/CampaignManager/ScheduledCallback/:class/:type/:category', authorization({
    resource: "CampaignSession",
    action: "read"
}), function (req, res, next) {
    try {

        logger.info('[DVP-DialoutInfo.GetScheduledCallbackInfoByClassTypeCategory] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
        if (!req.user ||!req.user.tenant || !req.user.company)
            throw new Error("invalid tenant or company.");
        var tenantId = parseInt(req.user.tenant);
        var companyId = parseInt(req.user.company);

        scheduledCallback.GetScheduledCallbackInfoByClassTypeCategory(tenantId, companyId, req.params.class, req.params.type, req.params.category, res)
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-DialoutInfo.GetScheduledCallbackInfoByClassTypeCategory] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

//------------------------- End-ScheduledCallback ------------------------- \\





//------------------------- Crossdomain ------------------------- \\

function Crossdomain(req, res, next) {


    var xml = '<?xml version=""1.0""?><!DOCTYPE cross-domain-policy SYSTEM ""http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd""> <cross-domain-policy>    <allow-access-from domain=""*"" />        </cross-domain-policy>';

    /*var xml='<?xml version="1.0"?>\n';
     xml+= '<!DOCTYPE cross-domain-policy SYSTEM "/xml/dtds/cross-domain-policy.dtd">\n';
     xml+='';
     xml+=' \n';
     xml+='\n';
     xml+='';*/
    req.setEncoding('utf8');
    res.end(xml);

}

function Clientaccesspolicy(req, res, next) {


    var xml = '<?xml version="1.0" encoding="utf-8" ?>       <access-policy>        <cross-domain-access>        <policy>        <allow-from http-request-headers="*" http-methods="*">        <domain uri="*"/>        </allow-from>        <grant-to>        <resource include-subpaths="true" path="/"/>        </grant-to>        </policy>        </cross-domain-access>        </access-policy>';
    req.setEncoding('utf8');
    res.end(xml);

}

RestServer.get("/crossdomain.xml", Crossdomain);
RestServer.get("/clientaccesspolicy.xml", Clientaccesspolicy);
