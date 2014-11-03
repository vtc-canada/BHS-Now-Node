DROP PROCEDURE if EXISTS `BHS_UTIL_GetPrinters` ;

CREATE PROCEDURE `BHS_UTIL_GetPrinters`()
BEGIN
	SELECT id
		,printername
		,drivername
		,portname 
	FROM cur_printers;
END