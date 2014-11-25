DROP PROCEDURE if EXISTS `DeleteCompany` ;

DELIMITER $$
CREATE PROCEDURE `DeleteCompany`(IN companyID INT)
BEGIN
		UPDATE cur_company
			SET is_deleted = 1,
			name = CONCAT(CONCAT(name, '_DELETED_'),NOW())
		WHERE id = companyID;
END$$
DELIMITER ;