USE cred;
DROP PROCEDURE if EXISTS `UpdateSalesRecord` ;

DELIMITER $$
CREATE PROCEDURE `UpdateSalesRecord`(IN recordID INT,IN salePrice DECIMAL(13,2),IN saleDate DATETIME, IN heatSystemAge INT, IN windowsInstalledYear INT, 
		IN elevatorInstalledYear INT, IN has_elevator BOOLEAN
		,IN boilerInstalledYear INT, IN cableInternetProvider VARCHAR(45)
		,IN assessedValue FLOAT 
		,IN heatSystemType VARCHAR(45),IN unitQuantity INT

		,IN unitPrice INT, IN unit_price_manual_mode BOOLEAN, IN building_income DECIMAL(13,2), IN building_income_manual_mode BOOLEAN

		,IN bachelor_units INT, IN bedroom1_units INT, IN bedroom2_units INT, IN bedroom3_units INT
		,IN bachelor_price FLOAT, IN bedroom1_price FLOAT, IN bedroom2_price FLOAT, IN bedroom3_price FLOAT

		,IN propertyMgmtCompany VARCHAR(45), IN prev_property_mgmt_company VARCHAR(45), IN cap_rate INT, IN building_type INT, IN last_boiler_upgrade_year INT
		,IN mortgageCompany VARCHAR(64), IN mortgageDueDate TIMESTAMP)
BEGIN
	UPDATE cur_sales_record_history
		SET	
			id = recordID
			,sale_price = salePrice
			,sale_date = saleDate
			,heat_system_age = heatSystemAge
			,windows_installed_year = windowsInstalledYear
			,elevator_installed_year = elevatorInstalledYear
			,boiler_installed_year = boilerInstalledYear
			,cable_internet_provider = cableInternetProvider
			,assessed_value = assessedValue
			,heat_system_type_id = heatSystemType
			,property_mgmt_company = propertyMgmtCompany
			,prev_property_mgmt_company = prev_property_mgmt_company
			,unit_quantity = unitQuantity
			,unit_price = unitPrice
			,unit_price_manual_mode = unit_price_manual_mode
			,bachelor_units = bachelor_units
			,bedroom1_units = bedroom1_units
			,bedroom2_units = bedroom2_units
			,bedroom3_units = bedroom3_units
			,bachelor_price = bachelor_price
			,bedroom1_price = bedroom1_price
			,bedroom2_price = bedroom2_price
			,bedroom3_price = bedroom3_price
			,building_income = building_income
			,building_income_manual_mode = building_income_manual_mode
			,has_elevator = has_elevator
			,cap_rate = cap_rate
			,ref_building_type_id = building_type
			,last_boiler_upgrade_year = last_boiler_upgrade_year
			,mortgage_company = mortgageCompany
			,mortgage_due_date = mortgageDueDate
			

	WHERE cur_sales_record_history.id = recordID;
END$$
DELIMITER ;
