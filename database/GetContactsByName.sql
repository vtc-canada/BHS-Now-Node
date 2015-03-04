DROP PROCEDURE if EXISTS `GetContactsByName` ;

DELIMITER $$

CREATE PROCEDURE `GetContactsByName`(IN contactSearchTerms VARCHAR(128),IN isAdmin BOOLEAN, IN userID INT)
BEGIN
SELECT
	
	cur_contacts.id AS 'contact_id'
	,cur_contacts.cur_company_id
	,cur_contacts.first_name AS 'first_name'
	,cur_contacts.last_name AS 'last_name'
	,CONCAT_WS(' ',CONCAT_WS(', ',cur_contacts.last_name,cur_contacts.first_name), cur_contacts.middle_name) AS 'contact_name'
	,cur_contacts.email
	,cur_contacts.phone_number
	,cur_company.name as 'company'
FROM cur_contacts
	LEFT JOIN cur_company ON (cur_company.id = cur_contacts.cur_company_id and cur_company.is_deleted = 0)
	LEFT JOIN cur_user_company_mapping ON (cur_user_company_mapping.company_ID = cur_company.id AND cur_user_company_mapping.user_ID = userID)
WHERE 
	cur_contacts.is_deleted = 0
	AND (contactSearchTerms IS NULL OR MATCH (cur_contacts.first_name,cur_contacts.last_name,cur_contacts.middle_name) AGAINST (contactSearchTerms IN BOOLEAN MODE))
	AND (isAdmin = true OR cur_user_company_mapping.company_ID IS NOT NULL)
GROUP BY cur_contacts.id
ORDER BY cur_company.name
LIMIT 10;
END$$
DELIMITER ;
