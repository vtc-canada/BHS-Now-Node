USE cred;
DROP PROCEDURE if EXISTS `GetRefBoilerTypes` ;
CREATE PROCEDURE `GetRefBoilerTypes`()

SELECT 
	ref_boiler_type.id
	,ref_boiler_type.type	
FROM
	ref_boiler_type;