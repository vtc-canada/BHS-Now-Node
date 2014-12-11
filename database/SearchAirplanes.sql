DROP PROCEDURE if EXISTS `SearchAirplanes` ;

DELIMITER $$
CREATE PROCEDURE `SearchAirplanes`(IN airplaneSearchTerms VARCHAR(128), IN companySearchTerms VARCHAR(128)
							,IN offsetIndex int, IN recordCount INT, IN orderBy VARCHAR (255), OUT filteredCount INT)
BEGIN
	SELECT
		SQL_CALC_FOUND_ROWS cur_airplanes.id as 'contact_id'
		,cur_airplanes.resource_category
		,cur_airplanes.fixed_wing_type
		,cur_airplanes.call_sign
		,cur_airplanes.serial_number
		,cur_company.name as 'owner'

	FROM cur_airplanes
	LEFT JOIN cur_company ON (cur_airplanes.cur_company_id = cur_company.id and cur_company.is_deleted = 0)
	WHERE 
		cur_airplanes.is_deleted = 0
		AND (airplaneSearchTerms IS NULL OR MATCH (cur_airplanes.resource_category,cur_airplanes.fixed_wing_type,
				cur_airplanes.call_sign,cur_airplanes.serial_number) AGAINST (airplaneSearchTerms IN BOOLEAN MODE))
		AND (companySearchTerms IS NULL OR MATCH (cur_company.name) AGAINST (companySearchTerms IN BOOLEAN MODE))
	GROUP BY cur_airplanes.id
ORDER BY
	CASE WHEN orderBy='contact_name_asc' THEN cur_airplanes.resource_category END ASC,
	CASE WHEN orderBy='contact_name_desc' THEN cur_airplanes.resource_category END DESC,
	CASE WHEN orderBy='company_asc' THEN cur_company.name END ASC,
	CASE WHEN orderBy='company_desc' THEN cur_company.name  END DESC
	#CASE WHEN orderBy='' THEN contact_name END ASC
	LIMIT recordCount OFFSET offsetIndex;
	SET filteredCount = FOUND_ROWS();
END$$
DELIMITER ;