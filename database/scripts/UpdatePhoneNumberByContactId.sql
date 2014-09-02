USE cred;
DROP PROCEDURE if EXISTS `UpdatePhoneNumberByContactId` ;

DELIMITER $$
CREATE PROCEDURE `UpdatePhoneNumberByContactId`(IN contactID INT, IN phoneNumber VARCHAR(64))
BEGIN
	UPDATE cur_phone_numbers
		SET phone_number = phoneNumber
	WHERE id = contactID;
		
END$$
DELIMITER ;
