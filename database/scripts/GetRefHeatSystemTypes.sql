USE cred;
DROP PROCEDURE if EXISTS `GetRefHeatSystemTypes` ;
CREATE PROCEDURE `GetRefHeatSystemTypes`()

SELECT 
	ref_heat_system_type.id
	,ref_heat_system_type.type	
FROM
	ref_heat_system_type;