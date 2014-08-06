USE cred;
DROP PROCEDURE if EXISTS `CreateCompanyAddressMapping` ;

DELIMITER $$
CREATE PROCEDURE `CreateCompanyAddressMapping`(IN contactID INT,IN companyID INT, IN addressID INT, OUT id INT)
BEGIN
	INSERT INTO cur_company_address_mapping(cur_contacts_id,cur_company_id,cur_address_id) VALUES (contactID, companyID, addressID);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;
