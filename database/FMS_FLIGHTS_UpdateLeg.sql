
DROP procedure IF EXISTS `FMS_FLIGHTS_UpdateLeg`;

DELIMITER $$
CREATE PROCEDURE `FMS_FLIGHTS_UpdateLeg` (IN paramFlight_id INT,IN paramId INT,IN paramAirline INT, IN paramFlight_number INT, IN paramDeparture_time DATETIME, IN paramArrival_time DATETIME,  IN paramOrigin_airport_code INT, IN paramDestination_airport_code INT, IN paramAirplaneId INT)
BEGIN
	UPDATE cur_legs SET
flight_id = paramFlight_id
,airline = paramAirline 
,flight_number = paramFlight_number
,departure_time = paramDeparture_time
,arrival_time = paramArrival_time
,origin_airport_code= paramOrigin_airport_code
,destination_airport_code = paramDestination_airport_code 
,cur_airplanes_id = paramAirplaneId
WHERE id = paramId;
END$$
DELIMITER ;
