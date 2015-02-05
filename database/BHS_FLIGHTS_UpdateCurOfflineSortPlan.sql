DROP PROCEDURE if EXISTS `BHS_FLIGHTS_UpdateCurOfflineSortPlan` ;
DELIMITER $$
CREATE PROCEDURE `BHS_FLIGHTS_UpdateCurOfflineSortPlan`(IN v_time DATETIME,
	IN t_open INT(11),
	IN t_late INT(11),
	IN t_locked INT(11),
	IN v_early INT(11),
	IN v_on_time INT(11),
	IN v_late INT(11),
	IN v_locked INT(11),
	IN t_id INT(11)
)
BEGIN
	UPDATE cur_offline_sort_plan 
	SET departure_time = v_time 
		,on_time_open_offset = t_open
		,late_open_offset = t_late
		,locked_out_open_offset = t_locked
		,virtual_early_dest = v_early
		,virtual_on_time_dest = v_on_time
		,virtual_late_dest = v_late
		,virtual_locked_out_dest = v_locked 
	WHERE id = t_id;
END $$
DELIMITER ;