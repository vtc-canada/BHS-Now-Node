DROP PROCEDURE if EXISTS `GetContactsByName` ;

DELIMITER $$

CREATE PROCEDURE `GetContactsByName`(IN contactSearchTerms VARCHAR(128))
BEGIN
SELECT
	
	cur_contacts.id AS 'contact_id'
	,cur_contacts.first_name AS 'first_name'
	,cur_contacts.last_name AS 'last_name'
	,cur_contacts.last_name AS 'contact_name'
	,cur_contacts.email
	,cur_contacts.phone_number
FROM cur_contacts
WHERE 
	cur_contacts.is_deleted = 0
AND (contactSearchTerms IS NULL OR cur_contacts.last_name LIKE CONCAT('%', contactSearchTerms, '%') OR cur_contacts.first_name LIKE CONCAT('%', contactSearchTerms, '%'))
LIMIT 10;
END$$
DELIMITER ;
