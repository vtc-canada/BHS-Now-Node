DROP PROCEDURE if EXISTS `BHS_UTIL_GetCurVirtual2Physical` ;
DELIMITER $$
CREATE PROCEDURE `BHS_UTIL_GetCurVirtual2Physical`()
BEGIN
	SELECT * 
	FROM cur_virtual_2_physical;
END $$
DELIMITER ;