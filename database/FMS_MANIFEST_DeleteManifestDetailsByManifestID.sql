DROP PROCEDURE if EXISTS `FMS_MANIFEST_DeleteManifestDetailsByManifestID` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFEST_DeleteManifestDetailsByManifestID`(IN paramManifest_ID INT)
BEGIN
DELETE FROM cur_manifest_details
WHERE manifest_ID = paramManifest_ID;
END$$
DELIMITER ;
