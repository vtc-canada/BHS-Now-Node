DROP PROCEDURE if EXISTS `SearchContacts` ;

DELIMITER $$
CREATE PROCEDURE `SearchContacts`(IN contactSearchTerms VARCHAR(128), IN companySearchTerms VARCHAR(128)
							,IN offsetIndex int, IN recordCount INT, IN orderBy VARCHAR (255), OUT filteredCount INT)
BEGIN
	SELECT
		SQL_CALC_FOUND_ROWS cur_contacts.id as 'contact_id'
		,CONCAT_WS(' ',CONCAT_WS(', ',cur_contacts.last_name,cur_contacts.first_name), cur_contacts.middle_name) as 'contact_name'
		,cur_contacts.phone_number as 'phone'
		,cur_contacts.email
		,cur_contacts.date_of_birth
		,cur_contacts.drivers_license
		,cur_contacts.passport_no
		,cur_contacts.nationality
		,cur_company.name as 'company'
		,cur_contacts.id
		,cur_contacts.gender
	FROM cur_contacts
	LEFT JOIN cur_contact_company_mapping ON (cur_contact_company_mapping.cur_contacts_id = cur_contacts.id)
	LEFT JOIN cur_company ON (cur_company.id = cur_contact_company_mapping.cur_company_id and cur_company.is_deleted = 0)
	WHERE 
		cur_contacts.is_deleted = 0
		AND (contactSearchTerms IS NULL OR MATCH (cur_contacts.first_name,cur_contacts.last_name,cur_contacts.middle_name
				,cur_contacts.email, cur_contacts.phone_number,cur_contacts.nationality, cur_contacts.gender) AGAINST (contactSearchTerms IN BOOLEAN MODE))
		AND (companySearchTerms IS NULL OR MATCH (cur_company.name) AGAINST (companySearchTerms IN BOOLEAN MODE))

#OR (contactSearchTerms IS NULL OR cur_company.name LIKE CONCAT('%', unconditionedTerm, '%')))	
	GROUP BY cur_contacts.id
ORDER BY
	CASE WHEN orderBy='contact_name_asc' THEN last_name END ASC,
	CASE WHEN orderBy='contact_name_desc' THEN last_name END DESC,
	CASE WHEN orderBy='company_asc' THEN cur_company.name END ASC,
	CASE WHEN orderBy='company_desc' THEN cur_company.name  END DESC,
	CASE WHEN orderBy='phone_asc' THEN cur_contacts.phone_number END ASC,
	CASE WHEN orderBy='phone_desc' THEN cur_contacts.phone_number END DESC,
	CASE WHEN orderBy='email_asc' THEN email END ASC,
	CASE WHEN orderBy='email_desc' THEN email END DESC,
	CASE WHEN orderBy='' THEN contact_name END ASC
	LIMIT recordCount OFFSET offsetIndex;
	SET filteredCount = FOUND_ROWS();
END$$
DELIMITER ;