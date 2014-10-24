USE `cred`;
DROP procedure IF EXISTS `GetBuildingsById`;

DELIMITER $$
USE `cred`$$
CREATE PROCEDURE `GetBuildingsById`(IN paramBuildingId INT) 
BEGIN
SELECT 
	 SQL_CALC_FOUND_ROWS GROUP_CONCAT(DISTINCT owner_contact.name SEPARATOR ', ') as 'owner'
	,GROUP_CONCAT(DISTINCT owner_company.name SEPARATOR ', ') AS 'owner_company'
	,GROUP_CONCAT(DISTINCT seller_contact.name SEPARATOR ', ') AS 'seller'
	,GROUP_CONCAT(DISTINCT seller_company.name SEPARATOR ', ') AS 'seller_company'
	,GROUP_CONCAT(DISTINCT agent_contact.name SEPARATOR ', ') AS 'agent'
	,GROUP_CONCAT(DISTINCT agent_company.name SEPARATOR ', ') AS 'agent_company'
	,cur_address.street_number_begin
	,cur_address.street_number_end
	,cur_address.street_name 
	,cur_address.postal_code
	,cur_address.city
	,cur_address.province
	,cur_buildings.id as 'building_id'
	,cur_buildings.unit_quantity as 'units'
	,cur_buildings.property_mgmt_company 
	,cur_buildings.prev_property_mgmt_company
	,cur_buildings.sale_date
	,cur_address.latitude
	,cur_address.longitude
	,cur_buildings.windows_installed_year
	,IFNULL(sales_count.num_of_records,0) AS num_of_sales
	,ref_building_type.type 'building_type'
	,cur_buildings.property_mgmt_company
	,cur_buildings.prev_property_mgmt_company
	,ref_heat_system_type.type 'heat_system'
	,cur_buildings.heat_system_age
	,cur_buildings.boiler_installed_year
	,cur_buildings.last_boiler_upgrade_year
	,cur_buildings.cable_internet_provider
	,cur_buildings.has_elevator
	,cur_buildings.elevator_installed_year
	,cur_buildings.last_elevator_upgrade_year
	,cur_buildings.windows_installed_year
	,cur_buildings.parking_spots
	,cur_buildings.assessed_value
	,cur_buildings.mortgage_company
	,cur_buildings.mortgage_due_date
	,cur_buildings.bachelor_price
	,cur_buildings.bedroom1_price
	,cur_buildings.bedroom2_price
	,cur_buildings.bedroom3_price
	,cur_buildings.bachelor_units
	,cur_buildings.bedroom1_units
	,cur_buildings.bedroom2_units
	,cur_buildings.bedroom3_units
	,cur_buildings.unit_quantity
	,cur_buildings.building_income
	,cur_buildings.unit_price
	,cur_buildings.cap_rate
	,cur_buildings.sale_date
	,cur_buildings.last_sale_price
FROM cur_buildings
	INNER JOIN cur_address ON (cur_address.id = cur_buildings.cur_address_id)
	LEFT JOIN cur_owner_seller_property_mapping AS owner_mapping ON (owner_mapping.property_address_id = cur_address.id AND owner_mapping.contact_type_id = 1)
	LEFT JOIN cur_contacts AS owner_contact ON (owner_contact.id = owner_mapping.contact_id AND owner_contact.is_deleted = 0)
	LEFT JOIN cur_company AS owner_company ON (owner_company.id = owner_mapping.company_id AND owner_company.is_deleted = 0)
	LEFT JOIN cur_owner_seller_property_mapping AS seller_mapping ON (seller_mapping.property_address_id = cur_address.id AND seller_mapping.contact_type_id = 2)
	LEFT JOIN cur_contacts AS seller_contact ON (seller_contact.id = seller_mapping.contact_id AND seller_contact.is_deleted = 0)
	LEFT JOIN cur_company AS seller_company ON (seller_company.id = seller_mapping.company_id AND seller_company.is_deleted = 0)
	LEFT JOIN cur_owner_seller_property_mapping AS agent_mapping ON (agent_mapping.property_address_id = cur_address.id AND agent_mapping.contact_type_id = 3)
	LEFT JOIN cur_contacts AS agent_contact on (agent_contact.id = agent_mapping.contact_id AND agent_contact.is_deleted = 0)
	LEFT JOIN cur_company AS agent_company ON (agent_company.id = agent_mapping.company_id AND agent_company.is_deleted = 0)
	LEFT JOIN ref_building_type ON (ref_building_type.id = cur_buildings.ref_building_type_id)
	LEFT JOIN ref_heat_system_type ON (ref_heat_system_type.id = cur_buildings.heat_system_type_id)
	LEFT JOIN (SELECT COUNT(DISTINCT cur_sales_record_history_id) AS 'num_of_records'
				,cur_buildings_id  
				FROM cur_sales_history_contact_mapping 
				GROUP BY cur_buildings_id) AS sales_count ON (sales_count.cur_buildings_id = cur_buildings.id)
WHERE
	cur_buildings.id = paramBuildingId;

END$$

DELIMITER ;

