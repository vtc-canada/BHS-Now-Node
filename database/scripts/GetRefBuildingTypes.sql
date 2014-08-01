USE cred;
DROP PROCEDURE if EXISTS `GetRefBuildingTypes` ;
CREATE PROCEDURE `GetRefBuildingTypes`()

SELECT 
	ref_building_type.id
	,ref_building_type.type	
FROM
	ref_building_type;