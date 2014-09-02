DROP PROCEDURE if EXISTS `CreateContactCompanyMapping`;
DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `CreateContactCompanyMapping`(IN contactID INT, IN companyID INT, OUT id INT)
BEGIN
	INSERT INTO cur_contact_company_mapping(cur_contacts_id,cur_company_id) VALUES (contactID, companyID);
	SET id = LAST_INSERT_ID();
END$$
DELIMITER ;