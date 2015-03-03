DROP PROCEDURE if EXISTS `FMS_MANIFEST_GetManifestDetail` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFEST_GetManifestDetail`(IN manifestDetailsID INT)
BEGIN
	SELECT
		cur_manifest_details.id
		,cur_manifest_details.cur_manifest_id
		,cur_manifest_details.contact_ID
		,CONCAT_WS(' ',CONCAT_WS(', ',cur_contacts.last_name,cur_contacts.first_name), cur_contacts.middle_name) AS 'contact_name'
		,cur_company.name as 'company'
		,cur_manifest_details.checked_in	
		,cur_manifest_details.pax_weight
		,cur_manifest_details.baggage_pieces
		,cur_manifest_details.baggage_weight
		,cur_manifest_details.boarded
		,originAirportDef.ICAO AS 'origin_name'
		,destinationAirportDef.ICAO AS 'destination_name'
	FROM cur_manifest_details
	INNER JOIN cur_manifest ON (cur_manifest.id = cur_manifest_details.cur_manifest_id)
	INNER JOIN cur_contacts ON (cur_contacts.id = cur_manifest_details.contact_ID)
	LEFT JOIN cur_company ON (cur_company.id = cur_contacts.cur_company_id)
	INNER JOIN cur_legs ON (cur_manifest.cur_legs_id = cur_legs.id)
	INNER JOIN ref_airport_def AS originAirportDef ON (originAirportDef.id = cur_legs.origin_airport_code)
	INNER JOIN ref_airport_def AS destinationAirportDef ON (destinationAirportDef.id = cur_legs.destination_airport_code)
	WHERE 
		cur_manifest_details.id = manifestDetailsID;
END$$
DELIMITER ;
