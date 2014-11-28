
DROP procedure IF EXISTS `FMS_FLIGHTS_GetFlightsByDateRange`;

DELIMITER $$
CREATE PROCEDURE `FMS_FLIGHTS_GetFlightsByDateRange` (IN paramMinDate DATETIME, IN paramMaxDate DATETIME)
BEGIN
	SELECT id,airline,flight_number,departure_date_time,arrival_date_time, origin_airport_code, destination_airport_code
	FROM cur_flights
WHERE departure_date_time > paramMinDate and departure_date_time < paramMaxDate;
END$$

DELIMITER ;
