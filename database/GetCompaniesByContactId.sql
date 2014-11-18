DROP PROCEDURE if EXISTS `GetCompaniesByContactId` ;

DELIMITER $$
CREATE PROCEDURE `GetCompaniesByContactId`(IN contactId INT(11))
BEGIN
SELECT 
		cur_company.id as 'company_id'
		,cur_company.name as 'company_name'
		,cur_company.street_number_begin
		,cur_company.street_number_end
		,cur_company.street_name	
		,cur_company.postal_code
		,cur_company.city
		,cur_company.province
FROM cur_company
	INNER JOIN cur_contact_company_mapping ON (cur_contact_company_mapping.cur_company_id = cur_company.id AND cur_company.is_deleted = 0)
WHERE  
cur_contact_company_mapping.cur_contacts_id = contactId
AND cur_company.is_deleted = 0;
END$$
DELIMITER ; 
