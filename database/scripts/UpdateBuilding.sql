USE cred;
DROP PROCEDURE if EXISTS `UpdateBuilding` ;

DELIMITER $$
CREATE PROCEDURE `UpdateBuilding`(IN buildingID INT, IN addressID INT, IN buildingTypeID INT,IN heatSystemAge INT, IN windowsInstalledYear INT,IN elevatorInstalledYear INT
		,IN boilerInstalledYear INT, IN cableInternetProvider VARCHAR(45), IN assessedValue Varchar(1024)
		,IN heatSystemTypeID INT, IN unitQuantity INT, IN saleDate DATETIME,IN pricePerUnit float, IN unit_price_manual_mode BOOLEAN
		,IN propertyMgmtCompany VARCHAR(45), IN prevPropertyMgmtCompany VARCHAR(45), IN lastSalePrice DECIMAL(13,2), IN images VARCHAR(1024)
		,IN bachelorPrice FLOAT, IN bedroom1Price FLOAT, IN bedroom2Price FLOAT, IN bedroom3Price FLOAT, IN bachelorUnits INT, IN bedroom1Units INT
		,IN bedroom2Units INT, IN bedroom3Units INT, IN buildingIncome DECIMAL(13,2), IN building_income_manual_mode BOOLEAN, IN hasElevator BOOLEAN, IN lastElevatorUpgradeYear INT, IN lastBoilerUpgradeYear INT
		,IN mortgageCompany VARCHAR(64), IN mortgageDueDate TIMESTAMP, IN parkingSpots INT, IN capRate FLOAT)
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
			,unit_price = pricePerUnit
			,unit_price_manual_mode = unit_price_manual_mode
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
			,building_income_manual_mode = building_income_manual_mode
			,has_elevator = hasElevator
			,last_elevator_upgrade_year = lastElevatorUpgradeYear
			,last_boiler_upgrade_year = lastBoilerUpgradeYear	
			,mortgage_company = mortgageCompany
			,mortgage_due_date = mortgageDueDate
			,parking_spots = parkingSpots
			,cap_rate = capRate
	WHERE cur_buildings.id = buildingID;

END$$
DELIMITER ;



