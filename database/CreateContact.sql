DROP PROCEDURE if EXISTS `CreateContact` ;

DELIMITER $$
CREATE PROCEDURE `CreateContact`(IN firstName VARCHAR(256), IN lastName VARCHAR(256),IN email VARCHAR(64), IN phoneNumber VARCHAR(64), OUT id INT)
BEGIN
	INSERT INTO cur_contacts(first_name,last_name,email,phone_number,is_deleted) VALUES (firstName, lastName, email,phoneNumber, 0);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;
