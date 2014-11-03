DROP PROCEDURE if EXISTS `BHS_DEFAULT_CARRIER_DESTINATION_GetCarriers` ;

CREATE PROCEDURE  `BHS_DEFAULT_CARRIER_DESTINATION_GetCarriers` () 
BEGIN
	SELECT cfg_carriers.id
		,cfg_carriers.carrier_sort_active
		,cfg_carriers.flight_sort_active
		,ref_airline_code.carrier
		,cur_virtual_2_physical.id AS virt_ID
		,cur_virtual_2_physical.phys_ID
		,cfg_carriers.default_destination 
	FROM cfg_carriers 
	INNER JOIN cur_virtual_2_physical ON cfg_carriers.default_destination = cur_virtual_2_physical.id 
	INNER JOIN ref_airline_code ON ref_airline_code.id = cfg_carriers.id;
END