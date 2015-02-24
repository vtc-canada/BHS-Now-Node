DROP PROCEDURE if EXISTS `GetAirplanesCount` ;

DELIMITER $$

CREATE PROCEDURE `GetAirplanesCount`()
BEGIN
SELECT
	COUNT(*) as 'number_of_contact_mappings'
FROM cur_airplanes
WHERE 
	cur_airplanes.is_deleted = 0;
END$$
DELIMITER ;
