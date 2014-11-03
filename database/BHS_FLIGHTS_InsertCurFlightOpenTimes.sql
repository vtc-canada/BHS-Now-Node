DROP PROCEDURE if EXISTS `BHS_FLIGHTS_InsertCurFlightOpenTimes` ;

CREATE PROCEDURE `BHS_FLIGHTS_InsertCurFlightOpenTimes`(IN v_flight INT(11),
	IN v_dep_date DATE,
	IN v_date DATETIME,
	IN t_open INT(11),
	IN t_late INT(11),
	IN t_locked INT(11)
)
BEGIN
	INSERT INTO cur_flight_open_times (flight_number
		,departure_date
		,departure_time
		,on_time_open_offset
		,late_open_offset
		,locked_out_open_offset) 
	VALUES (v_flight
		,v_dep_date
		,v_date
		,t_open
		,t_late
		,t_locked);
END