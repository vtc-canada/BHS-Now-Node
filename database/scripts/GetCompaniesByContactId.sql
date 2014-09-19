USE cred;
DROP PROCEDURE if EXISTS `GetCompaniesByContactId` ;

DELIMITER $$
CREATE PROCEDURE `GetCompaniesByContactId`(IN contactId INT(11))
BEGIN
SELECT 
		cur_company.id as 'company_id'
		,cur_company.name as 'company_name'
		,cur_address.street_number_begin
		,cur_address.street_number_end
		,cur_address.street_name	
		,cur_address.postal_code
		,cur_address.city
		,cur_address.province
FROM cur_company
	LEFT JOIN cur_company_address_mapping ON (cur_company_address_mapping.cur_company_id = cur_company.id)
	LEFT JOIN cur_address ON (cur_address.id = cur_company_address_mapping.cur_address_id)
	INNER JOIN cur_contact_company_mapping ON (cur_contact_company_mapping.cur_company_id = cur_company.id AND cur_company.is_deleted = 0)
WHERE  
cur_contact_company_mapping.cur_contacts_id = contactId;
END$$
DELIMITER ; 
