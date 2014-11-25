DROP PROCEDURE if EXISTS `GetCompanyNotes` ;

DELIMITER $$
CREATE PROCEDURE `GetCompanyNotes`(IN companyID int)
BEGIN
SELECT
	cur_notes.user
	,cur_notes.timestamp
	,cur_notes.note
	,cur_notes.id
FROM 
	cur_note_mapping
	INNER JOIN cur_notes ON (cur_notes.id = cur_note_mapping.cur_notes_id)
	INNER JOIN cur_company ON (cur_company.id = cur_note_mapping.entity_id AND cur_company.id = companyID)
WHERE 
	cur_notes.is_deleted = 0
	AND cur_note_mapping.ref_entity_type_id = 2; #Company Type
END$$
DELIMITER ;	


