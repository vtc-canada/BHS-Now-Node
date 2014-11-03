DROP PROCEDURE if EXISTS `BHS_UTIL_GetActiveAirlines` ;

CREATE PROCEDURE `BHS_UTIL_GetActiveAirlines`()
BEGIN
	SELECT ref_airline_code.id
		,ref_airline_code.carrier
		,ref_airline_code.IATA_code
		,ref_airline_code.IATA_2_digit_ID 
	FROM ref_airline_code 
	INNER JOIN cfg_active_airlines ON cfg_active_airlines.id = ref_airline_code.id 
	WHERE cfg_active_airlines.active = 1;
END