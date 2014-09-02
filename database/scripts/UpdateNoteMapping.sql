USE cred;
DROP PROCEDURE if EXISTS `UpdateNoteMapping` ;

DELIMITER $$
CREATE PROCEDURE `UpdateNoteMapping`(IN mappingID INT, IN entityID INT, IN noteID INT, IN entityType INT)
BEGIN
	UPDATE cur_note_mapping
		SET entity_id = entityID
		,cur_notes_id = noteID
		,ref_entity_type_id = entityType
	WHERE id = mappingID;
END$$
DELIMITER ;
