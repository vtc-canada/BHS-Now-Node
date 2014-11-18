USE cred;
DROP PROCEDURE if EXISTS `GetPhoneNumberByContactId` ;

DELIMITER $$
CREATE PROCEDURE `GetPhoneNumberByContactId`(IN contactID INT)
BEGIN
	SELECT id,phone_number, contact_ID, last_modified
FROM
cur_phone_numbers
	WHERE contact_ID = contactID;
		
END$$
DELIMITER ;
