USE cred;
DROP PROCEDURE if EXISTS `UpdateCompany` ;

DELIMITER $$
CREATE PROCEDURE `UpdateCompany`(IN companyID INT, IN companyName VARCHAR(128))
BEGIN
	UPDATE cur_company
		SET
			name = companyName
	WHERE cur_company.id = companyID;
END$$
DELIMITER ;
