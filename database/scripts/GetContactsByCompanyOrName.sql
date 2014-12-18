USE cred;
DROP PROCEDURE if EXISTS `GetContactsByCompanyOrName` ;

DELIMITER $$

CREATE PROCEDURE `GetContactsByCompanyOrName`(IN contactSearchTerms VARCHAR(128), IN companyID INT)
BEGIN
SELECT 
	cur_contacts.id as 'contact_id'
	,cur_contacts.name as 'contact_name'
	,GROUP_CONCAT(DISTINCT cur_phone_numbers.phone_number) as 'phone_number'
	,cur_contacts.email
	,cur_address.street_number_begin
	,cur_address.street_number_end
	,cur_address.street_name
	,cur_address.postal_code
	,cur_address.city
	,cur_address.province

FROM cur_contacts
	LEFT JOIN cur_phone_numbers ON (cur_phone_numbers.contact_ID = cur_contacts.id)
	LEFT JOIN cur_contact_company_mapping ON (cur_contact_company_mapping.cur_contacts_id = cur_contacts.id)
	LEFT JOIN cur_company ON (cur_company.id = cur_contact_company_mapping.cur_company_id)
	LEFT JOIN cur_company_address_mapping ON (cur_company_address_mapping.cur_contact_id = cur_contacts.id)
	LEFT JOIN cur_address ON (cur_address.id = cur_company_address_mapping.cur_address_id)
WHERE (cur_company.id = companyID OR companyID IS NULL)
	AND (contactSearchTerms IS NULL OR MATCH(cur_contacts.name, cur_contacts.email) AGAINST (contactSearchTerms IN BOOLEAN MODE))
	AND cur_contacts.is_deleted = 0
GROUP BY cur_contacts.id
LIMIT 10;
END$$
DELIMITER ;
