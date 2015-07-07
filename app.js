/**
 * Created by Pawan on 6/1/2015.
 */

var restify = require('restify');
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');

var config = require('config');

var port = config.Host.port || 3000;
var version = config.Host.version;
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var campaignHandler = require('./CampaignHandler');


//-------------------------  Restify Server ------------------------- \\
var RestServer = restify.createServer({
    name: "campaignmanager",
    version: '1.0.0'
}, function (req, res) {

});

//Server listen
RestServer.listen(port, function () {
    console.log('%s listening at %s', RestServer.name, RestServer.url);

});
//Enable request body parsing(access)
RestServer.use(restify.bodyParser());
RestServer.use(restify.acceptParser(RestServer.acceptable));
RestServer.use(restify.queryParser());
//-------------------------  Restify Server ------------------------- \\

//-------------------------  CampaignHandler ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignHandler', function (req, res, next) {
    try {

        logger.debug('[DVP-campaignmanager.CreateCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.CreateCampaign(cmp.CampaignName, cmp.CampaignMode, cmp.CampaignChannel, cmp.DialoutMechanism, TenantId, CompanyId, cmp.Class, cmp.Type, cmp.Category, res)

    }
    catch (ex) {

        logger.error('[DVP-campaignmanager.CreateCampaign] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-campaignmanager.CreateCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignHandler', function (req, res, next) {
    try {

        logger.debug('[DVP-campaignmanager.EditCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.CreateCampaign(cmp.CampaignId, cmp.CampaignMode, cmp.CampaignChannel, cmp.DialoutMechanism, tenantId, companyId, cmp.Class, cmp.Type, cmp.Category, res)

    }
    catch (ex) {

        logger.error('[DVP-campaignmanager.EditCampaign] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-campaignmanager.EditCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.del('/DVP/API/' + version + '/CampaignHandler/:CampaignId', function (req, res, next) {
    try {

        logger.debug('[DVP-campaignmanager.DeleteCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmpId = req.params.CampaignId;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.DeleteCampaign(cmpId, tenantId, companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-campaignmanager.DeleteCampaign] - [HTTP]  - Exception occurred  -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-campaignmanager.DeleteCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignHandler', function (req, res, next) {
    try {

        logger.debug('[DVP-campaignmanager.GetAllCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var tenantId = 1;
        var companyId = 1;
        campaignHandler.GetAllCampaign(tenantId, companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-campaignmanager.GetAllCampaign] - [HTTP]  - Exception occurred  -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-campaignmanager.GetAllCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignHandler/:CampaignId', function (req, res, next) {
    try {

        logger.debug('[DVP-campaignmanager.GetAllCampaignByCampaignId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmpId = req.params.CampaignId;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.GetAllCampaignByCampaignId(tenantId, companyId, cmpId, res);

    }
    catch (ex) {

        logger.error('[DVP-campaignmanager.GetAllCampaignByCampaignId] - [HTTP]  - Exception occurred  -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-campaignmanager.GetAllCampaignByCampaignId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignHandler/OngoingCampaign', function (req, res, next) {
    try {

        logger.debug('[DVP-campaignmanager.GetOngoingCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var tenantId = 1;
        var companyId = 1;
        campaignHandler.GetOngoingCampaign(tenantId, companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-campaignmanager.GetOngoingCampaign] - [HTTP]  - Exception occurred  -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-campaignmanager.GetOngoingCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});


RestServer.get('/DVP/API/' + version + '/CampaignHandler/:CampaignState', function (req, res, next) {
    try {

        logger.debug('[DVP-campaignmanager.GetAllCampaignByCampaignState] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmpState = req.params.CampaignState;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.GetAllCampaignByCampaignState(tenantId, companyId, cmpState, res);

    }
    catch (ex) {

        logger.error('[DVP-campaignmanager.GetAllCampaignByCampaignState] - [HTTP]  - Exception occurred  -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-campaignmanager.GetAllCampaignByCampaignState] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignHandler/:DialerId', function (req, res, next) {
    try {

        logger.debug('[DVP-campaignmanager.GetPendingCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var dialerId = req.params.DialerId;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.GetPendingCampaign(tenantId, companyId, dialerId, res);

    }
    catch (ex) {

        logger.error('[DVP-campaignmanager.GetPendingCampaign] - [HTTP]  - Exception occurred  -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-campaignmanager.GetPendingCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignHandler/', function (req, res, next) {
    try {

        logger.debug('[DVP-campaignmanager.GetOfflineCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var tenantId = 1;
        var companyId = 1;
        campaignHandler.GetOfflineCampaign(tenantId, companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-campaignmanager.GetOfflineCampaign] - [HTTP]  - Exception occurred  -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-campaignmanager.GetOfflineCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

//------------------------- End-CampaignHandler ------------------------- \\

//------------------------- CampaignOperations ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignOperations', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignOperations.StartCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        campaignHandler.StartCampaign(cmp.CampaignId, cmp.DialerId, res);
    }
    catch (ex) {

        logger.error('[DVP-CampaignOperations.StartCampaign] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignOperations.StartCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignOperations/Stop', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignOperations.StopCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        campaignHandler.StopCampaign(cmp.CampaignId, res);
    }
    catch (ex) {

        logger.error('[DVP-CampaignOperations.StopCampaign] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignOperations.StopCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignOperations/Pause', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignOperations.PauseCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        campaignHandler.PauseCampaign(cmp.CampaignId, res);
    }
    catch (ex) {

        logger.error('[DVP-CampaignOperations.PauseCampaign] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignOperations.PauseCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignOperations/Resume', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignOperations.ResumeCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        campaignHandler.ResumeCampaign(cmp.CampaignId, res);
    }
    catch (ex) {

        logger.error('[DVP-CampaignOperations.ResumeCampaign] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignOperations.ResumeCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignOperations/End', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignOperations.EndCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        campaignHandler.EndCampaign(cmp.CampaignId, res);
    }
    catch (ex) {

        logger.error('[DVP-CampaignOperations.EndCampaign] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignOperations.EndCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignOperations/End', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignOperations.UpdateOperationState] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        campaignHandler.UpdateOperationState(cmp.CampaignId, cmp.DialerId, res);
    }
    catch (ex) {

        logger.error('[DVP-CampaignOperations.UpdateOperationState] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignOperations.UpdateOperationState] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

//------------------------- End-CampaignOperations ------------------------- \\

//------------------------- CampaignConfigurations ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignConfigurations', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignConfigurations.CreateConfiguration] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.CreateConfiguration(cmp.CampaignId, cmp.CampaignChannel, cmp.AllowCallBack, cmp.MaxCallBackCount, tenantId, companyId, true, res);
    }
    catch (ex) {

        logger.error('[DVP-CampaignConfigurations.CreateConfiguration] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignConfigurations.CreateConfiguration] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignConfigurations', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignConfigurations.EditConfiguration] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;

        campaignHandler.EditConfiguration(cmp.ConfigureId, cmp.CampaignId, cmp.ChannelConcurrency, cmp.AllowCallBack, cmp.status, res);
    }
    catch (ex) {

        logger.error('[DVP-CampaignConfigurations.EditConfiguration] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignConfigurations.EditConfiguration] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.delete('/DVP/API/' + version + '/CampaignConfigurations/:ConfigureId', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignConfigurations.DeleteConfiguration] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmpId = req.params.ConfigureId;
        campaignHandler.DeleteConfiguration(cmpId, res);
    }
    catch (ex) {

        logger.error('[DVP-CampaignConfigurations.DeleteConfiguration] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignConfigurations.DeleteConfiguration] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignConfigurations/', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignConfigurations.GetAllConfiguration] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var tenantId = 1;
        var companyId = 1;
        campaignHandler.GetAllConfiguration(tenantId, companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignConfigurations.GetAllConfiguration] - [HTTP]  - Exception occurred  -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignConfigurations.GetAllConfiguration] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignConfigurations/:ConfigureId', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignConfigurations.GetConfiguration] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var tenantId = 1;
        var companyId = 1;
        var configureId = req.params.ConfigureId;
        campaignHandler.GetConfiguration(configureId, tenantId, companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignConfigurations.GetConfiguration] - [HTTP]  - Exception occurred  -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignConfigurations.GetConfiguration] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});


//------------------------- End-CampaignConfigurations ------------------------- \\

//------------------------- CampaignNumberUpload ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignNumberUpload', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignNumberUpload.UploadContacts] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.UploadContacts(cmp.Contacts, tenantId, companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignNumberUpload.UploadContacts] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignNumberUpload.UploadContacts] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/' + version + '/CampaignNumberUpload', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignNumberUpload.UploadContactsToCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.UploadContactsToCampaign(cmp.Contacts, cmp.CampaignId, tenantId, companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignNumberUpload.UploadContactsToCampaign] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignNumberUpload.UploadContactsToCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/' + version + '/CampaignNumberUpload', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignNumberUpload.UploadContactsToCampaignWithSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.UploadContactsToCampaignWithSchedule(cmp.Contacts, cmp.CampaignId, cmp.CamScheduleId, tenantId, companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignNumberUpload.UploadContactsToCampaignWithSchedule] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignNumberUpload.UploadContactsToCampaignWithSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/' + version + '/CampaignNumberUpload', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignNumberUpload.EditContacts] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.EditContacts(cmp.Contact, cmp.CampaignId, tenantId, companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignNumberUpload.EditContacts] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignNumberUpload.EditContacts] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.delete('/DVP/API/' + version + '/CampaignNumberUpload/Contacts:Contacts/CampaignId:CampaignId', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignNumberUpload.DeleteContacts] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var contacts = req.params.Contacts;
        var campaignId = req.params.CampaignId;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.DeleteContacts(contacts, campaignId, tenantId, companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignNumberUpload.DeleteContacts] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignNumberUpload.DeleteContacts] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.post('/DVP/API/' + version + '/CampaignNumberUpload', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignNumberUpload.AssingScheduleToCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.AssingScheduleToCampaign(cmp.CampaignId, cmp.CamScheduleId, tenantId, companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignNumberUpload.AssingScheduleToCampaign] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignNumberUpload.AssingScheduleToCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignNumberUpload', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignNumberUpload.GetAllContact] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var tenantId = 1;
        var companyId = 1;
        campaignHandler.GetAllContact(tenantId, companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignNumberUpload.GetAllContact] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignNumberUpload.GetAllContact] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignNumberUpload', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var campaignId = req.params.CampaignId;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.GetAllContactByCampaignId(campaignId, tenantId, companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignNumberUpload/:CampaignId', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var campaignId = req.params.CampaignId;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.GetAllContactByCampaignId(campaignId, tenantId, companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

//------------------------- End-CampaignNumberUpload ------------------------- \\

//------------------------- CampaignSchedule ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignSchedule', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignSchedule.CreateSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.CreateSchedule(cmp.CampaignId, cmp.ScheduleId, cmp.ScheduleType,tenantId,companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignSchedule.CreateSchedule] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignSchedule.CreateSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignSchedule', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignSchedule.EditSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.EditSchedule(cmp.CamScheduleId, cmp.CampaignId, cmp.ScheduleId, cmp.ScheduleType,tenantId,companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignSchedule.EditSchedule] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignSchedule.EditSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.delete('/DVP/API/' + version + '/CampaignSchedule/:CamScheduleId', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignSchedule.DeleteSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var camScheduleId = req.params.CamScheduleId;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.DeleteSchedule(camScheduleId,tenantId,companyId, res);
    }
    catch (ex) {

        logger.error('[DVP-CampaignSchedule.DeleteSchedule] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignSchedule.DeleteSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignSchedule', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignSchedule.GetAllSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var tenantId = 1;
        var companyId = 1;
        campaignHandler.GetAllSchedule(tenantId,companyId,res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignSchedule.GetAllSchedule] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignSchedule.GetAllSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignSchedule/:CamScheduleId', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignSchedule.GetSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
        var camScheduleId = req.params.CamScheduleId;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.GetSchedule(camScheduleId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignSchedule.GetSchedule] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignSchedule.GetSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignSchedule/:CampaignId', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignSchedule.GetScheduleByCampaignId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
        var campaignId = req.params.CampaignId;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.GetScheduleByCampaignId(campaignId,tenantId,companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignSchedule.GetScheduleByCampaignId] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignSchedule.GetScheduleByCampaignId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignSchedule/:ScheduleId', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignSchedule.GetScheduleByScheduleType] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
        var scheduleType = req.params.ScheduleId;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler. GetScheduleByScheduleType(scheduleType,tenantId,companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignSchedule.GetScheduleByScheduleType] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignSchedule.GetScheduleByScheduleType] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignSchedule/CampaignId:CampaignId/ScheduleType:ScheduleType', function (req, res, next) {
    try {

        logger.debug('[DVP-CampaignSchedule.GetScheduleByCampaignIdScheduleType] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
        var campaignId = req.params.CampaignId;
        var scheduleType = req.params.ScheduleType;
        var tenantId = 1;
        var companyId = 1;
        campaignHandler.GetScheduleByCampaignIdScheduleType(campaignId, scheduleType,tenantId,companyId, res);

    }
    catch (ex) {

        logger.error('[DVP-CampaignSchedule.GetScheduleByCampaignIdScheduleType] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-CampaignSchedule.GetScheduleByCampaignIdScheduleType] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

//------------------------- End-CampaignSchedule ------------------------- \\