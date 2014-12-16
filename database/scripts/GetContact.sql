USE cred;
DROP PROCEDURE if EXISTS `GetContact` ;

DELIMITER $$

CREATE PROCEDURE `GetContact`(IN contactId INT)
BEGIN
SELECT
	
	cur_contacts.id AS 'contact_id'
	,cur_contacts.name AS 'contact_name'
	,cur_contacts.email
	,cur_phone_numbers.phone_number
	,cur_address.id
	,cur_address.street_number_begin
	,cur_address.street_name
	,cur_address.street_number_end
	,cur_address.city
	,cur_address.postal_code
	,cur_address.province
	,cur_address.latitude
	,cur_address.longitude
FROM cur_contacts
LEFT JOIN cur_phone_numbers ON (cur_phone_numbers.contact_ID = cur_contacts.id)
LEFT JOIN cur_company_address_mapping ON ( cur_company_address_mapping.cur_contact_id = cur_contacts.id)
LEFT JOIN cur_address ON (cur_address.id = cur_company_address_mapping.cur_address_id)
WHERE 
	cur_contacts.is_deleted = 0
	AND cur_contacts.id = contactId;
END$$
DELIMITER ;
