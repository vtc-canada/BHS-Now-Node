DROP PROCEDURE if EXISTS `UpdateCompany` ;

DELIMITER $$
CREATE PROCEDURE `UpdateCompany`(IN companyID INT, IN companyName VARCHAR(128), IN streetNumberBegin VARCHAR(64), 
		IN streetNumberEnd VARCHAR(64), IN streetName VARCHAR(256),IN postalCode VARCHAR(32), IN city VARCHAR(64), IN province VARCHAR(45))
BEGIN
	UPDATE cur_company
		SET
			name = companyName
			,street_number_begin = streetNumberBegin
			,street_number_end = streetNumberEnd
			,street_name = streetName
			,postal_code = postalCode
			,city = city
			,province = province
	WHERE cur_company.id = companyID;
END$$
DELIMITER ;

