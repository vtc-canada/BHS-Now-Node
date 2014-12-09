DROP PROCEDURE if EXISTS `FMS_MANIFEST_CreateManifest` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFEST_CreateManifest`(IN paramFlight_ID INT)
BEGIN
INSERT INTO cur_manifest (flight_ID, is_deleted) 
VALUES (paramFlight_ID,0);
END$$
DELIMITER ;
