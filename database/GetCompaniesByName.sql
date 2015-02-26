DROP PROCEDURE if EXISTS `GetCompaniesByName` ;

DELIMITER $$
CREATE PROCEDURE `GetCompaniesByName`(IN companySearchTerms VARCHAR(128))
BEGIN
SELECT 
		cur_company.id as 'company_id'
		,cur_company.name as 'company_name'
FROM cur_company
WHERE  (companySearchTerms IS NULL OR cur_company.name LIKE CONCAT('%', companySearchTerms, '%'))
	AND cur_company.is_deleted = 0;
END$$
DELIMITER ; 
