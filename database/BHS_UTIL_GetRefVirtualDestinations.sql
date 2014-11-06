
DROP procedure IF EXISTS `BHS_UTIL_GetRefVirtualDestinations`;

DELIMITER $$
CREATE PROCEDURE `BHS_UTIL_GetRefVirtualDestinations` ()
BEGIN
	SELECT * FROM ref_virtual_destinations;
END$$

DELIMITER ;

