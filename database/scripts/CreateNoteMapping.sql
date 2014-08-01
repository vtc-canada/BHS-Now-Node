USE cred;
DROP PROCEDURE if EXISTS `CreateNoteMapping` ;

DELIMITER $$
CREATE PROCEDURE `CreateNoteMapping`(IN contactID INT, IN noteID INT, IN addressID INT, IN companyID INT, OUT id INT)
BEGIN
	INSERT INTO `cur_note_mapping`(`cur_contacts_id`, `cur_notes_id`, `cur_address_id`, `cur_company_id`) 
	VALUES (contactID, noteID, addressID, companyID);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;
