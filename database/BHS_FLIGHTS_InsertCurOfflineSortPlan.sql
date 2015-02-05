DROP PROCEDURE if EXISTS `BHS_FLIGHTS_InsertCurOfflineSortPlan` ;
DELIMITER $$
CREATE PROCEDURE `BHS_FLIGHTS_InsertCurOfflineSortPlan`(IN v_airline INT(11),
	IN v_flight INT(11),
	IN v_dep_date DATE,
	IN v_early INT(11), 
	IN v_on_time INT(11),
	IN v_late INT(11),
	IN v_locked_out INT(11),
	IN v_date DATETIME,
	IN t_open INT(11),
	IN t_late INT(11),
	IN t_locked INT(11)
)
BEGIN
 	INSERT INTO cur_offline_sort_plan (airline,
		flight_number,
		departure_date,
		virtual_early_dest,
		virtual_on_time_dest,
		virtual_late_dest,
		virtual_locked_out_dest,
		departure_time,
		on_time_open_offset,
		late_open_offset,
		locked_out_open_offset) 
	VALUES (v_airline,
		v_flight,
		v_dep_date,
		v_early,
		v_on_time,
		v_late,
		v_locked_out,
		v_date,
		t_open,
		t_late,
		t_locked);
END $$
DELIMITER ;