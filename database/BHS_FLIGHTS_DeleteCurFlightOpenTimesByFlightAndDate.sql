DROP PROCEDURE if EXISTS `BHS_FLIGHTS_DeleteCurFlightOpenTimesByFlightAndDate` ;

CREATE PROCEDURE `BHS_FLIGHTS_DeleteCurFlightOpenTimesByFlightAndDate`(IN f_number INT(11),IN d_date DATE)
BEGIN
	DELETE 
	FROM cur_flight_open_times 
	WHERE ( flight_number = f_number AND departure_date = d_date);
END