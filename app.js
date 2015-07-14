/**
 * Created by Pawan on 6/1/2015.
 */
var restify = require('restify');
var moment=require('moment');
var redis=require('redis');
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');

var camp=require('./CampaignManager.js');
var client = redis.createClient(6379,"127.0.0.1");
client.on("error", function (err) {
    console.log("Error " + err);

});

var RestServer = restify.createServer({
    name: "myapp",
    version: '1.0.0'
},function(req,res)
{

});
RestServer.listen(8083, function () {
    console.log('%s listening at %s', RestServer.name, RestServer.url);
    // var x = moment(moment().format("YYYY-MM-DD HH:mm")).isBetween("2013-12-09 12:31", "2016-12-09 16:31");
    //
    //var dt = moment(moment());
    // console.log("Today is : "+dt);

   
});
RestServer.use(restify.bodyParser());
RestServer.use(restify.acceptParser(RestServer.acceptable));
RestServer.use(restify.queryParser());

RestServer.get('/DVP/API/1.0/DialerApi/GetPhones/:camp/:lim',function(req,res,next)
{
    console.log("HIT");
    camp.ReturnPhones(req.params.camp,req.params.lim,function(err,arr)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(arr);
            res.send(arr)
        }
    });
    return next();
    /*
     camp.PickCurrentCampaign(function(err,resz)
     {
     res.end(resz);
     });*/
});

RestServer.get('/DVP/API/1.0/DialerApi/GetCampaign',function(req,res,next)
{
    camp.GetCampaign(function(err,arr)
    {
        if(err)
        {
            //console.log(err);
            var jsonString = messageFormatter.FormatMessage(err, "Error", false, arr);
            //res.send(jsonString);

        }
        else
        {
            //console.log(result[0]);
           // console.log(arr);
            var jsonString = messageFormatter.FormatMessage(undefined, "Success", true, arr);


        }

        console.log(jsonString);
        res.write(jsonString);
        res.end();
    });

    next();
});

RestServer.get('/DVP/API/1.0/DialerApi/GetCampaignCount',function(req,res,next){

   /* camp.GetCampaignCount(function(err,arr)
    {
        if(err)
        {
            //console.log(err);
            //res.send("ERR");
            res.end();
        }
        else
        {
            //console.log(result[0]);
            //res.send(arr.toString());
            res.end(arr.toString());
        }
    });
    */

    camp.FillCampaignPhones(8,"a",2);
    res.end();
});

RestServer.get('/DVP/API/1.0/DialerApi/FillCampaignPhones/:CampName/:Max',function(req,res,next){

    /* camp.GetCampaignCount(function(err,arr)
     {
     if(err)
     {
     //console.log(err);
     //res.send("ERR");
     res.end();
     }
     else
     {
     //console.log(result[0]);
     //res.send(arr.toString());
     res.end(arr.toString());
     }
     });
     */

    camp.FillCampaignPhones(req.params.CampName,req.params.Max,function(err,resp)
    {
        if(err)
        {
            var jsonString = messageFormatter.FormatMessage(err, "Error", false, resp);
        }else
        {
            var jsonString = messageFormatter.FormatMessage(undefined, "Success", true, resp);

        }

        console.log(jsonString);
        res.write(jsonString);
        res.end();
    });

    next();
});

RestServer.get('/DVP/API/1.0/DialerApi/PhoneCount/:CampName',function(req,res,next)
{

    camp.GetPhoneCount(req.params.CampName,function(err,resp)
    {
        if(err)
        {
            var jsonString = messageFormatter.FormatMessage(err, "Error", false, resp);
        }else
        {


            var jsonString = messageFormatter.FormatMessage(undefined, "Success "+req.params.CampName, true, resp);

        }

        console.log(jsonString);
        res.write(jsonString);
        res.end();
    });

    next();
});