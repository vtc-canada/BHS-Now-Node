USE cred;
DROP PROCEDURE if EXISTS `UpdateContact` ;

DELIMITER $$
CREATE PROCEDURE `UpdateContact`(IN contactID INT, IN contactName VARCHAR(256), IN email VARCHAR(64))
BEGIN
	UPDATE cur_contacts
		SET name = contactName
		,email = email
	WHERE
		id = contactID;
END$$
DELIMITER ;
