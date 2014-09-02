USE cred;
DROP PROCEDURE if EXISTS `GetContact` ;

DELIMITER $$

CREATE PROCEDURE `GetContact`(IN contactId INT)
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
	AND cur_contacts.id = contactId;
END$$
DELIMITER ;
