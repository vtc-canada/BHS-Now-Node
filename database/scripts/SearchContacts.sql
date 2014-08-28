USE cred;
DROP PROCEDURE if EXISTS `SearchContacts` ;

DELIMITER $$
CREATE PROCEDURE `SearchContacts`(IN contactSearchTerms VARCHAR(128)
							,IN offsetIndex int, IN recordCount INT, IN orderBy VARCHAR (255), OUT filteredCount INT)
BEGIN
	SELECT
		SQL_CALC_FOUND_ROWS cur_contacts.id as 'contact_id'
		,cur_contacts.name as 'contact_name'
		,GROUP_CONCAT(DISTINCT cur_phone_numbers.phone_number) as 'phone'
		,cur_contacts.email
		
	FROM cur_contacts
		LEFT JOIN cur_phone_numbers ON (cur_phone_numbers.contact_ID = cur_contacts.id)
		WHERE 
		cur_contacts.is_deleted = 0
		AND (contactSearchTerms IS NULL OR MATCH (cur_contacts.name, cur_contacts.email) AGAINST (contactSearchTerms IN BOOLEAN MODE))
		
	GROUP BY cur_contacts.id
	LIMIT recordCount OFFSET offsetIndex;
	SET filteredCount = FOUND_ROWS();
END$$
DELIMITER ;