USE cred;
DROP PROCEDURE if EXISTS `GetCompanies` ;

DELIMITER $$
CREATE PROCEDURE `GetCompanies`()
BEGIN
SELECT 
		cur_company.id AS 'company_id'
		,cur_company.name AS 'company_name'
FROM cur_company;
END$$
DELIMITER ; 
