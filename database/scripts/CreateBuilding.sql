USE cred;
DROP PROCEDURE if EXISTS `CreateBuilding` ;

DELIMITER $$
CREATE PROCEDURE `CreateBuilding`(IN addressID INT, IN buildingTypeID INT,IN heatSystemAge INT, IN windowsAge INT,IN elevatorsAge INT
		,IN boilerAge INT, IN cableInternetProvider VARCHAR(45), IN assessedValue Varchar(45), IN boilerTypeID INT, IN elevatorTypeID INT
		,IN heatSystemTypeID INT, IN windowTypeID INT, IN unitPricing VARCHAR(512), IN unitQuantity INT, IN saleDate DATETIME,IN pricePerUnit float
		,IN propertyMgmtCompany VARCHAR(45), IN prevPropertyMgmtCompany VARCHAR(45), IN lastSalePrice VARCHAR(45), IN images VARCHAR(1024), OUT id INT)
BEGIN
	INSERT INTO `cur_buildings`(`cur_address_id`,`ref_building_type_id`,`is_deleted`,`heat_system_age`,`windows_age`
		,`elevators_age`, `boiler_age`,`cable_internet_provider`,`assessed_value`, `boiler_type_id`, `elevator_type_id`
		,`heat_system_type_id`,`window_type_id`,`unit_pricing`,`unit_quantity`,`sale_date`,`price_per_unit`,`property_mgmt_company`
		,`prev_property_mgmt_company`, `last_sale_price`,`images`) 
	VALUES (addressID, buildingTypeID, false, heatSystemAge, windowsAge,elevatorsAge, boilerAge, cableInternetProvider, assessedValue, boilerTypeID
		,elevatorTypeID, heatSystemTypeID, windowTypeID, unitPricing, unitQuantity, saleDate, pricePerUnit, propertyMgmtCompany, prevPropertyMgmtCompany
		,lastSalePrice, images);

	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;



