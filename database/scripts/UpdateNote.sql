USE cred;
DROP PROCEDURE if EXISTS `UpdateNote` ;

DELIMITER $$
CREATE PROCEDURE `UpdateNote`(IN noteID INT, IN note VARCHAR(512), IN user VARCHAR(64), IN timeStamp TIMESTAMP)
BEGIN
	UPDATE cur_notes
		SET note = note
		,user = user
		,timestamp = timeStamp
	WHERE id = noteID;
END$$
DELIMITER ;