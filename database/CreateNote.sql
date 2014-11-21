DROP PROCEDURE if EXISTS `CreateNote` ;

DELIMITER $$
CREATE PROCEDURE `CreateNote`(IN note VARCHAR(512), IN user VARCHAR(64), IN timeStamp TIMESTAMP,OUT id INT)
BEGIN
	INSERT INTO cur_notes(note,user,timestamp,is_deleted) VALUES (note, user, timeStamp, false);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;