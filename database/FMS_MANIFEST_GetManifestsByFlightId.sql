DROP PROCEDURE if EXISTS `FMS_MANIFEST_GetManifestsByFlightId` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFEST_GetManifestsByFlightId`(IN paramFlightId INT)
BEGIN
SELECT
	cur_manifest.id
,cur_manifest.cur_legs_id
,cur_legs.flight_number
,cur_manifest.regn_no
,cur_manifest.max_leg_payload
,cur_manifest.max_resource_payload
,cur_manifest.route
,cur_manifest.is_deleted
,cur_manifest.last_modified
FROM cur_legs
INNER JOIN cur_manifest ON cur_manifest.cur_legs_id = cur_legs.id
WHERE 
	cur_legs.flight_id = paramFlightId;
END$$
DELIMITER ;
