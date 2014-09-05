USE cred;
DROP PROCEDURE if EXISTS `CreateAddress`;

DELIMITER $$
CREATE PROCEDURE `CreateAddress`(IN streetNumberBegin VARCHAR(64), IN streetNumberEnd VARCHAR(64), IN streetName VARCHAR(256), 
	IN postalCode VARCHAR(32), IN city VARCHAR(64), IN addressType Int, province VARCHAR(45), IN latitude FLOAT,IN longitude FLOAT, OUT id INT)
BEGIN
	INSERT INTO `cur_address`(street_number_begin,street_number_end,street_name,postal_code,city,address_type_id,province, latitude, longitude) 
		VALUES (streetNumberBegin, streetNumberEnd, streetName, postalCode,city,addressType,province, latitude, longitude);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;
