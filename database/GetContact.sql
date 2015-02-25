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
	,'J. Smith 555-5555' as 'travel_coordinator'
FROM cur_contacts
WHERE 
	cur_contacts.is_deleted = 0
	AND cur_contacts.id = contactId;
END$$
DELIMITER ;
