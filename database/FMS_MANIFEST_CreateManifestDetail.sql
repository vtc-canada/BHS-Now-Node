DROP PROCEDURE if EXISTS `FMS_MANIFEST_CreateManifestDetail` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFEST_CreateManifestDetail`(IN paramManifest_ID INT, IN paramContact_ID INT, IN paramPaxWeight INT, OUT paramCur_ManifestDetails_ID INT)
BEGIN
INSERT INTO
cur_manifest_details (cur_manifest_id, contact_ID, pax_weight)
VALUES
(paramManifest_ID, paramContact_ID, paramPaxWeight);
SET paramCur_ManifestDetails_ID = LAST_INSERT_ID();
END$$
DELIMITER ;
