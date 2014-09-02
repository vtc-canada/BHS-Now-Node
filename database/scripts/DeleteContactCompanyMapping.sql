DROP PROCEDURE if EXISTS `DeleteContactCompanyMapping` ;
DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `DeleteContactCompanyMapping`(IN contactID INT, IN companyID INT)
BEGIN
	DELETE FROM cur_contact_company_mapping
	WHERE (cur_contacts_id = contactID AND cur_company_id = companyID);
END$$
DELIMITER ;
