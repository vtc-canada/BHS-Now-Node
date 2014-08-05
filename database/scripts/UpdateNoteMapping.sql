USE cred;
DROP PROCEDURE if EXISTS `UpdateNoteMapping` ;

DELIMITER $$
CREATE PROCEDURE `UpdateNoteMapping`(IN mappingID INT, IN contactID INT, IN noteID INT, IN addressID INT, IN companyID INT)
BEGIN
	UPDATE cur_note_mapping
		SET cur_contacts_id = contactID
		,cur_notes_id = noteID
		,cur_address_id = addressID
		,cur_company_id = companyID
	WHERE id = mappingID;
END$$
DELIMITER ;
