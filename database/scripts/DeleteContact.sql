USE cred;
DROP PROCEDURE if EXISTS `DeleteContact` ;

DELIMITER $$
CREATE PROCEDURE `DeleteContact`(IN contactID INT)
BEGIN
		UPDATE cur_contacts
			SET is_deleted = 1
		WHERE id = contactID;
END$$
DELIMITER ;