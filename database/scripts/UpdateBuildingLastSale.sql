USE cred;
DROP PROCEDURE if EXISTS `UpdateBuildingLastSale` ;

DELIMITER $$
CREATE PROCEDURE `UpdateBuildingLastSale`(IN buildingID INT,  IN saleDate DATETIME, IN lastSalePrice DECIMAL(13,2), IN cap_rate FLOAT, IN unitPrice FLOAT)
BEGIN

	UPDATE cur_buildings
		SET sale_date = saleDate
			,last_sale_price = lastSalePrice
			,cap_rate = cap_rate
			,unit_price = unitPrice
	WHERE cur_buildings.id = buildingID;

END$$
DELIMITER ;



