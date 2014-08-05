USE cred;
DROP PROCEDURE if EXISTS `UpdatePhoneNumber` ;

DELIMITER $$
CREATE PROCEDURE `UpdatePhoneNumber`(IN phoneNumberID INT, IN phoneNumber VARCHAR(64), IN contactID INT)
BEGIN
	UPDATE cur_phone_numbers
		SET phone_number = phoneNumber
		,contact_ID = contactID
	WHERE id = phoneNumberID;
		
END$$
DELIMITER ;
