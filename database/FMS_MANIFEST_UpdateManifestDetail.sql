DROP PROCEDURE if EXISTS `FMS_MANIFEST_UpdateManifestDetail` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFEST_UpdateManifestDetail`(IN manifestDetailsID INT, IN checkedIn TINYINT(1)
	, IN paramPaxWeight INT, IN paramNumOfBags INT, IN bagWeight INT, IN boarded TINYINT(1))
BEGIN
	UPDATE
		cur_manifest_details
	SET 
		checked_in = IF(checkedIn IS NULL,checked_in,checkedIn),
		boarded = IF(boarded IS NULL,boarded,boarded),
		pax_weight = IF(paramPaxWeight IS NULL,pax_weight,paramPaxWeight),
		baggage_pieces = IF(paramNumOfBags IS NULL,baggage_pieces,paramNumOfBags),
		baggage_weight = IF(bagWeight IS NULL,baggage_weight,bagWeight)

	WHERE cur_manifest_details.id = manifestDetailsID;
END$$
DELIMITER ;
