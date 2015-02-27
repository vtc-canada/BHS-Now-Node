DROP PROCEDURE if EXISTS `FMS_MANIFEST_GetManifest` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFEST_GetManifest`(IN paramManifest_ID INT)
BEGIN
SELECT
	id,
	cur_legs_id,
	manifest_id
FROM cur_manifest
WHERE 
	id = paramManifest_ID;
END$$
DELIMITER ;
