USE cred;
DROP PROCEDURE if EXISTS `GetBuilding` ;

DELIMITER $$
CREATE PROCEDURE `GetBuilding`(IN buildingID int)
BEGIN
SELECT
	cur_buildings.id as 'building_id'
	,cur_address.id as 'address_id'
	,cur_address.street_number_begin
	,cur_address.street_number_end
	,cur_address.street_name
	,cur_address.postal_code
	,cur_address.city
	,cur_address.province
	,cur_address.latitude
	,cur_address.longitude
	,ref_building_type.id as 'building_type'
	,cur_buildings.property_mgmt_company
	,cur_buildings.prev_property_mgmt_company
	,ref_heat_system_type.id as 'heat_system_type'
	,cur_buildings.heat_system_age
	,cur_buildings.windows_installed_year
	,cur_buildings.elevator_installed_year
	,cur_buildings.boiler_installed_year
	,cur_buildings.cable_internet_provider
	,cur_buildings.bachelor_price
	,cur_buildings.bachelor_units
	,cur_buildings.bedroom1_price
	,cur_buildings.bedroom1_units
	,cur_buildings.bedroom2_price
	,cur_buildings.bedroom2_units
	,cur_buildings.bedroom3_price
	,cur_buildings.bedroom3_units
	,cur_buildings.assessed_value
	,cur_buildings.building_income
	,cur_buildings.building_income_manual_mode
	,cur_buildings.unit_price
	,cur_buildings.unit_price_manual_mode
	,cur_buildings.unit_quantity
	,cur_buildings.last_sale_price
	,cur_buildings.sale_date
	,cur_buildings.images
	,cur_buildings.has_elevator
	,cur_buildings.last_elevator_upgrade_year
	,cur_buildings.last_boiler_upgrade_year
	,cur_buildings.mortgage_company
	,cur_buildings.mortgage_due_date
	,cur_buildings.cap_rate
	
FROM
	cur_buildings
	INNER JOIN cur_address ON (cur_address.id = cur_buildings.cur_address_id)
	LEFT JOIN ref_building_type ON (cur_buildings.ref_building_type_id = ref_building_type.id)
	LEFT JOIN ref_heat_system_type ON (ref_heat_system_type.id = cur_buildings.heat_system_type_id)

WHERE
	cur_buildings.id = buildingID
	AND cur_buildings.is_deleted = 0;
END$$
DELIMITER ;