USE cred;
DROP PROCEDURE if EXISTS `GetBuildingContacts` ;

CREATE PROCEDURE `GetBuildingContacts`(IN buildingID int)

SELECT
	owner_company.name as 'owner_company_name'
	,owner_contact.name as 'owner_name'	
	,owner_phone.phone_number as 'owner_phone'
	,owner_contact.email as 'owner_email'
	,cur_address.street_number_begin
	,cur_address.street_number_end
	,cur_address.street_name
	,cur_address.postal_code
	,cur_address.city
	,cur_address.province
	,seller_company.name as 'seller_company_name'
	,seller_contact.name as 'seller_name'	
	,seller_phone.phone_number as 'seller_phone'
	,seller_contact.email as 'seller_email'

FROM 
	cur_buildings
	INNER JOIN cur_address ON (cur_address.id = cur_buildings.cur_address_id)
	INNER JOIN cur_owner_seller_property_mapping AS mapping ON (mapping.property_address_id = cur_address.id)
	LEFT JOIN cur_contacts AS owner_contact ON (owner_contact.id = mapping.owner_contact_id)
	LEFT JOIN cur_company AS owner_company ON (owner_company.id = mapping.owner_company_id)	
	LEFT JOIN cur_phone_numbers AS owner_phone ON (owner_phone.contact_ID = owner_contact.id)
	LEFT JOIN cur_contacts AS seller_contact ON (seller_contact.id = mapping.seller_contact_id)
	LEFT JOIN cur_company AS seller_company ON (seller_company.id = mapping.seller_company_id)	
	LEFT JOIN cur_phone_numbers AS seller_phone ON (seller_phone.contact_ID = seller_contact.id)
WHERE 
	cur_buildings.id = buildingID