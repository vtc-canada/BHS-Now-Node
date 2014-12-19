USE cred;
DROP PROCEDURE if EXISTS `GetBuildingSaleContacts` ;

DELIMITER $$
CREATE PROCEDURE `GetBuildingSaleContacts`(IN buildingID INT, IN saleID INT )
BEGIN
SELECT
	cur_sales_history_contact_mapping.contact_id
	,cur_sales_history_contact_mapping.id as 'mapping_id'
	,cur_sales_history_contact_mapping.cur_company_id as 'company_id'
	,cur_company.name as 'cur_company_name'
	,cur_company.phone_number as 'company_phone_number'
	,ref_contact_type.type as 'contact_type'
	,cur_contacts.name as 'contact_name'	
	,cur_phone_numbers.phone_number as 'phone_number' 
	,cur_contacts.email 
	,cur_address.street_number_begin
	,cur_address.street_number_end
	,cur_address.street_name
	,cur_address.postal_code
	,cur_address.city
	,cur_address.province
	,contact_address.street_number_begin as contact_street_number_begin
	,contact_address.street_number_end as contact_street_number_end
	,contact_address.street_name as contact_street_name
	,contact_address.postal_code as contact_postal_code
	,contact_address.city as contact_city
	,contact_address.province as contact_province
FROM 
	cur_sales_history_contact_mapping
	LEFT JOIN cur_company ON (cur_company.id = cur_sales_history_contact_mapping.cur_company_id)
	LEFT JOIN ref_contact_type ON (ref_contact_type.id = cur_sales_history_contact_mapping.ref_contact_type_id)
	LEFT JOIN cur_contacts  ON (cur_contacts.id = cur_sales_history_contact_mapping.contact_id)	
	LEFT OUTER JOIN cur_phone_numbers  ON (cur_phone_numbers.contact_ID = cur_sales_history_contact_mapping.contact_id)
	INNER JOIN cur_buildings ON (cur_buildings.id = cur_sales_history_contact_mapping.cur_buildings_id)
	LEFT JOIN cur_company_address_mapping ON (cur_company_address_mapping.cur_company_id = cur_sales_history_contact_mapping.cur_company_id)
	LEFT JOIN cur_address ON (cur_address.id = cur_company_address_mapping.cur_address_id)
	LEFT JOIN cur_company_address_mapping AS cur_contact_address_mapping ON (cur_contact_address_mapping.cur_contact_id = cur_contacts.id)
	LEFT JOIN cur_address AS contact_address ON (contact_address.id = cur_contact_address_mapping.cur_address_id)
WHERE 
	cur_buildings.id = buildingID
	AND cur_sales_history_contact_mapping.cur_sales_record_history_id = saleID
	AND cur_buildings.is_deleted = 0
	AND (cur_sales_history_contact_mapping.contact_id IS NOT NULL OR cur_sales_history_contact_mapping.cur_company_id IS NOT NULL)
	AND  (CASE WHEN cur_contacts.id IS NOT NULL THEN cur_contacts.is_deleted = 0 ELSE 1 END)
	AND  (CASE WHEN cur_company.id IS NOT NULL THEN cur_company.is_deleted = 0 ELSE 1 END);
END$$
DELIMITER ;	
