USE cred;
DROP PROCEDURE if EXISTS `GetCompany` ;

DELIMITER $$
CREATE PROCEDURE `GetCompany`(IN companyId INT)
BEGIN
SELECT 
		cur_company.id AS 'company_id'
		,cur_company.name AS 'company_name'
		,cur_company.phone_number
		,cur_address.id
		,cur_address.street_number_begin
		,cur_address.street_name
		,cur_address.street_number_end
		,cur_address.city
		,cur_address.postal_code
		,cur_address.province
		,cur_address.latitude
		,cur_address.longitude
FROM cur_company
	LEFT JOIN cur_company_address_mapping ON ( cur_company_address_mapping.cur_company_id = cur_company.id)
	LEFT JOIN cur_address ON (cur_address.id = cur_company_address_mapping.cur_address_id)
WHERE cur_company.id = companyId;
END$$
DELIMITER ; 
