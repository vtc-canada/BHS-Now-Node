USE cred;
DROP PROCEDURE if EXISTS `GetBuildingContacts` ;

DELIMITER $$
CREATE PROCEDURE `GetBuildingContacts`(IN buildingID int)
BEGIN
SELECT
	cur_contacts.id as 'contact_id'
	,mapping.id as 'mapping_id'
	,cur_company.id as 'company_id'
	,cur_company.name as 'cur_company_name'
	,ref_contact_type.type as 'contact_type'
	,cur_contacts.name as 'contact_name'	
	,cur_phone_numbers.phone_number as 'phone_number' 
	,cur_contacts.email 
	,company_address.street_number_begin
	,company_address.street_number_end
	,company_address.street_name
	,company_address.postal_code
	,company_address.city
	,company_address.province
FROM 
	cur_buildings
	INNER JOIN cur_address ON (cur_address.id = cur_buildings.cur_address_id)
	INNER JOIN cur_owner_seller_property_mapping AS mapping ON (mapping.property_address_id = cur_address.id)
	LEFT JOIN cur_contacts  ON (cur_contacts.id = mapping.contact_id)
	LEFT JOIN cur_company AS cur_company ON (cur_company.id = mapping.company_id)
	LEFT JOIN cur_company_address_mapping ON (cur_company_address_mapping.cur_company_id = cur_company.id)
	LEFT JOIN cur_address AS company_address ON (company_address.id = cur_company_address_mapping.cur_address_id)
	LEFT JOIN cur_phone_numbers  ON (cur_phone_numbers.contact_ID = cur_contacts.id)
	INNER JOIN ref_contact_type ON (ref_contact_type.id = mapping.contact_type_id)
WHERE 
	cur_buildings.id = buildingID
	AND  (CASE WHEN cur_contacts.id IS NOT NULL THEN cur_contacts.is_deleted = 0 ELSE 1 END)
	AND  (CASE WHEN cur_company.id IS NOT NULL THEN cur_company.is_deleted = 0 ELSE 1 END);
END$$
DELIMITER ;	
