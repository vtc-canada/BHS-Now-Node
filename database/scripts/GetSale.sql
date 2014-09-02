USE cred;
DROP PROCEDURE if EXISTS `GetSale` ;

DELIMITER $$
CREATE PROCEDURE `GetSale`(IN saleID INT)
BEGIN
	SELECT
		cur_sales_record_history.id
		,cur_sales_record_history.sale_price
		,cur_sales_record_history.sale_date
		,cur_sales_record_history.heat_system_age
		,cur_sales_record_history.windows_installed_year
		,cur_sales_record_history.elevator_installed_year
		,cur_sales_record_history.boiler_installed_year
		,cur_sales_record_history.cable_internet_provider
		,cur_sales_record_history.assessed_value
		,cur_sales_record_history.heat_system_type
		,cur_sales_record_history.property_mgmt_company
		,cur_sales_record_history.bachelor_price
		,cur_sales_record_history.bedroom1_price
		,cur_sales_record_history.bedroom2_price
		,cur_sales_record_history.bedroom3_price
		,cur_sales_record_history.bachelor_units
		,cur_sales_record_history.bedroom1_units
		,cur_sales_record_history.bedroom2_units
		,cur_sales_record_history.bedroom2_units
		,cur_sales_record_history.bedroom3_units
		,cur_sales_record_history.unit_quantity
		,cur_sales_record_history.unit_price
	FROM
		cur_sales_record_history
	WHERE
		cur_sales_record_history.id = saleID;
END$$
DELIMITER ;	
