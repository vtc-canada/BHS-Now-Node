USE cred;
DROP PROCEDURE if EXISTS `GetAddressOnlyByCompanyId` ;
DELIMITER $$
CREATE PROCEDURE `GetAddressOnlyByCompanyId`(IN companyId INT)
BEGIN
	SELECT 
		cur_address.id AS 'address_id'
		,cur_company.name AS 'company_name'
		,cur_company.id AS 'company_id'
		,street_number_begin
		,street_number_end
		,street_name
		,postal_code
		,city
		,address_type_id
		,province
		,latitude
		,longitude
	FROM cur_company
	INNER JOIN cur_company_address_mapping ON (cur_company.id = cur_company_address_mapping.cur_company_id)
	INNER JOIN cur_address ON (cur_address.id = cur_company_address_mapping.cur_address_id)
	WHERE cur_company.id = companyId
	ORDER BY cur_company_address_mapping.id DESC
LIMIT 1;
END$$
DELIMITER ;
