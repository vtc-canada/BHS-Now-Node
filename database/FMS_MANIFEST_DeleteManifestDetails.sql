DROP PROCEDURE if EXISTS `FMS_MANIFEST_DeleteManifestDetails` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFEST_DeleteManifestDetails`(IN paramManifest_ID INT)
BEGIN
DELETE FROM cur_manifest_details
WHERE id = paramManifest_ID;
END$$
DELIMITER ;
