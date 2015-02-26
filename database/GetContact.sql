DROP PROCEDURE if EXISTS `GetContact` ;

DELIMITER $$

CREATE PROCEDURE `GetContact`(IN contactId INT)
BEGIN
SELECT
	
	cur_contacts.id AS 'contact_id'
	,cur_contacts.first_name
	,cur_contacts.middle_name
	,cur_contacts.last_name 
	,cur_contacts.date_of_birth
	,cur_contacts.email
	,cur_contacts.phone_number
	,cur_contacts.drivers_license
	,cur_contacts.passport_no
	,cur_contacts.nationality
	,cur_contacts.gender
	,cur_contacts.cur_company_id AS 'company_id'
	,GROUP_CONCAT(users.first_name,users.last_name,' (P):',users.phone_number SEPARATOR ',') as 'travel_coordinator'
FROM cur_contacts
	LEFT JOIN cur_user_company_mapping AS travel_coordinator ON (travel_coordinator.company_ID = cur_contacts.cur_company_id)
	LEFT JOIN users ON (users.id = travel_coordinator.user_ID AND users.id IN (SELECT users.id
																				FROM users
																				INNER JOIN usersecuritygroupmappings 
																						ON (usersecuritygroupmappings.userID = users.id 
																							AND usersecuritygroupmappings.securityGroupId = 2))) #Travel Coordinator
WHERE 
	cur_contacts.is_deleted = 0
	AND cur_contacts.id = contactId
GROUP BY cur_contacts.cur_company_id;
END$$
DELIMITER ;
