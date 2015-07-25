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
var campaignOperations = require('./CampaignOperations');
var campaignConfigurations = require('./CampaignConfigurations');
var campaignNumberUpload = require('./CampaignNumberUpload');
var campaignSchedule = require('./CampaignSchedule');
var campaignDialoutInfo = require('./CampaignDialoutInfo');

//-------------------------  Restify Server ------------------------- \\
var RestServer = restify.createServer({
    name: "campaignmanager",
    version: '1.0.0'
}, function (req, res) {

});
restify.CORS.ALLOW_HEADERS.push('api_key');

RestServer.use(restify.CORS());
RestServer.use(restify.fullResponse());
//Enable request body parsing(access)
RestServer.use(restify.bodyParser());
RestServer.use(restify.acceptParser(RestServer.acceptable));
RestServer.use(restify.queryParser());

//Server listen
RestServer.listen(port, function () {
    console.log('%s listening at %s', RestServer.name, RestServer.url);


});


//-------------------------  Restify Server ------------------------- \\

//-------------------------  CampaignHandler ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign', function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager.CreateCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager.CreateCampaign] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }
        campaignHandler.CreateCampaign(cmp.CampaignName, cmp.CampaignMode, cmp.CampaignChannel, cmp.DialoutMechanism, tenantId, companyId, cmp.Class, cmp.Type, cmp.Category, cmp.Extension, res);

    }
    catch (ex) {

        logger.error('[DVP-campaignmanager.CreateCampaign] - [HTTP]  - Exception occurred -  Data - %s ', JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-campaignmanager.CreateCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign', function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager.EditCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager.EditCampaign] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        campaignHandler.EditCampaign(cmp.CampaignId, cmp.CampaignName, cmp.CampaignMode, cmp.CampaignChannel, cmp.DialoutMechanism, tenantId, companyId, cmp.Class, cmp.Type, cmp.Category, cmp.Extension, res)

    }
    catch (ex) {
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-campaignmanager.EditCampaign] - [HTTP]  - Exception occurred -  Data - %s ', jsonString, ex);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/State/:Command', function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager] - [HTTP]  - Request received -  Data - [%s]- %s ', req.params.CampaignId, JSON.stringify(req.body));


        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }
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

RestServer.del('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId', function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager.DeleteCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));

        var cmpId = req.params.CampaignId;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        campaignHandler.DeleteCampaign(cmpId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-campaignmanager.DeleteCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaigns/:Count', function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager.GetAllCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));

        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        if (req.params.Count) {
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

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId', function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager.GetAllCampaignByCampaignId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));

        var cmpId = req.params.CampaignId;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }
        campaignHandler.GetAllCampaignByCampaignId(tenantId, companyId, cmpId, res);

    }
    catch (ex) {


        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-campaignmanager.GetAllCampaignByCampaignId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaigns/State/:Command/:Count', function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager.Campaign/State] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        switch (req.params.Command) {
            case "offline":
                campaignHandler.GetOfflineCampaign(tenantId, companyId, res);
                break;
            case "ongoing":
                campaignHandler.GetOngoingCampaign(tenantId, companyId, res);
                break;
            case "Pending":
                var count = req.params.Count;
                campaignHandler.GetPendingCampaign(tenantId, companyId, count, res);
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


//------------------------- End-CampaignHandler ------------------------- \\

//------------------------- CampaignOperations ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/Operations', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignOperations.StartCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        campaignOperations.StartCampaign(cmp.CampaignId, cmp.DialerId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignOperations.StartCampaign] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Operations/:Command', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignOperations] - [HTTP]  - Request received -  Data - %s - %s', JSON.stringify(req.body), JSON.stringify(req.params));
        var camId = req.params.CampaignId;
        switch (req.params.Command) {
            case "stop":
                campaignOperations.StopCampaign(camId, res);
                break;
            case "pause":
                campaignOperations.PauseCampaign(camId, res);
                break;
            case "resume":
                campaignOperations.ResumeCampaign(camId, res);
                break;
            case "end":
                campaignOperations.EndCampaign(camId, res);
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

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Operations/State/:DialerId/:CampaignState', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignOperations.UpdateOperationState] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.param));
        var campaignId = req.params.CampaignId;
        var dialerId = req.params.DialerId;
        var campaignState = req.params.CampaignState;

        campaignOperations.UpdateOperationState(campaignId, dialerId, campaignState, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignOperations.UpdateOperationState] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaigns/Operations/State/:Command', function (req, res, next) {
    try {

        logger.info('[DVP-campaignmanager.GetPendingCampaign] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));

        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        switch (req.params.Command) {
            case "Pending":
                if (req.body.DialerId) {
                    var dialerId = req.body.DialerId;
                    campaignOperations.GetPendingCampaignByDialerId(tenantId, companyId, dialerId, res);
                }
                else {
                    campaignOperations.GetPendingCampaign(tenantId, companyId, res);
                }
                break;
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

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/Configurations', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignConfigurations.CreateConfiguration] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        campaignConfigurations.CreateConfiguration(cmp.CampaignId, cmp.ChannelConcurrent, cmp.AllowCallBack, cmp.MaxCallBackCount, tenantId, companyId, true, cmp.Caller, cmp.StartDate, cmp.EndDate, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignConfigurations.CreateConfiguration] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/Configurations', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignConfigurations.EditConfiguration] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;

        campaignConfigurations.EditConfiguration(cmp.ConfigureId, cmp.CampaignId, cmp.ChannelConcurrency, cmp.AllowCallBack, cmp.status, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignConfigurations.EditConfiguration] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.del('/DVP/API/' + version + '/CampaignManager/Campaign/Configurations/:ConfigureId', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignConfigurations.DeleteConfiguration] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

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

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Configurations/', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignConfigurations.GetAllConfiguration] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        campaignConfigurations.GetAllConfiguration(tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignConfigurations.GetAllConfiguration] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Configuration/:ConfigureId', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignConfigurations.GetConfiguration] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

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


//------------------------- End-CampaignConfigurations ------------------------- \\

//------------------------- CampaignNumberUpload ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/Numbers', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.UploadContacts] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
        res.setHeader('Access-Control-Allow-Origin', '*');
        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        if (cmp.CampaignId) {
            if (cmp.CamScheduleId) {
                campaignNumberUpload.UploadContactsToCampaignWithSchedule(cmp.Contacts, cmp.CampaignId, cmp.CamScheduleId, tenantId, companyId, cmp.CategoryID, res);
            }
            else {
                campaignNumberUpload.UploadContactsToCampaign(cmp.Contacts, cmp.CampaignId, tenantId, companyId, cmp.CategoryID, res);
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

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Numbers/Existing', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.AssigningScheduleToCampaign] - [HTTP]  - Request received -  Data - %s -%s ', JSON.stringify(req.body), JSON.stringify(req.params));
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }
        var cmp = req.body;


        if (cmp.ContactIds) {
            campaignNumberUpload.AddExistingContactsToCampaign(cmp.ContactIds, req.params.CampaignId, res);
        }
        else if (cmp.CamScheduleIds) {
            campaignNumberUpload.AssigningScheduleToCampaign(req.params.CampaignId, cmp.CamScheduleIds, tenantId, companyId, res);
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

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/Numbers/Category', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.CreateContactCategory] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        } catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }
        campaignNumberUpload.CreateContactCategory(cmp.CategoryName, tenantId, companyId, res);

    }
    catch (ex) {
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.CreateContactCategory] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Numbers', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.EditContacts] - [HTTP]  - Request received -  Data - %s -%s ', JSON.stringify(req.body), JSON.stringify(req.params));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }
        campaignNumberUpload.EditContact(cmp.Contact, req.params.CampaignId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.EditContacts] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/Numbers/Category/:CategoryID', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.EditContactCategory] - [HTTP]  - Request received -  Data - %s - %s', JSON.stringify(req.body), JSON.stringify(req.params));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }
        campaignNumberUpload.EditContactCategory(req.params.CategoryID, cmp.CategoryName, tenantId, companyId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.EditContactCategory] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.del('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Numbers/:Contacts', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.DeleteContacts] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var contacts = req.params.Contacts;
        var campaignId = req.params.CampaignId;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        campaignNumberUpload.DeleteContacts(contacts, campaignId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.DeleteContacts] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Numbers/all', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.GetAllContact] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        campaignNumberUpload.GetAllContact(tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.GetAllContact] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Numbers', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var campaignId = req.params.CampaignId;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        campaignNumberUpload.GetAllContactByCampaignId(campaignId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Numbers/:ScheduleId/:RowCount/:PageNo', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var campaignId = req.params.CampaignId;
        var scheduleId = req.params.ScheduleId;
        var rowCount = req.params.RowCount;
        var pageNo = req.params.PageNo;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        campaignNumberUpload.GetAllContactByCampaignIdScheduleId(campaignId, scheduleId, rowCount, pageNo, tenantId, companyId, res)

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.GetAllContactByCampaignIdScheduleId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Numbers/Categorys', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignNumberUpload.GetContactCategory] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));

        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-CampaignNumberUpload-GetContactCategory] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        campaignNumberUpload.GetContactCategory(tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignNumberUpload.GetContactCategory] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

//------------------------- End-CampaignNumberUpload ------------------------- \\

//------------------------- CampaignSchedule ------------------------- \\

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/Schedule', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.CreateSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }
        campaignSchedule.CreateSchedule(cmp.CampaignId, cmp.ScheduleId, cmp.ScheduleType, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignSchedule.CreateSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/Schedule', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.EditSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        campaignSchedule.EditSchedule(cmp.CamScheduleId, cmp.CampaignId, cmp.ScheduleId, cmp.ScheduleType, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignSchedule.EditSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.del('/DVP/API/' + version + '/CampaignManager/Campaign/Schedule/:CamScheduleId', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.DeleteSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var camScheduleId = req.params.CamScheduleId;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        campaignSchedule.DeleteSchedule(camScheduleId, tenantId, companyId, res);
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignSchedule.DeleteSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Schedules', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.GetAllSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        campaignSchedule.GetAllSchedule(tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignSchedule.GetAllSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Schedule/:CamScheduleId', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.GetSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
        var camScheduleId = req.params.CamScheduleId;

        campaignSchedule.GetSchedule(camScheduleId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignSchedule.GetSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Schedule', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.GetScheduleByCampaignId] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
        var campaignId = req.params.CampaignId;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        campaignSchedule.GetScheduleByCampaignId(campaignId, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignSchedule.GetScheduleByCampaignId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Schedule/:ScheduleId', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.GetScheduleByScheduleType] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));
        var scheduleType = req.params.ScheduleId;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }
        campaignSchedule.GetScheduleByScheduleType(scheduleType, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-CampaignSchedule.GetScheduleByScheduleType] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/:CampaignId/Schedule/:ScheduleType', function (req, res, next) {
    try {

        logger.info('[DVP-CampaignSchedule.GetScheduleByCampaignIdScheduleType] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
        var campaignId = req.params.CampaignId;
        var scheduleType = req.params.ScheduleType;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-campaignmanager] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

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

RestServer.post('/DVP/API/' + version + '/CampaignManager/Campaign/Session', function (req, res, next) {
    try {

        logger.info('[DVP-DialoutInfo.CreateDialoutInfo] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-DialoutInfo] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }
        campaignDialoutInfo.CreateDialoutInfo(cmp.CampaignId, cmp.DialerId, cmp.DialerStatus, cmp.Dialtime, cmp.Reason, cmp.SessionId, cmp.TryCount, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-DialoutInfo.CreateSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.put('/DVP/API/' + version + '/CampaignManager/Campaign/Session', function (req, res, next) {
    try {

        logger.info('[DVP-DialoutInfo.EditDialoutInfo] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var cmp = req.body;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-DialoutInfo] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        campaignSchedule.EditDialoutInfo(cmp.DialoutId, cmp.CampaignId, cmp.DialerId, cmp.DialerStatus, cmp.Dialtime, cmp.Reason, cmp.SessionId, cmp.TryCount, tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-DialoutInfo.EditDialoutInfo] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Session', function (req, res, next) {
    try {

        logger.info('[DVP-DialoutInfo.GetDialoutInfo] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.body));

        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-DialoutInfo] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }

        campaignSchedule.GetDialoutInfo(tenantId, companyId, res);

    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-DialoutInfo.GetAllSchedule] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

RestServer.get('/DVP/API/' + version + '/CampaignManager/Campaign/Session/:DialoutId', function (req, res, next) {
    try {

        logger.info('[DVP-DialoutInfo.GetSchedule] - [HTTP]  - Request received -  Data - %s ', JSON.stringify(req.params));
        var dialoutId = req.params.DialoutId;
        var tenantId = 1;
        var companyId = 1;
        try {
            var auth = req.header('authorization');
            var authInfo = auth.split("#");

            if (authInfo.length >= 2) {
                tenantId = authInfo[0];
                companyId = authInfo[1];
            }
        }
        catch (ex) {
            logger.error('[DVP-DialoutInfo] - [HTTP]  - Exception occurred -  Data - %s ', "authorization", ex);
        }
        campaignSchedule.GetDialoutInfoByDialoutId(dialoutId, tenantId, companyId, res)
    }
    catch (ex) {

        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.error('[DVP-DialoutInfo.GetDialoutInfoByDialoutId] - Request response : %s ', jsonString);
        res.end(jsonString);
    }
    return next();
});

//------------------------- End-DialoutInfo ------------------------- \\

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