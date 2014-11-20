DROP PROCEDURE if EXISTS `GetContact` ;

DELIMITER $$

CREATE PROCEDURE `GetContact`(IN contactId INT)
BEGIN
SELECT
	
	cur_contacts.id AS 'contact_id'
	,cur_contacts.first_name AS 'first_name'
	,cur_contacts.last_name AS 'last_name'
	,cur_contacts.email
	,cur_contacts.phone_number
FROM cur_contacts
WHERE 
	cur_contacts.is_deleted = 0
	AND cur_contacts.id = contactId;
END$$
DELIMITER ;
