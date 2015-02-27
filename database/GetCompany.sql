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
		,IFNULL(GROUP_CONCAT(users.first_name,' ',users.last_name,' (P):',users.phone_number SEPARATOR ','),'N/A') as 'travel_coordinator'
FROM cur_company
	LEFT JOIN cur_user_company_mapping AS travel_coordinator ON (travel_coordinator.company_ID = cur_company.id)
	LEFT JOIN users ON (users.id = travel_coordinator.user_ID AND users.id IN (SELECT users.id
																				FROM users
																				INNER JOIN usersecuritygroupmappings 
																						ON (usersecuritygroupmappings.userID = users.id 
																							AND usersecuritygroupmappings.securityGroupId = 2))) #Travel Coordinator

WHERE cur_company.id = companyId
GROUP BY cur_company.id;


END$$
DELIMITER ; 
