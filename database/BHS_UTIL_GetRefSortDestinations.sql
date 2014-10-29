USE `bhs_scada`;
DROP procedure IF EXISTS `BHS_UTIL_GetRefSortDestinations`;

DELIMITER $$
USE `bhs_scada`$$
CREATE PROCEDURE `BHS_UTIL_GetRefSortDestinations` ()
BEGIN
	SELECT * FROM ref_sort_destinations;
END$$

DELIMITER ;

