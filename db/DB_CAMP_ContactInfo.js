/**
 * Created by Rajinda on 6/29/2015.
 */


module.exports = function(sequelize, DataTypes) {
    var ContactInfo = sequelize.define('DB_CAMP_ContactInfo', {
            CampaignId: DataTypes.INTEGER,
            CamScheduleId: DataTypes.INTEGER,
            ContactId:DataTypes.STRING,
            CamContactId:DataTypes.STRING,
            Status:DataTypes.BOOLEAN,
            TenantId:DataTypes.INTEGER,
            CompanyId:DataTypes.INTEGER
        }
    );
    return ContactInfo;
};

