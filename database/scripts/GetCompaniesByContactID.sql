USE cred;
DROP PROCEDURE if EXISTS `GetCompaniesByContactID` ;

DELIMITER $$
CREATE PROCEDURE `GetCompaniesByContactID`(IN contactID INT)
BEGIN
SELECT 
		cur_company.id as 'company_id'
		,cur_company.name as 'company_name'
		,cur_address.street_number_begin
		,cur_address.street_name	
		,cur_address.postal_code
		,cur_address.city
		,cur_address.province
FROM cur_company_address_mapping as mapping
LEFT JOIN cur_company ON (cur_company.id = mapping.cur_company_id)
LEFT JOIN cur_contacts ON (mapping.cur_contacts_id = cur_contacts.id)
LEFT JOIN cur_address ON (cur_address.id = mapping.cur_address_id)
WHERE cur_contacts.id = contactID;
END$$
DELIMITER ;
