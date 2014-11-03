DROP PROCEDURE if EXISTS `BHS_UTIL_GetFlightsByDate` ;

CREATE PROCEDURE `BHS_UTIL_GetFlightsByDate`(IN `v_date` DATE)
BEGIN
	SELECT FALSE AS deleted
		,id
		,flight_number
		,airline
		,departure_time
		,on_time_open_offset
		,late_open_offset
		,locked_out_open_offset
		,virtual_early_dest
		,virtual_on_time_dest
		,virtual_late_dest
		,virtual_locked_out_dest  
	FROM cur_offline_sort_plan 
	WHERE departure_date = v_date;
END