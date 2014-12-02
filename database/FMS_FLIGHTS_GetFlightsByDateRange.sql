
DROP procedure IF EXISTS `FMS_FLIGHTS_GetFlightsByDateRange`;

DELIMITER $$
CREATE PROCEDURE `FMS_FLIGHTS_GetFlightsByDateRange` (IN paramMinDate DATETIME, IN paramMaxDate DATETIME)
BEGIN
	SELECT cur_flights.id,airline,flight_number,departure_time,arrival_time, origin_airport_code, origin_airport.timezone as origin_timezone, destination_airport_code, destination_airport.timezone as destination_timezone, ref_airline_code.IATA_2_digit_ID
	FROM cur_flights
INNER JOIN ref_airline_code
ON ref_airline_code.id = cur_flights.airline
INNER JOIN ref_airport_def AS origin_airport ON origin_airport.id = origin_airport_code
INNER JOIN ref_airport_def AS destination_airport ON destination_airport.id = destination_airport_code

WHERE (departure_time < paramMaxDate AND departure_time > paramMinDate) OR (arrival_time < paramMaxDate AND arrival_time > paramMinDate);
END$$

DELIMITER ;
