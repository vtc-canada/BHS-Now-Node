USE cred;
DROP PROCEDURE if EXISTS `GetBuildingContacts` ;

DELIMITER $$
CREATE PROCEDURE `GetBuildingContacts`(IN buildingID int)

SELECT
	cur_company.name as 'cur_company_name'
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
	cur_buildings
	INNER JOIN cur_address ON (cur_address.id = cur_buildings.cur_address_id)
	INNER JOIN cur_owner_seller_property_mapping AS mapping ON (mapping.property_address_id = cur_address.id)
	LEFT JOIN cur_contacts  ON (cur_contacts.id = mapping.contact_id)
	LEFT JOIN cur_company AS cur_company ON (cur_company.id = mapping.company_id)	
	LEFT JOIN cur_phone_numbers  ON (cur_phone_numbers.contact_ID = cur_contacts.id)
	INNER JOIN ref_contact_type ON (ref_contact_type.id = mapping.contact_type_id)
WHERE 
	cur_buildings.id = buildingID
GROUP BY	
	cur_contacts.id;
END$$
DELIMITER ;	