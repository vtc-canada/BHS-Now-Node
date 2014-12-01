
DROP procedure IF EXISTS `FMS_FLIGHTS_CreateFlight`;

DELIMITER $$
CREATE PROCEDURE `FMS_FLIGHTS_CreateFlight` (IN paramAirline INT, IN paramFlight_number INT, IN paramDeparture_time DATETIME, IN paramArrival_time DATETIME,  IN paramOrigin_airport_code INT, IN paramDestination_airport_code INT)
BEGIN
	INSERT INTO cur_flights (`airline`, `flight_number`, `departure_time`, `arrival_time`, `origin_airport_code`, `destination_airport_code`)
VALUES
	(paramAirline, paramFlight_number, paramDeparture_time, paramArrival_time, paramOrigin_airport_code, paramDestination_airport_code);

END$$

DELIMITER ;
