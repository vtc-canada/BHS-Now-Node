DROP PROCEDURE if EXISTS `BHS_UTIL_GetCurVirtual2Physical` ;
DELIMITER $$
CREATE PROCEDURE `BHS_UTIL_GetCurVirtual2Physical`()
BEGIN
 	SELECT cur_virtual_2_physical.id
 		,cur_virtual_2_physical.phys_ID
		,ref_sort_destinations.destination AS virt_destination 
	FROM cur_virtual_2_physical 
	INNER JOIN ref_sort_destinations ON ref_sort_destinations.id = cur_virtual_2_physical.id;
END $$
DELIMITER ;