DROP PROCEDURE if EXISTS `FMS_MANIFEST_GetManifestDetails` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFEST_GetManifestDetails`(IN manifestId INT)
BEGIN
SELECT
	cur_manifest_details.id
	,cur_manifest_id
	,contact_ID
	,CONCAT_WS(' ',CONCAT_WS(', ',cur_contacts.last_name,cur_contacts.first_name), cur_contacts.middle_name) AS 'contact_name'
	,checked_in
	,pax_weight
	,baggage_pieces
	,baggage_weight
	,boarded
FROM cur_manifest_details
INNER JOIN cur_contacts ON (cur_contacts.id = cur_manifest_details.contact_ID)
WHERE 
	cur_manifest_details.cur_manifest_id = manifestId
GROUP BY cur_contacts.id;
END$$
DELIMITER ;
