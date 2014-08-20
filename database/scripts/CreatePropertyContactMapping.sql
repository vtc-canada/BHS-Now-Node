USE cred;
DROP PROCEDURE if EXISTS `CreatePropertyContactMapping` ;

DELIMITER $$
CREATE PROCEDURE `CreatePropertyContactMapping`(IN contactID INT, IN companyID INT,IN addressID INT, IN contactTypeID INT,OUT id INT)
BEGIN
	INSERT INTO cur_owner_seller_property_mapping(contact_id, company_id, property_address_id, contact_type_id)
	
	VALUES (contactID, companyID, addressID , contactTypeID);

	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;