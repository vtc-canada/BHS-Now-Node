USE cred;
DROP PROCEDURE if EXISTS `GetBuildingNotes` ;

DELIMITER $$
CREATE PROCEDURE `GetBuildingNotes`(IN buildingID int)

SELECT
	cur_notes.user
	,cur_notes.timestamp
	,cur_notes.note
	,cur_notes.id
FROM 
	cur_note_mapping
	INNER JOIN cur_notes ON (cur_notes.id = cur_note_mapping.cur_notes_id)
	INNER JOIN cur_address ON (cur_address.id = cur_note_mapping.cur_address_id)
	INNER JOIN cur_buildings ON (cur_buildings.cur_address_id = cur_address.id AND cur_buildings.id = buildingID)
WHERE 
	cur_notes.is_deleted = 0;
END$$
DELIMITER ;	


