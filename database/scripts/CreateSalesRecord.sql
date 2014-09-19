USE cred;
DROP PROCEDURE if EXISTS `CreateSalesRecord` ;

DELIMITER $$
CREATE PROCEDURE `CreateSalesRecord`(IN salePrice DECIMAL(13,2),IN saleDate DATETIME, IN heatSystemAge INT,  IN windowsInstalledYear INT, 
		IN elevatorInstalledYear INT, IN elevatorUpgradeYear INT, IN has_elevator BOOLEAN, IN boilerInstalledYear INT, IN cableInternetProvider VARCHAR(45), IN assessedValue FLOAT, 
		IN heatSystemType VARCHAR(45),IN unitQuantity INT, IN unitPrice INT, IN unit_price_manual_mode BOOLEAN, IN building_income DECIMAL(13,2), IN building_income_manual_mode BOOLEAN
, IN bachelorPrice FLOAT, IN bedroom1Price FLOAT, IN bedroom2Price FLOAT, IN bedroom3Price FLOAT, IN bachelorUnits INT, IN bedroom1Units INT
		,IN bedroom2Units INT, IN bedroom3Units INT, IN propertyMgmtCompany VARCHAR(45), IN prev_property_mgmt_company VARCHAR(45)
, IN cap_rate INT, IN building_type INT, IN last_boiler_upgrade_year INT
		,IN mortgage_company VARCHAR(64), IN mortgage_due_date TIMESTAMP, IN parkingSpots INT
,OUT id INT)
BEGIN
	INSERT INTO cur_sales_record_history(sale_price,sale_date,heat_system_age,windows_installed_year,elevator_installed_year,last_elevator_upgrade_year, has_elevator,boiler_installed_year
		,cable_internet_provider,assessed_value,heat_system_type_id,unit_quantity
,unit_price,unit_price_manual_mode,building_income,building_income_manual_mode
,bachelor_price,bedroom1_price,bedroom2_price,bedroom3_price 
		,bachelor_units ,bedroom1_units ,bedroom2_units ,bedroom3_units,property_mgmt_company,prev_property_mgmt_company
,cap_rate,ref_building_type_id,last_boiler_upgrade_year,mortgage_company,mortgage_due_date, parking_spots) 
		VALUES (salePrice, saleDate, heatSystemAge, windowsInstalledYear, elevatorInstalledYear,elevatorUpgradeYear,has_elevator, boilerInstalledYear, cableInternetProvider
		,assessedValue, heatSystemType, unitQuantity
, unitPrice,unit_price_manual_mode,building_income,building_income_manual_mode
, bachelorPrice,bedroom1Price,bedroom2Price,bedroom3Price,bachelorUnits,bedroom1Units,bedroom2Units,bedroom3Units, propertyMgmtCompany, prev_property_mgmt_company
,cap_rate,building_type,last_boiler_upgrade_year,mortgage_company,mortgage_due_date, parkingSpots);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;
