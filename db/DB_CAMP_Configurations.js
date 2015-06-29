/**
 * Created by Rajinda on 6/29/2015.
 */


module.exports = function(sequelize, DataTypes) {
    var Configurations = sequelize.define('DB_CAMP_Configurations', {
            CampaignId: DataTypes.INTEGER,
            ChannelConcurrency: DataTypes.INTEGER,
            AllowCallBack:DataTypes.BOOLEAN,
            MaxCallBackCount:DataTypes.INTEGER,
            ConfigureId:DataTypes.BOOLEAN,
            Status:DataTypes.BOOLEAN
        }
    );
    return Configurations;
};

