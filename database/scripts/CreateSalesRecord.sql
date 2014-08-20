USE cred;
DROP PROCEDURE if EXISTS `CreateSalesRecord` ;

DELIMITER $$
CREATE PROCEDURE `CreateSalesRecord`(IN salePrice FLOAT,IN saleDate DATETIME, IN heatSystemAge INT, IN windowsInstalledYear INT, 
		IN elevatorInstalledYear INT, IN boilerInstalledYear INT, IN cableInternetProvider VARCHAR(45), IN assessedValue FLOAT, 
		IN heatSystemType VARCHAR(45),IN unitQuantity INT, IN unitPrice INT, IN bachelorPrice FLOAT, IN bedroom1Price FLOAT, IN bedroom2Price FLOAT, IN bedroom3Price FLOAT, IN bachelorUnits INT, IN bedroom1Units INT
		,IN bedroom2Units INT, IN bedroom3Units INT, IN propertyMgmtCompany VARCHAR(45), OUT id INT)
BEGIN
	INSERT INTO cur_sales_record_history(sale_price,sale_date,heat_system_age,windows_installed_year,elevator_installed_year,boiler_installed_year
		,cable_internet_provider,assessed_value,heat_system_type,unit_quantity,unit_price,bachelor_price,bedroom1_price,bedroom2_price,bedroom3_price 
		,bachelor_units ,bedroom1_units ,bedroom2_units ,bedroom3_units,property_mgmt_company) 
		VALUES (salePrice, saleDate, heatSystemAge, windowsInstalledYear, elevatorInstalledYear, boilerInstalledYear, cableInternetProvider
		,assessedValue, heatSystemType, unitQuantity, unitPrice, bachelorPrice,bedroom1Price,bedroom2Price,bedroom3Price,bachelorUnits,bedroom1Units,bedroom2Units,bedroom3Units, propertyMgmtCompany);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;
