USE cred;
DROP PROCEDURE if EXISTS `GetContactById` ;

DELIMITER $$
CREATE PROCEDURE `GetContactById`(IN companyId INT(11))
BEGIN
SELECT 
		cur_contacts.id as 'contact_id'
		,cur_contacts.name as 'contact_name'
		,cur_contacts.email as 'email'
		,cur_phone_numbers.phone_number
FROM cur_contacts
	LEFT JOIN cur_phone_numbers ON (cur_phone_numbers.contact_ID = cur_contacts.id)
WHERE  
cur_contacts.id = companyId;
END$$
DELIMITER ; 
