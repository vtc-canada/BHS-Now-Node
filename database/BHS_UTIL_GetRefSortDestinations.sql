
DROP procedure IF EXISTS `BHS_UTIL_GetRefSortDestinations`;

DELIMITER $$
CREATE PROCEDURE `BHS_UTIL_GetRefSortDestinations` ()
BEGIN
	SELECT * FROM ref_sort_destinations;
END$$

DELIMITER ;

