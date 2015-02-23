DROP PROCEDURE if EXISTS `FMS_MANIFEST_GetManifestByLegId` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFEST_GetManifestByLegId`(IN paramLegId INT)
BEGIN
SELECT
	id,
	cur_legs_id
FROM cur_manifest
WHERE 
	cur_legs_id = paramLegId;
END$$
DELIMITER ;
