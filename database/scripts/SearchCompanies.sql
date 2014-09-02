USE cred;
DROP PROCEDURE if EXISTS `SearchCompanies` ;

DELIMITER $$
CREATE PROCEDURE `SearchCompanies`(IN companySearchTerms VARCHAR(128), IN addressSearchTerms VARCHAR(128)
							,IN offsetIndex int, IN recordCount INT, IN orderBy VARCHAR (255), OUT filteredCount INT, OUT totalCount INT)
BEGIN
	SELECT
		cur_company_address_mapping.id AS 'mapping_id'
		,cur_company.name as 'company_name'
		,cur_company.id as 'company_id'
		,cur_address.id as 'address_id'
		,cur_address.street_number_begin
		,cur_address.street_name
		,cur_address.postal_code
		,cur_address.city
		,cur_address.province	
	FROM cur_company
		LEFT JOIN cur_company_address_mapping ON (cur_company_address_mapping.cur_company_id = cur_company.id)
		LEFT JOIN cur_address ON (cur_address.id = cur_company_address_mapping.cur_address_id)
	WHERE 
		cur_company.is_deleted = 0
		AND (addressSearchTerms IS NULL OR MATCH(street_name,postal_code,city,province) AGAINST (addressSearchTerms IN BOOLEAN MODE))	
		AND (companySearchTerms IS NULL OR MATCH (cur_company.name) AGAINST (companySearchTerms IN BOOLEAN MODE))
		
	LIMIT recordCount OFFSET offsetIndex;
	SET filteredCount = FOUND_ROWS();

	SELECT COUNT(*) as 'totalCount' INTO totalCount
	FROM cur_company
	WHERE 
		cur_company.is_deleted = 0;
END$$
DELIMITER ;