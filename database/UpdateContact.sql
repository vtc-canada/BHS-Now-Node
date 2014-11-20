DROP PROCEDURE if EXISTS `UpdateContact` ;

DELIMITER $$
CREATE PROCEDURE `UpdateContact`(IN contactID INT, IN firstName VARCHAR(256), IN lastName VARCHAR(256), IN email VARCHAR(64), IN phoneNumber VARCHAR(64))
BEGIN
	UPDATE cur_contacts
		SET first_name = firstName
		,last_name = lastName
		,email = email
		,phone_number = phoneNumber
	WHERE
		id = contactID;
END$$
DELIMITER ;
