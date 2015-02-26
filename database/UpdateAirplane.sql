DROP PROCEDURE if EXISTS `UpdateAirplane` ;

DELIMITER $$
CREATE PROCEDURE `UpdateAirplane`(IN airplaneID INT, IN resourceCategory VARCHAR(256),IN wingType VARCHAR(256), IN callSign VARCHAR(256),
			IN serialNumber VARCHAR(256), IN company VARCHAR(64), IN seats VARCHAR(64))
BEGIN
	UPDATE cur_airplanes
		SET resource_category = resourceCategory
		,fixed_wing_type = wingType
		,call_sign = callSign
		,serial_number = serialNumber
		,cur_company_id = company
		,seats = seats
	WHERE
		id = airplaneID;
END$$
DELIMITER ;
