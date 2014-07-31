USE cred;
DROP PROCEDURE if EXISTS `CreatePhoneNumber` ;

DELIMITER $$
CREATE PROCEDURE `CreatePhoneNumber`(IN phoneNumber VARCHAR(64), IN contactID INT, OUT id INT)
BEGIN
	INSERT INTO `cur_phone_numbers`(`phone_number`,`contact_ID`) VALUES (phoneNumber,contactID);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;
