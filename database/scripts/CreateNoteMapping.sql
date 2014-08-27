USE cred;
DROP PROCEDURE if EXISTS `CreateNoteMapping` ;

DELIMITER $$
CREATE PROCEDURE `CreateNoteMapping`(IN entityID INT, IN noteID INT, IN entityTypeID INT, OUT id INT)
BEGIN
	INSERT INTO cur_note_mapping(entity_id, cur_notes_id, ref_entity_type_id) 
	VALUES (entityID, noteID, entityTypeID);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;
