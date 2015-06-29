/**
 * Created by Rajinda on 6/29/2015.
 */



module.exports = function(sequelize, DataTypes) {
    var OngoingCampaign = sequelize.define('DB_CAMP_OngoingCampaign', {
            CampaignId: DataTypes.INTEGER,
            CampaignState: DataTypes.STRING,
            LastResponsTime:DataTypes.DATE,
            DialerId:DataTypes.STRING
        }
    );
    return OngoingCampaign;
};