
DROP PROCEDURE if EXISTS `DeleteContact` ;

DELIMITER $$
CREATE PROCEDURE `DeleteContact`(IN contactID INT)
BEGIN
		UPDATE cur_contacts
			SET is_deleted = 1,
			first_name = CONCAT(CONCAT(first_name, '_DELETED_'),NOW()),
			last_name = CONCAT(CONCAT(last_name, '_DELETED_'),NOW())
		WHERE id = contactID;
END$$
DELIMITER ;