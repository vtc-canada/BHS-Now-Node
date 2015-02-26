DROP PROCEDURE if EXISTS `GetCompany` ;

DELIMITER $$
CREATE PROCEDURE `GetCompany`(IN companyId INT)
BEGIN
SELECT 
		cur_company.id AS 'company_id'
		,cur_company.name AS 'company_name'
		,cur_company.street_number_begin
		,cur_company.street_name
		,cur_company.street_number_end
		,cur_company.city
		,cur_company.postal_code
		,cur_company.province
		,'John Smith 555-555-5555' AS 'travel_coordinator'

FROM cur_company
WHERE cur_company.id = companyId;

END$$
DELIMITER ; 
