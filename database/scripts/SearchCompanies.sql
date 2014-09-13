USE cred;
DROP PROCEDURE if EXISTS `SearchCompanies` ;

DELIMITER $$
CREATE PROCEDURE `SearchCompanies`(IN companySearchTerms VARCHAR(128), IN addressSearchTerms VARCHAR(128)
							,IN offsetIndex int, IN recordCount INT, IN orderBy VARCHAR (255), OUT filteredCount INT, OUT totalCount INT)
BEGIN
	SELECT
		SQL_CALC_FOUND_ROWS cur_company_address_mapping.id AS 'mapping_id'
		,cur_company.name as 'company_name'
		,cur_company.id as 'company_id'
		,cur_address.id as 'address_id'
		,cur_address.street_number_begin
		,cur_address.street_number_end
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
	ORDER BY
		CASE WHEN orderBy='company_name_asc' THEN company_name END ASC,
		CASE WHEN orderBy='company_name_desc' THEN company_name END DESC,
		CASE WHEN orderBy='street_name_asc' THEN street_name END ASC,
		CASE WHEN orderBy='street_name_desc' THEN street_name END DESC,
		CASE WHEN orderBy='street_number_begin_asc' THEN street_number_begin END ASC,
		CASE WHEN orderBy='street_number_begin_desc' THEN street_number_begin END DESC

	LIMIT recordCount OFFSET offsetIndex;
	SET filteredCount = FOUND_ROWS();

	SELECT COUNT(*) as 'totalCount' INTO totalCount
	FROM cur_company
	WHERE 
		cur_company.is_deleted = 0;
END$$
DELIMITER ;