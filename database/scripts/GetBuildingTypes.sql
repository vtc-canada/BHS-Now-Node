USE cred;
DROP PROCEDURE if EXISTS `GetBuildingTypes` ;

DELIMITER $$
CREATE PROCEDURE `GetBuildingTypes`(IN buildingID int)
BEGIN
SELECT
	ref_building_type.id
	,ref_building_type.type
FROM 
	ref_building_type;
END$$
DELIMITER ;	


