DROP PROCEDURE if EXISTS `FMS_MANIFEST_GetManifestByFlightId` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFEST_GetManifestByFlightId`(IN paramFlightId INT)
BEGIN
SELECT
	id,
	flight_ID,
	manifest_id
FROM cur_manifest
WHERE 
	flight_ID = paramFlightId;
END$$
DELIMITER ;
