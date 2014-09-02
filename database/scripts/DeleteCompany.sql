USE cred;
DROP PROCEDURE if EXISTS `DeleteCompany` ;

DELIMITER $$
CREATE PROCEDURE `DeleteCompany`(IN companyID INT)
BEGIN
		UPDATE cur_company
			SET is_deleted = 1
		WHERE id = companyID;
END$$
DELIMITER ;