USE cred;
DROP PROCEDURE if EXISTS `SearchContacts` ;

DELIMITER $$
CREATE PROCEDURE `SearchContacts`(IN contactSearchTerms VARCHAR(128), IN unManipulatedContactSearch VARCHAR(128)
							,IN offsetIndex int, IN recordCount INT, IN orderBy VARCHAR (255), OUT filteredCount INT)
BEGIN
	SELECT
		SQL_CALC_FOUND_ROWS cur_contacts.id as 'contact_id'
		,cur_contacts.name as 'contact_name'
		,GROUP_CONCAT(DISTINCT cur_phone_numbers.phone_number) as 'phone'
		,cur_contacts.email
		,GROUP_CONCAT(cur_company.name SEPARATOR ',') as 'company'
	FROM cur_contacts
	LEFT JOIN cur_phone_numbers ON (cur_phone_numbers.contact_ID = cur_contacts.id)
	LEFT JOIN cur_contact_company_mapping ON (cur_contact_company_mapping.cur_contacts_id = cur_contacts.id)
	LEFT JOIN cur_company ON (cur_company.id = cur_contact_company_mapping.cur_company_id)
	WHERE 
		cur_contacts.is_deleted = 0
		AND 
		(		
(contactSearchTerms IS NULL OR MATCH (cur_contacts.name, cur_contacts.email) AGAINST (contactSearchTerms IN BOOLEAN MODE))
		OR
(cur_phone_numbers.phone_number LIKE CONCAT('%',unManipulatedContactSearch,'%'))
		)
		
	GROUP BY cur_contacts.id
ORDER BY
	CASE WHEN orderBy='contact_name_asc' THEN contact_name END ASC,
	CASE WHEN orderBy='contact_name_desc' THEN contact_name END DESC,
	CASE WHEN orderBy='phone_asc' THEN phone_number END ASC,
	CASE WHEN orderBy='phone_desc' THEN phone_number END DESC,
	CASE WHEN orderBy='email_asc' THEN email END ASC,
	CASE WHEN orderBy='email_desc' THEN email END DESC,
	CASE WHEN orderBy='' THEN contact_name END ASC
	LIMIT recordCount OFFSET offsetIndex;
	SET filteredCount = FOUND_ROWS();
END$$
DELIMITER ;