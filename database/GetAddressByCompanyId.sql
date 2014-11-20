DROP PROCEDURE if EXISTS `GetAddressByCompanyId` ;
DELIMITER $$
CREATE PROCEDURE `GetAddressByCompanyId`(IN companyId INT)
BEGIN
	SELECT 
		cur_company.id AS 'address_id'
		,cur_company.name AS 'company_name'
		,cur_company.id AS 'company_id'
		,cur_company.street_number_begin
		,cur_company.street_number_end
		,cur_company.street_name
		,cur_company.postal_code
		,cur_company.city
		,cur_company.province
		,'10' as latitude
		,'11' as longitude
	FROM cur_company
	WHERE cur_company.id = companyId
LIMIT 1;
END$$
DELIMITER ;
