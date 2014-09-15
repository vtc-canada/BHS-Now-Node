USE cred;
DROP PROCEDURE if EXISTS `UpdateBuildingLastSale` ;

DELIMITER $$
CREATE PROCEDURE `UpdateBuildingLastSale`(IN buildingID INT,  IN saleDate DATETIME, IN lastSalePrice DECIMAL(13,2))
BEGIN

	UPDATE cur_buildings
		SET sale_date = saleDate
			,last_sale_price = lastSalePrice
	WHERE cur_buildings.id = buildingID;

END$$
DELIMITER ;



