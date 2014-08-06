USE cred;
DROP PROCEDURE if EXISTS `GetContactsByCompanyID` ;

DELIMITER $$

CREATE PROCEDURE `GetContactsByCompanyID`(IN companyID INT)
BEGIN
SELECT 
	cur_contacts.id as 'contact_id'
	,cur_contacts.name as 'contact'
	,GROUP_CONCAT(DISTINCT cur_phone_numbers.phone_number) as 'phone_number'
	,cur_contacts.email
FROM cur_contacts
	LEFT JOIN cur_phone_numbers ON (cur_phone_numbers.contact_ID = cur_contacts.id)
	LEFT JOIN cur_company_address_mapping ON (cur_company_address_mapping.cur_contacts_id = cur_contacts.id)
	LEFT JOIN cur_company on (cur_company.id = cur_company_address_mapping.cur_company_id)
	LEFT JOIN cur_address ON (cur_address.id = cur_company_address_mapping.cur_address_id)
WHERE cur_company.id = companyID
GROUP BY cur_contacts.id;
END$$
DELIMITER ;
