DROP PROCEDURE if EXISTS `GetContactCompanyMapping`;
DELIMITER $$
CREATE PROCEDURE `GetContactCompanyMapping`(IN contactID INT, IN companyID INT)
BEGIN
	SELECT 
id
FROM cur_contact_company_mapping
WHERE cur_contacts_id = contactId
AND cur_company_id = companyID;
END$$
DELIMITER ;