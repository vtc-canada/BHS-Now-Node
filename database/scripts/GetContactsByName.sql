USE cred;
DROP PROCEDURE if EXISTS `GetContactsByName` ;

DELIMITER $$

CREATE PROCEDURE `GetContactsByName`(IN contactSearchTerms VARCHAR(128))
BEGIN
SELECT
	
	cur_contacts.id AS 'contact_id'
	,cur_contacts.name AS 'contact_name'
	,cur_contacts.email
	,cur_phone_numbers.phone_number
FROM cur_contacts
LEFT JOIN cur_phone_numbers ON (cur_phone_numbers.contact_ID = cur_contacts.id)
WHERE 
	cur_contacts.is_deleted = 0
AND (contactSearchTerms IS NULL OR cur_contacts.name LIKE CONCAT('%', contactSearchTerms, '%'))
LIMIT 10;
END$$
DELIMITER ;
