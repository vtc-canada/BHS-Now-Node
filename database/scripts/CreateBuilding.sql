USE cred;
DROP PROCEDURE if EXISTS `CreateBuilding` ;

DELIMITER $$
CREATE PROCEDURE `CreateBuilding`(IN addressID INT, IN buildingTypeID INT,IN heatSystemAge INT, IN windowsInstalledYear INT,IN elevatorInstalledYear INT
		,IN boilerInstalledYear INT, IN cableInternetProvider VARCHAR(45), IN assessedValue Varchar(1024)
		,IN heatSystemTypeID INT, IN unitQuantity INT, IN saleDate DATETIME,IN pricePerUnit float
		,IN propertyMgmtCompany VARCHAR(512), IN prevPropertyMgmtCompany VARCHAR(512), IN lastSalePrice VARCHAR(45), IN images VARCHAR(1024)
		,IN bachelorPrice FLOAT, IN bedroom1Price FLOAT, IN bedroom2Price FLOAT, IN bedroom3Price FLOAT, IN bachelorUnits INT, IN bedroom1Units INT
		,IN bedroom2Units INT, IN bedroom3Units INT, IN buildingIncome DECIMAL(13,2), IN hasElevator BOOLEAN, IN lastElevatorUpgradeYear INT, IN lastBoilerUpgradeYear INT
		,IN mortgageCompany VARCHAR(64), IN mortgageDueDate TIMESTAMP, IN parkingSpots FLOAT, IN capRate FLOAT
		,OUT id INT)
BEGIN
	INSERT INTO cur_buildings(cur_address_id,ref_building_type_id,is_deleted,heat_system_age,windows_installed_year
		,elevator_installed_year,boiler_installed_year,cable_internet_provider,assessed_value
		,heat_system_type_id,unit_quantity,sale_date,unit_price,property_mgmt_company
		,prev_property_mgmt_company, last_sale_price,images,bachelor_price,bedroom1_price,bedroom2_price,bedroom3_price 
		,bachelor_units ,bedroom1_units ,bedroom2_units ,bedroom3_units,building_income ,has_elevator ,last_elevator_upgrade_year,last_boiler_upgrade_year
		,mortgage_company, mortgage_due_date, parking_spots, cap_rate) 
	
	VALUES (addressID, buildingTypeID, false, heatSystemAge, windowsInstalledYear,elevatorInstalledYear, boilerInstalledYear, cableInternetProvider, assessedValue
		,heatSystemTypeID,unitQuantity, saleDate, pricePerUnit, propertyMgmtCompany, prevPropertyMgmtCompany
		,lastSalePrice, images,bachelorPrice,bedroom1Price,bedroom2Price,bedroom3Price,bachelorUnits,bedroom1Units,bedroom2Units,bedroom3Units,buildingIncome
		,hasElevator,lastElevatorUpgradeYear,lastBoilerUpgradeYear, mortgageCompany, mortgageDueDate,parkingSpots,capRate);

	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;