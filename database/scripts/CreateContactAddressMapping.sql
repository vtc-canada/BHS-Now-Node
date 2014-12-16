USE cred;
DROP PROCEDURE if EXISTS `CreateContactAddressMapping` ;

DELIMITER $$
CREATE PROCEDURE `CreateContactAddressMapping`(IN contactID INT, IN addressID INT, OUT id INT)
BEGIN
	INSERT INTO cur_company_address_mapping(cur_contact_id,cur_address_id) VALUES (contactID, addressID);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;
