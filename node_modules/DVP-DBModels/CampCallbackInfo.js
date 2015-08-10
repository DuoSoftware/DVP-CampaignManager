/**
 * Created by Rajinda on 6/29/2015.
 */




module.exports = function(sequelize, DataTypes) {
    var CampCallbackInfo = sequelize.define('DB_CAMP_CallbackInfo', {
            CampaignId: {type:DataTypes.INTEGER,unique: 'CampCallbackInfoCompositeIndex'},
            ContactId: {type:DataTypes.STRING,unique: 'CampCallbackInfoCompositeIndex'},
            CamScheduleId:{type:DataTypes.INTEGER,unique: 'CampCallbackInfoCompositeIndex'},
            CallBackCount:DataTypes.INTEGER,
            Status:DataTypes.BOOLEAN,
            CallBackId:{type:DataTypes.INTEGER, primaryKey:true,autoIncrement: true}

        }
    );
    return CampCallbackInfo;
};