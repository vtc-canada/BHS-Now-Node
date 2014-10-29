USE `bhs_scada`;
DROP procedure IF EXISTS `BHS_UTIL_GetRefVirtualDestinations`;

DELIMITER $$
USE `bhs_scada`$$
CREATE PROCEDURE `BHS_UTIL_GetRefVirtualDestinations` ()
BEGIN
	SELECT * FROM ref_virtual_destinations;
END$$

DELIMITER ;

