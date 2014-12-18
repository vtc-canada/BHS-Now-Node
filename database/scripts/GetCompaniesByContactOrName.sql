USE cred;
DROP PROCEDURE if EXISTS `GetCompaniesByContactOrName` ;

DELIMITER $$
CREATE PROCEDURE `GetCompaniesByContactOrName`(IN companySearchTerms VARCHAR(128), IN contactID INT)
BEGIN
SELECT 
		DISTINCT
		cur_company.id as 'company_id'
		,cur_company.name as 'company_name'
		,cur_company.phone_number
		,cur_address.street_number_begin
		,cur_address.street_number_end
		,cur_address.street_name	
		,cur_address.postal_code
		,cur_address.city
		,cur_address.province
FROM cur_company_address_mapping as mapping
LEFT JOIN cur_company ON (cur_company.id = mapping.cur_company_id)
LEFT JOIN cur_contact_company_mapping ON (cur_contact_company_mapping.cur_company_id = cur_company.id)
LEFT JOIN cur_contacts ON (cur_contact_company_mapping.cur_contacts_id = cur_contacts.id)
LEFT JOIN cur_address ON (cur_address.id = mapping.cur_address_id)
WHERE (cur_contacts.id = contactID OR contactID IS NULL)
	AND (companySearchTerms IS NULL OR MATCH(cur_company.name) AGAINST (companySearchTerms IN BOOLEAN MODE))
	AND (CASE WHEN cur_contacts.id IS NOT NULL AND contactID IS NOT NULL THEN cur_contacts.is_deleted = 0 ELSE 1 END)
	AND cur_company.is_deleted = 0
ORDER BY cur_company.name
LIMIT 10;
END$$
DELIMITER ; 
