DROP PROCEDURE if EXISTS `GetManifest` ;

DELIMITER $$

CREATE PROCEDURE `GetManifest`(IN manifestId INT)
BEGIN
SELECT
		cur_manifest.id
		,cur_manifest.flight_no
		,cur_manifest.regn_no
		,cur_manifest.max_resource_payload
		,cur_manifest.max_leg_payload
		,cur_manifest.route
FROM cur_manifest
WHERE 
	cur_manifest.is_deleted = 0
	AND cur_manifest.id = manifestId;
END$$
DELIMITER ;
