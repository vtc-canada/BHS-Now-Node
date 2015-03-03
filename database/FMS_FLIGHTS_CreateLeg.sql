DROP PROCEDURE IF EXISTS `FMS_FLIGHTS_CreateLeg`;

DELIMITER $$
CREATE PROCEDURE `FMS_FLIGHTS_CreateLeg` (IN flightID INT,IN airline INT, IN flightNumber INT
				, IN departureTime DATETIME, IN arrivalTime DATETIME,IN originAirportCode INT
				, IN destinationAirportCode INT, IN airplaneID INT, OUT insertID INT)
BEGIN
	INSERT INTO cur_legs (flight_id
			,airline
			,flight_number
			,departure_time
			,arrival_time
			,origin_airport_code
			,destination_airport_code
			,cur_airplanes_id)
VALUES
	(flightID
	,airline
	,flightNumber
	,departureTime
	,arrivalTime
	,originAirportCode
	,destinationAirportCode
	,airplaneID);
SET insertID = LAST_INSERT_ID();
END$$

DELIMITER ;
