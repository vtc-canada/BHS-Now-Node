DROP PROCEDURE if EXISTS `FMS_MANIFEST_UpdateManifestDetail` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFEST_UpdateManifestDetail`(IN paramManifestDetails_ID INT, IN paramChecked_in TINYINT(1), IN paramBoarded TINYINT(1))
BEGIN
UPDATE
cur_manifest_details
SET 
checked_in = IF(paramChecked_in IS NULL,checked_in,paramChecked_in),
boarded = IF(paramBoarded IS NULL,boarded,paramBoarded) 
WHERE cur_manifest_details.id = paramManifestDetails_ID;
END$$
DELIMITER ;
