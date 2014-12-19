USE cred;
DROP PROCEDURE if EXISTS `SearchContacts` ;

DELIMITER $$
CREATE PROCEDURE `SearchContacts`(IN contactSearchTerms VARCHAR(128), IN addressSearchTerms VARCHAR(128),IN contactSearch VARCHAR(128)
							,IN offsetIndex int, IN recordCount INT, IN orderBy VARCHAR (255), OUT filteredCount INT)
BEGIN
	SELECT
		SQL_CALC_FOUND_ROWS cur_contacts.id as 'contact_id'
		,cur_contacts.name as 'contact_name'
		,GROUP_CONCAT(DISTINCT cur_phone_numbers.phone_number) as 'phone'
		,cur_contacts.email
		,GROUP_CONCAT(cur_company.name SEPARATOR ',') as 'company'
		,cur_address.street_number_begin
		,cur_address.street_number_end
		,cur_address.street_name
		,cur_address.city
		,cur_address.province
		,cur_address.postal_code
	FROM cur_contacts
	LEFT JOIN cur_phone_numbers ON (cur_phone_numbers.contact_ID = cur_contacts.id)
	LEFT JOIN cur_contact_company_mapping ON (cur_contact_company_mapping.cur_contacts_id = cur_contacts.id)
	LEFT JOIN cur_company ON (cur_company.id = cur_contact_company_mapping.cur_company_id)
	LEFT JOIN cur_company_address_mapping as contact_address ON (contact_address.cur_contact_id = cur_contacts.id)
	LEFT JOIN cur_address ON (cur_address.id = contact_address.cur_address_id)
	WHERE 
		cur_contacts.is_deleted = 0
		AND ((contactSearchTerms IS NULL OR MATCH (cur_contacts.name, cur_contacts.email) AGAINST (contactSearchTerms IN BOOLEAN MODE))
			OR(cur_phone_numbers.phone_number LIKE CONCAT('%',contactSearch,'%')))
		AND (addressSearchTerms IS NULL OR MATCH(cur_address.street_name,cur_address.postal_code,cur_address.city,cur_address.province,cur_address.street_number_begin) 
				AGAINST (addressSearchTerms IN BOOLEAN MODE))
	GROUP BY cur_contacts.id
ORDER BY
	CASE WHEN orderBy='contact_name_asc' THEN contact_name END ASC,
	CASE WHEN orderBy='contact_name_desc' THEN contact_name END DESC,
	CASE WHEN orderBy='phone_asc' THEN cur_phone_numbers.phone_number END ASC,
	CASE WHEN orderBy='phone_desc' THEN cur_phone_numbers.phone_number END DESC,
	CASE WHEN orderBy='email_asc' THEN email END ASC,
	CASE WHEN orderBy='email_desc' THEN email END DESC,
	CASE WHEN orderBy='street_number_begin_asc' THEN cur_address.street_number_begin END ASC,
	CASE WHEN orderBy='street_number_begin_desc' THEN cur_address.street_number_begin END DESC,
	CASE WHEN orderBy='' THEN contact_name END ASC
	LIMIT recordCount OFFSET offsetIndex;
	SET filteredCount = FOUND_ROWS();
END$$
DELIMITER ;