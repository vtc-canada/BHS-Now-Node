DROP PROCEDURE if EXISTS `BHS_DEFAULT_CARRIER_DESTINATION_SaveCfgCarrierDefs` ;
DELIMITER $$
CREATE PROCEDURE `BHS_DEFAULT_CARRIER_DESTINATION_SaveCfgCarrierDefs`(IN `v_default_destination` INT(11),
	IN `v_carrier_sort_active` INT(11),
	IN `v_flight_sort_active` INT(11),
	IN `v_carrier_id` INT(11)
)
BEGIN
	UPDATE cfg_carriers 
	SET default_destination = v_default_destination
		, carrier_sort_active = v_carrier_sort_active
		, flight_sort_active = v_flight_sort_active 
	WHERE id = v_carrier_id;
END $$
DELIMITER ;