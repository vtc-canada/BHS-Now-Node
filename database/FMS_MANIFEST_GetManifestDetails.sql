DROP PROCEDURE if EXISTS `FMS_MANIFEST_GetManifestDetails` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFEST_GetManifestDetails`(IN manifestId INT)
BEGIN
SELECT
	cur_manifest_details.id,
	manifest_ID,
	contact_ID,
	cur_contacts.first_name AS 'first_name',
	cur_contacts.last_name AS 'last_name',
	checked_in,
	pax_weight,
	baggage_pieces,
	baggage_weight
FROM cur_manifest_details
INNER JOIN cur_contacts ON (cur_contacts.id = cur_manifest_details.contact_ID)
WHERE 
	cur_manifest_details.manifest_ID = manifestId;
END$$
DELIMITER ;
