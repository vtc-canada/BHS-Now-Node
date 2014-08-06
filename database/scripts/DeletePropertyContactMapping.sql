USE cred;
DROP PROCEDURE if EXISTS `DeletePropertyContactMapping` ;

DELIMITER $$
CREATE PROCEDURE `DeletePropertyContactMapping`(IN mappingID INT)
BEGIN
	DELETE FROM cur_owner_seller_property_mapping
	WHERE id = mappingID;
END$$
DELIMITER ;