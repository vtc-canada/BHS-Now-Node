DROP PROCEDURE if EXISTS `FMS_MANIFEST_UpdateManifestDetails` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFEST_UpdateManifestDetails`(IN paramManifestDetails_ID INT, IN paramChecked_in TINYINT(1))
BEGIN
UPDATE
cur_manifest_details
SET 
checked_in = IF(paramChecked_in IS NULL,checked_in,paramChecked_in)
WHERE cur_manifest_details.id = paramManifestDetails_ID;
END$$
DELIMITER ;
