DROP PROCEDURE if EXISTS `BHS_FLIGHTS_UpdateCurFlightOpenTimes` ;

CREATE PROCEDURE `BHS_FLIGHTS_UpdateCurFlightOpenTimes`(IN v_time DATETIME, 
	IN t_on_time INT(11), 
	IN t_late INT(11), 
	IN t_locked INT(11), 
	IN v_flight INT(11) ,
	IN v_date DATE
)
BEGIN
	UPDATE cur_flight_open_times 
	SET departure_time = v_time 
		, on_time_open_offset = t_on_time
		, late_open_offset = t_late
		, locked_out_open_offset = t_locked 
	WHERE flight_number = v_flight 
		AND departure_date = v_date;
END