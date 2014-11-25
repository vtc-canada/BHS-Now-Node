DROP PROCEDURE if EXISTS `CreateCompany` ;

DELIMITER $$
CREATE PROCEDURE `CreateCompany`(IN companyName VARCHAR(128), IN streetNumberBegin VARCHAR(64), IN streetNumberEnd VARCHAR(64), 
		IN streetName VARCHAR(256),IN postalCode VARCHAR(32), IN city VARCHAR(64), IN province VARCHAR(45), OUT id INT)
BEGIN
	INSERT INTO cur_company(name,street_number_begin,street_number_end, street_name,postal_code,city,province) 
	VALUES (companyName,streetNumberBegin,streetNumberEnd,streetName,postalCode,city,province);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;

DELIMITER ;