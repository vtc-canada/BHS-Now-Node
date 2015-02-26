DROP PROCEDURE if EXISTS `SearchCompanies` ;

DELIMITER $$
CREATE PROCEDURE `SearchCompanies`(IN companySearchTerms VARCHAR(128),IN offsetIndex int, IN recordCount INT
						, IN orderBy VARCHAR (255),IN isAdmin BOOLEAN, IN userID INT, OUT filteredCount INT, OUT totalCount INT)
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
		,GROUP_CONCAT(users.first_name,' ',users.last_name,' (P):',users.phone_number SEPARATOR ',') as 'travel_coordinator'
	FROM cur_company
	LEFT JOIN cur_user_company_mapping ON (cur_user_company_mapping.company_ID = cur_company.id AND cur_user_company_mapping.user_ID = userID)	
	LEFT JOIN cur_user_company_mapping AS travel_coordinator ON (travel_coordinator.company_ID = cur_company.id)
	LEFT JOIN users ON (users.id = travel_coordinator.user_ID AND users.id IN (SELECT users.id
																				FROM users
																				INNER JOIN usersecuritygroupmappings 
																						ON (usersecuritygroupmappings.userID = users.id 
																							AND usersecuritygroupmappings.securityGroupId = 2))) #Travel Coordinator
																				
	WHERE 
		cur_company.is_deleted = 0
		AND (companySearchTerms IS NULL OR MATCH (cur_company.name, cur_company.phone_number, cur_company.street_number_begin, cur_company.street_number_end,
				cur_company.street_name, cur_company.postal_code, cur_company.city, cur_company.province) AGAINST (companySearchTerms IN BOOLEAN MODE))
		AND (isAdmin = true OR cur_user_company_mapping.company_ID IS NOT NULL)
	GROUP BY cur_company.id
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