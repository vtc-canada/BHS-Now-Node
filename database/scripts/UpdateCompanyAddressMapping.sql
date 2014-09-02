USE cred;
DROP PROCEDURE if EXISTS `UpdateCompanyAddressMapping` ;

DELIMITER $$
CREATE PROCEDURE `UpdateCompanyAddressMapping`(IN mappingID INT, IN companyID INT, IN addressID INT)
BEGIN
	UPDATE cur_company_address_mapping
		SET cur_company_id = companyID
			,cur_address_id = addressID

	WHERE id = mappingID;
		

END$$
DELIMITER ;
