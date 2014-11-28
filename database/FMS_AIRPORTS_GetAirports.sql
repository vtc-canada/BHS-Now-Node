
DROP procedure IF EXISTS `FMS_AIRPORTS_GetAirports`;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `FMS_AIRPORTS_GetAirports`()
BEGIN
	SELECT ref_airport_def.id,name,city,country,IATAFAA,ICAO,latitude,longitude,altitude,timezone,dst,tz
FROM ref_airport_def
INNER JOIN cfg_active_airports ON (cfg_active_airports.id = ref_airport_def.id)
WHERE cfg_active_airports.active = 1;
END$$

DELIMITER ;
