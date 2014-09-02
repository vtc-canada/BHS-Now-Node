USE cred;
DROP PROCEDURE if EXISTS `GetCompany` ;

DELIMITER $$
CREATE PROCEDURE `GetCompany`(IN companyId INT)
BEGIN
SELECT 
		cur_company.id AS 'company_id'
		,cur_company.name AS 'company_name'
FROM cur_company
WHERE cur_company.id = companyId;
END$$
DELIMITER ; 
