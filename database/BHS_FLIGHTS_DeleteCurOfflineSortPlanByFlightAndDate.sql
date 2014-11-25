DROP PROCEDURE if EXISTS `BHS_FLIGHTS_DeleteCurOfflineSortPlanByFlightAndDate` ;

CREATE PROCEDURE `BHS_FLIGHTS_DeleteCurOfflineSortPlanByFlightAndDate`(IN f_number INT(11),IN d_date DATE)
BEGIN
	DELETE 
	FROM cur_offline_sort_plan 
	WHERE ( flight_number = f_number AND departure_date = d_date);
END