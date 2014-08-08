USE cred;
DROP PROCEDURE if EXISTS `DeleteNote` ;

DELIMITER $$
CREATE PROCEDURE `DeleteNote`(IN noteID INT)
BEGIN
		UPDATE cur_notes
			SET is_deleted = 1
		WHERE id = noteID;
END$$
DELIMITER ;