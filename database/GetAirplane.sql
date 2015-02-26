DROP PROCEDURE if EXISTS `GetAirplane` ;

DELIMITER $$

CREATE PROCEDURE `GetAirplane`(IN airplaneID INT)
BEGIN
SELECT
	
	cur_airplanes.id AS 'airplane_id'
	,cur_airplanes.resource_category
	,cur_airplanes.fixed_wing_type AS 'wing_type'
	,cur_airplanes.call_sign
	,cur_airplanes.serial_number
	,cur_company.id as 'owner'
	,cur_airplanes.seats
FROM cur_airplanes
	LEFT JOIN cur_company ON (cur_company.id = cur_airplanes.cur_company_id AND cur_company.is_deleted = 0)
WHERE 
	cur_airplanes.is_deleted = 0
	AND cur_airplanes.id = airplaneID;
	
END$$
DELIMITER ;
