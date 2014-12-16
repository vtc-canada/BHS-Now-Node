USE cred;
DROP PROCEDURE if EXISTS `UpdateCompany` ;

DELIMITER $$
CREATE PROCEDURE `UpdateCompany`(IN companyID INT, IN companyName VARCHAR(128), IN paramPhone_number VARCHAR(512))
BEGIN
	UPDATE cur_company
		SET
			name = companyName,
			phone_number = paramPhone_number
	WHERE cur_company.id = companyID;
END$$
DELIMITER ;
