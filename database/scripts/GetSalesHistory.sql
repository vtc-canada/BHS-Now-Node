USE cred;
DROP PROCEDURE if EXISTS `GetSalesHistory` ;

CREATE PROCEDURE `GetSalesHistory`()

DELIMITER $$
SELECT 	
		 cur_contacts.name as 'contact'
		,cur_company.name as 'company'
		,ref_contact_type.type as 'contact_type'
		,cur_address.street_number_begin
		,cur_address.street_name
		,cur_address.street_number_end
		,cur_address.postal_code
		,cur_address.city	
		,cur_address.province
		,cur_buildings.id
		,cur_sales_record_history.sale_price
		,cur_sales_record_history.sale_date
		,cur_sales_record_history.unit_quantity
		,cur_sales_record_history.assessed_value
		,cur_sales_record_history.heat_system_age
		,cur_sales_record_history.windows_installed_year
		,cur_sales_record_history.elevator_installed_year
		,cur_sales_record_history.boiler_installed_year
		,cur_sales_record_history.cable_internet_provider
		,cur_sales_record_history.heat_system_type
		,cur_sales_record_history.property_mgmt_company
FROM cur_sales_record_history
	INNER JOIN cur_sales_history_contact_mapping as mapping ON (mapping.cur_sales_record_history_id = cur_sales_record_history.id)
	LEFT JOIN cur_contacts ON (cur_contacts.id = mapping.contact_id )
	INNER JOIN cur_buildings ON (cur_buildings.id = mapping.cur_buildings_id)
	INNER JOIN cur_address ON (cur_buildings.cur_address_id = cur_address.id)
	LEFT JOIN cur_company ON (cur_company.id = mapping.cur_company_id)
	INNER JOIN ref_contact_type ON (ref_contact_type.id = mapping.ref_contact_type_id)
ORDER BY cur_buildings.id, ref_contact_type.type ASC;
END$$
DELIMITER ;