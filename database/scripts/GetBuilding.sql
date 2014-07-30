USE cred;
DROP PROCEDURE if EXISTS `GetBuilding` ;

CREATE PROCEDURE `GetBuilding`(IN buildingID int)

SELECT 
	cur_address.street_number_begin
	,cur_address.street_number_end
	,cur_address.street_name
	,cur_address.postal_code
	,cur_address.city
	,cur_address.province
	,ref_building_type.type as 'building_type'
	,cur_buildings.property_mgmt_company
	,cur_buildings.prev_property_mgmt_company
	,ref_heat_system_type.type as 'heat_system'
	,cur_buildings.heat_system_age
	,ref_window_type.type as 'windows'
	,cur_buildings.windows_age
	,ref_elevator_type.type as 'elevators'
	,cur_buildings.elevators_age
	,ref_boiler_type.type as 'boilers'
	,cur_buildings.boiler_age
	,cur_buildings.cable_internet_provider
	,cur_buildings.unit_quantity
	,cur_buildings.assessed_value
	,cur_buildings.unit_pricing
	,cur_buildings.last_sale_price
	,cur_buildings.sale_date
	
FROM
	cur_buildings
	INNER JOIN cur_address ON (cur_address.id = cur_buildings.cur_address_id)
	LEFT JOIN ref_building_type ON (cur_buildings.ref_building_type_id = ref_building_type.id)
	LEFT JOIN ref_heat_system_type ON (ref_heat_system_type.id = cur_buildings.heat_system_type_id)
	LEFT JOIN ref_window_type ON (ref_window_type.id = cur_buildings.window_type_id)
	LEFT JOIN ref_elevator_type ON (ref_elevator_type.id = cur_buildings.elevator_type_id)
	LEFT JOIN ref_boiler_type ON (ref_boiler_type.id = cur_buildings.boiler_type_id)

WHERE
	cur_buildings.id = buildingID;
