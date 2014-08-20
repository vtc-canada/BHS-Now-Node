USE cred;
DROP PROCEDURE if EXISTS `UpdateSalesRecord` ;

DELIMITER $$
CREATE PROCEDURE `UpdateSalesRecord`(IN recordID INT,IN salePrice FLOAT,IN saleDate DATETIME, IN heatSystemAge INT, IN windowsInstalledYear INT, 
		IN elevatorInstalledYear INT, IN boilerInstalledYear INT, IN cableInternetProvider VARCHAR(45), IN assessedValue FLOAT, 
		IN heatSystemType VARCHAR(45),IN unitQuantity INT, IN unitPrice INT, IN bachelor_units INT, IN bedroom1_units INT, IN bedroom2_units INT, IN bedroom3_units INT, IN bachelor_price FLOAT, IN bedroom1_price FLOAT, IN bedroom2_price FLOAT, IN bedroom3_price FLOAT, IN propertyMgmtCompany VARCHAR(45))
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
			,heat_system_type = heatSystemType
			,property_mgmt_company = propertyMgmtCompany
			,unit_quantity = unitQuantity
			,unit_price = unitPrice
			,bachelor_units = bachelor_units
			,bedroom1_units = bedroom1_units
			,bedroom2_units = bedroom2_units
			,bedroom3_units = bedroom3_units
			,bachelor_price = bachelor_price
			,bedroom1_price = bedroom1_price
			,bedroom2_price = bedroom2_price
			,bedroom3_price = bedroom3_price
	WHERE cur_sales_record_history.id = recordID;
END$$
DELIMITER ;
