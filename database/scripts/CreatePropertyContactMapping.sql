USE cred;
DROP PROCEDURE if EXISTS `CreatePropertyContactMapping` ;

DELIMITER $$
CREATE PROCEDURE `CreatePropertyContactMapping`(IN contactID INT, IN buildingID INT,IN companyID INT, IN contactTypeID INT,OUT id INT)
BEGIN
	INSERT INTO cur_buildings(contact_id, company_id, property_address_id, contact_type_id)
	
	VALUES (contactID, buildingID, companyID, contactTypeID);

	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;