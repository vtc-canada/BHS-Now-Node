
DROP procedure IF EXISTS `BHS_UTIL_GetPrinters`;

DELIMITER $$
CREATE PROCEDURE `BHS_UTIL_GetPrinters` ()
BEGIN
	SELECT id
		,printername
		,drivername
		,portname
	FROM cur_printers;
END$$

DELIMITER ;
