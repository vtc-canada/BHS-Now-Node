USE cred;
DROP PROCEDURE if EXISTS `CreateAddress` ;

DELIMITER $$
CREATE PROCEDURE `CreateAddress`(IN streetNumberBegin Int, IN streetNumberEnd INT, IN streetName VARCHAR(256), 
	IN postalCode VARCHAR(32), city Varchar(64), addressType Int, province Varchar(45),  OUT id INT)
BEGIN
	INSERT INTO `cur_address`(`street_number_begin`,`street_number_end`,`street_name`,`postal_code`,`city`,`address_type_id`,`province`) 
		VALUES (streetNumberBegin, streetNumberEnd, streetName, postalCode,city,addressType,province);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;
