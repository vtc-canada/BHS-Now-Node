
DROP procedure IF EXISTS `FMS_FLIGHTS_CreateLeg`;

DELIMITER $$
CREATE PROCEDURE `FMS_FLIGHTS_CreateLeg` (IN paramFlight_id INT,IN paramAirline INT, IN paramFlight_number INT, IN paramDeparture_time DATETIME, IN paramArrival_time DATETIME,  IN paramOrigin_airport_code INT, IN paramDestination_airport_code INT, OUT paramInsertId INT)
BEGIN
	INSERT INTO cur_flights (`flight_id`, `airline`, `flight_number`, `departure_time`, `arrival_time`, `origin_airport_code`, `destination_airport_code`)
VALUES
	(paramFlight_id, paramAirline, paramFlight_number, paramDeparture_time, paramArrival_time, paramOrigin_airport_code, paramDestination_airport_code);
SET paramInsertId = LAST_INSERT_ID();
END$$

DELIMITER ;
