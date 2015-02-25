DROP PROCEDURE if EXISTS `SearchCompanies` ;

DELIMITER $$
CREATE PROCEDURE `SearchCompanies`(IN companySearchTerms VARCHAR(128),IN offsetIndex int, IN recordCount INT
						, IN orderBy VARCHAR (255), OUT filteredCount INT, OUT totalCount INT)
BEGIN
	SELECT
		SQL_CALC_FOUND_ROWS  cur_company.id as 'company_id'
		,cur_company.name as 'company_name'
		,cur_company.street_number_begin
		,cur_company.street_number_end
		,cur_company.street_name
		,cur_company.postal_code
		,cur_company.city
		,cur_company.province
		,'John Smith 555-555-5555' AS 'travel_coordinator'	
	FROM cur_company
	WHERE 
		cur_company.is_deleted = 0
		AND (companySearchTerms IS NULL OR MATCH (cur_company.name, cur_company.phone_number, cur_company.street_number_begin, cur_company.street_number_end,
				cur_company.street_name, cur_company.postal_code, cur_company.city, cur_company.province) AGAINST (companySearchTerms IN BOOLEAN MODE))
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