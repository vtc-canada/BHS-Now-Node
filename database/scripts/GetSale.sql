USE cred;
DROP PROCEDURE if EXISTS `GetSale` ;

DELIMITER $$
CREATE PROCEDURE `GetSale`(IN saleID INT)
BEGIN
	SELECT
	cur_sales_record_history.id
	,ref_building_type.id as 'building_type'
	,cur_sales_record_history.property_mgmt_company
	,cur_sales_record_history.prev_property_mgmt_company
	,ref_heat_system_type.id as 'heat_system_type'
	,cur_sales_record_history.heat_system_age
	,cur_sales_record_history.windows_installed_year
	,cur_sales_record_history.elevator_installed_year
	,cur_sales_record_history.boiler_installed_year
	,cur_sales_record_history.cable_internet_provider
	,cur_sales_record_history.bachelor_price
	,cur_sales_record_history.bachelor_units
	,cur_sales_record_history.bedroom1_price
	,cur_sales_record_history.bedroom1_units
	,cur_sales_record_history.bedroom2_price
	,cur_sales_record_history.bedroom2_units
	,cur_sales_record_history.bedroom3_price
	,cur_sales_record_history.bedroom3_units
	,cur_sales_record_history.assessed_value
	,cur_sales_record_history.building_income
	,cur_sales_record_history.building_income_manual_mode
	,cur_sales_record_history.unit_price
	,cur_sales_record_history.unit_price_manual_mode
	,cur_sales_record_history.unit_quantity
	,cur_sales_record_history.sale_price as 'last_sale_price'
	,cur_sales_record_history.sale_date
	,cur_sales_record_history.has_elevator
	,cur_sales_record_history.last_elevator_upgrade_year
	,cur_sales_record_history.last_boiler_upgrade_year
	,cur_sales_record_history.mortgage_company
	,cur_sales_record_history.mortgage_due_date
	,cur_sales_record_history.cap_rate
	FROM
		cur_sales_record_history
	LEFT JOIN ref_building_type ON (cur_sales_record_history.ref_building_type_id = ref_building_type.id)
	LEFT JOIN ref_heat_system_type ON (ref_heat_system_type.id = cur_sales_record_history.heat_system_type_id)

	WHERE
		cur_sales_record_history.id = saleID;
END$$
DELIMITER ;	
