USE cred;
DROP PROCEDURE if EXISTS `GetContactNotes` ;

DELIMITER $$
CREATE PROCEDURE `GetContactNotes`(IN contactID int)
BEGIN
SELECT
	cur_notes.user
	,cur_notes.timestamp
	,cur_notes.note
	,cur_notes.id
FROM 
	cur_note_mapping
	INNER JOIN cur_notes ON (cur_notes.id = cur_note_mapping.cur_notes_id)
	INNER JOIN cur_contacts ON (cur_note_mapping.entity_id= cur_contacts.id AND cur_contacts.id = contactID)
WHERE 
	cur_notes.is_deleted = 0
	AND cur_note_mapping.ref_entity_type_id = 1; #Contact Type
END$$
DELIMITER ;	


