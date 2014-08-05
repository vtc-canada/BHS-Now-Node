USE cred;
DROP PROCEDURE if EXISTS `UpdateBuilding` ;

DELIMITER $$
CREATE PROCEDURE `UpdateBuilding`(IN buildingID INT, IN addressID INT, IN buildingTypeID INT,IN heatSystemAge INT, IN windowsInstalledYear INT,IN elevatorInstalledYear INT
		,IN boilerInstalledYear INT, IN cableInternetProvider VARCHAR(45), IN assessedValue Varchar(45)
		,IN heatSystemTypeID INT, IN unitQuantity INT, IN saleDate DATETIME,IN pricePerUnit float
		,IN propertyMgmtCompany VARCHAR(45), IN prevPropertyMgmtCompany VARCHAR(45), IN lastSalePrice VARCHAR(45), IN images VARCHAR(1024)
		,IN bachelorPrice FLOAT, IN bedroom1Price FLOAT, IN bedroom2Price FLOAT, IN bedroom3Price FLOAT, IN bachelorUnits INT, IN bedroom1Units INT
		,IN bedroom2Units INT, IN bedroom3Units INT, IN buildingIncome FLOAT, IN hasElevator BOOLEAN, IN lastElevatorUpgradeYear INT, IN lastBoilerUpgradeYear INT)
BEGIN

	UPDATE cur_buildings
		SET cur_address_id = addressID
			,ref_building_type_id = buildingTypeID
			,heat_system_age = heatSystemAge
			,windows_installed_year = windowsInstalledYear
			,elevator_installed_year = elevatorInstalledYear
			,boiler_installed_year = boilerInstalledYear
			,cable_internet_provider = cableInternetProvider
			,assessed_value = assessedValue
			,heat_system_type_id = heatSystemTypeID
			,unit_quantity = unitQuantity
			,sale_date = saleDate
			,price_per_unit = pricePerUnit
			,property_mgmt_company = propertyMgmtCompany
			,prev_property_mgmt_company = prevPropertyMgmtCompany
			,last_sale_price = lastSalePrice
			,images = images		
			,bachelor_price = bachelorPrice
			,bedroom1_price = bedroom1Price
			,bedroom2_price = bedroom2Price
			,bedroom3_price = bedroom3Price
			,bachelor_units = bachelorUnits
			,bedroom1_units = bedroom1Units
			,bedroom2_units = bedroom2Units
			,bedroom3_units = bedroom3Units
			,building_income = buildingIncome
			,has_elevator = hasElevator
			,last_elevator_upgrade_year = lastElevatorUpgradeYear
			,last_boiler_upgrade_year = lastBoilerUpgradeYear			
	WHERE cur_buildings.id = buildingID;

END$$
DELIMITER ;



