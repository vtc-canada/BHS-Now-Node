DROP PROCEDURE if EXISTS `GetContactsCount` ;

DELIMITER $$

CREATE PROCEDURE `GetContactsCount`()
BEGIN
SELECT
	COUNT(*) as 'number_of_contact_mappings'
FROM cur_contacts
WHERE 
	cur_contacts.is_deleted = 0;
END$$
DELIMITER ;
