USE cred;
DROP PROCEDURE if EXISTS `GetRefBuildingTypes` ;

DELIMITER $$
CREATE PROCEDURE `GetRefBuildingTypes`()
BEGIN
SELECT 
	ref_building_type.id
	,ref_building_type.type	
FROM
	ref_building_type;
END$$
DELIMITER ;