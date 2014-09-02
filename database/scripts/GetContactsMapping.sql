USE cred;
DROP PROCEDURE if EXISTS `GetContactsMappings` ;

DELIMITER $$

CREATE PROCEDURE `GetContactsMappings`(IN contactSearchTerms VARCHAR(128), IN addressSearchTerms VARCHAR(128)
							,IN offsetIndex int, IN recordCount INT, IN orderBy VARCHAR (255), OUT filteredCount INT)
BEGIN
SELECT
	cur_company_address_mapping.id AS 'mapping_id'
	,cur_contacts.id as 'contact_id'
	,cur_contacts.name as 'contact_name'
	,GROUP_CONCAT(DISTINCT cur_phone_numbers.phone_number) as 'phone'
	,cur_contacts.email
	,cur_company.name as 'company_name'
	,cur_company.id as 'company_id'
	,cur_address.id as 'address_id'
	,cur_address.street_number_begin
	,cur_address.street_name
	,cur_address.postal_code
	,cur_address.city
	,cur_address.province	
FROM cur_contacts
	LEFT JOIN cur_phone_numbers ON (cur_phone_numbers.contact_ID = cur_contacts.id)
	INNER JOIN cur_company_address_mapping ON (cur_company_address_mapping.cur_contacts_id = cur_contacts.id)
	LEFT JOIN cur_company on (cur_company.id = cur_company_address_mapping.cur_company_id)
	LEFT JOIN cur_address ON (cur_address.id = cur_company_address_mapping.cur_address_id)
WHERE 
	cur_contacts.is_deleted = 0
	AND (addressSearchTerms IS NULL OR MATCH(street_name,postal_code,city,province) AGAINST (addressSearchTerms IN BOOLEAN MODE))	
	AND (contactSearchTerms IS NULL OR MATCH (cur_contacts.name, cur_contacts.email) AGAINST (contactSearchTerms IN BOOLEAN MODE))
	
GROUP BY cur_contacts.id
LIMIT recordCount OFFSET offsetIndex;
SET filteredCount = FOUND_ROWS();
END$$
DELIMITER ;
