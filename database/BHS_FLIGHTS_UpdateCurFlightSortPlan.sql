DROP PROCEDURE if EXISTS `BHS_FLIGHTS_UpdateCurFlightSortPlan` ;
DELIMITER $$
CREATE PROCEDURE `BHS_FLIGHTS_UpdateCurFlightSortPlan`(IN v_early INT(11), 
	IN v_on_time INT(11), 
	IN v_late INT(11),
	IN v_locked INT(11),
	IN v_flight INT(11),
	IN v_date DATE
)
BEGIN
	UPDATE cur_flight_sort_plan 
	SET virtual_early_dest = v_early
		,virtual_on_time_dest = v_on_time
		,virtual_late_dest = v_late
		,virtual_locked_out_dest = v_locked 
	WHERE flight_number = v_flight 
		AND departure_date = v_date;
END $$
DELIMITER ;