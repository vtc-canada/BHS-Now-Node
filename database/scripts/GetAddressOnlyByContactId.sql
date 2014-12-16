USE cred;
DROP PROCEDURE if EXISTS `GetAddressOnlyByContactId` ;
DELIMITER $$
CREATE PROCEDURE `GetAddressOnlyByContactId`(IN contactId INT)
BEGIN
	SELECT 
		cur_address.id AS 'address_id'
		,street_number_begin
		,street_number_end
		,street_name
		,postal_code
		,city
		,address_type_id
		,province
		,latitude
		,longitude
	FROM cur_contact
	INNER JOIN cur_company_address_mapping ON (cur_contact.id = cur_company_address_mapping.cur_contact_id)
	INNER JOIN cur_address ON (cur_address.id = cur_company_address_mapping.cur_address_id)
	WHERE cur_contact.id = contactId
	ORDER BY cur_company_address_mapping.id DESC
LIMIT 1;
END$$
DELIMITER ;
