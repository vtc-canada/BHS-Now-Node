USE cred;
DROP PROCEDURE if EXISTS `GetNote` ;

DELIMITER $$
CREATE PROCEDURE `GetNote`(IN noteID int)
BEGIN
SELECT
	cur_notes.user
	,cur_notes.timestamp
	,cur_notes.note
	,cur_notes.id
FROM 
	cur_notes
WHERE 
	cur_notes.is_deleted = 0
	AND cur_notes.id = noteID;
END$$
DELIMITER ;	


