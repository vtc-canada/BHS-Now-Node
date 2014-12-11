DROP PROCEDURE if EXISTS `FMS_MANIFEST_CreateManifestDetail` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFEST_CreateManifestDetail`(IN paramManifest_ID INT, IN paramContact_ID TINYINT(1), OUT paramCur_ManifestDetails_ID INT)
BEGIN
INSERT INTO
cur_manifest_details (manifest_ID, contact_ID)
VALUES
(paramManifest_ID, paramContact_ID);
SET paramCur_ManifestDetails_ID = LAST_INSERT_ID();
END$$
DELIMITER ;
