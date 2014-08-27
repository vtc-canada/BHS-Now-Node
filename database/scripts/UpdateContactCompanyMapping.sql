USE cred;
DROP PROCEDURE if EXISTS `UpdateContactCompanyMapping` ;

DELIMITER $$
CREATE PROCEDURE `UpdateContactCompanyMapping`(IN mappingID INT, IN contactID INT,IN companyID INT)
BEGIN
	UPDATE cur_company_address_mapping
		SET cur_contacts_id = contactID
			,cur_company_id = companyID

	WHERE id = mappingID;
		

END$$
DELIMITER ;
