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
	,ref_contact_type.type as 'contact_type'
	,cur_contacts.name as 'contact_name'	
	,GROUP_CONCAT(DISTINCT cur_phone_numbers.phone_number) as 'phone_number' 
	,cur_contacts.email 
	,cur_address.street_number_begin
	,cur_address.street_number_end
	,cur_address.street_name
	,cur_address.postal_code
	,cur_address.city
	,cur_address.province
FROM 
	cur_sales_history_contact_mapping
	LEFT JOIN cur_company ON (cur_company.id = cur_sales_history_contact_mapping.cur_company_id)
	LEFT JOIN ref_contact_type ON (ref_contact_type.id = cur_sales_history_contact_mapping.ref_contact_type_id)
	INNER JOIN cur_contacts  ON (cur_contacts.id = cur_sales_history_contact_mapping.contact_id)	
	LEFT OUTER JOIN cur_phone_numbers  ON (cur_phone_numbers.contact_ID = cur_sales_history_contact_mapping.contact_id)
	INNER JOIN cur_buildings ON (cur_buildings.id = cur_sales_history_contact_mapping.cur_buildings_id)
	INNER JOIN cur_address ON (cur_address.id = cur_buildings.cur_address_id)
WHERE 
	cur_buildings.id = buildingID
	AND cur_sales_history_contact_mapping.cur_sales_record_history_id = saleID
	AND cur_buildings.is_deleted = 0
	AND cur_contacts.is_deleted = 0
GROUP BY cur_sales_history_contact_mapping.contact_id;
END$$
DELIMITER ;	
