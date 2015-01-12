USE cred;
DROP PROCEDURE if EXISTS `GetBuildingSaleContactMappingCount` ;

DELIMITER $$
CREATE PROCEDURE `GetBuildingSaleContactMappingCount`(IN saleID INT, IN buildingID int)
BEGIN
SELECT id FROM cur_sales_history_contact_mapping
WHERE cur_sales_history_contact_mapping.cur_buildings_id = buildingID
AND cur_sales_record_history_id = saleID;
END$$
DELIMITER ;	
