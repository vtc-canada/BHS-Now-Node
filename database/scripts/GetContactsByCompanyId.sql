USE cred;
DROP PROCEDURE if EXISTS `GetContactsByCompanyId` ;

DELIMITER $$
CREATE PROCEDURE `GetContactsByCompanyId`(IN companyId INT(11))
BEGIN
SELECT 
		cur_contacts.id as 'contact_id'
		,cur_contacts.name as 'contact_name'
		,cur_contacts.email as 'email'
		,cur_phone_numbers.phone_number
FROM cur_contacts
	INNER JOIN cur_contact_company_mapping ON (cur_contact_company_mapping.cur_contacts_id = cur_contacts.id)
	INNER JOIN cur_company ON (cur_company.id = cur_contact_company_mapping.cur_company_id)
	LEFT JOIN cur_phone_numbers ON (cur_phone_numbers.contact_ID = cur_contacts.id)
WHERE  
cur_contact_company_mapping.cur_company_id = companyId;
END$$
DELIMITER ; 
