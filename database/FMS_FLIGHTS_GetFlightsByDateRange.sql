DROP PROCEDURE IF EXISTS `FMS_FLIGHTS_GetFlightsByDateRange`;
DELIMITER $$
CREATE PROCEDURE `FMS_FLIGHTS_GetFlightsByDateRange`(IN minDate DATETIME, IN maxDate DATETIME,IN isAdmin BOOLEAN, IN userID INT)
BEGIN
	SELECT cur_legs.id
		,flight_id
		,airline
		,flight_number
		,departure_time
		,DATE_FORMAT((DATE_ADD(departure_time,INTERVAL origin_airport.timezone HOUR)),'%H:%i:%s') as departure_time_only
		,arrival_time
		,DATE_FORMAT((DATE_ADD(arrival_time,INTERVAL destination_airport.timezone HOUR)),'%H:%i:%s') as arrival_time_only
		,origin_airport_code
		,origin_airport.timezone as origin_timezone
		,destination_airport_code
		,destination_airport.timezone as destination_timezone
		,ref_airline_code.IATA_2_digit_ID
		,cur_airplanes_id
	FROM cur_legs
		INNER JOIN ref_airline_code ON (ref_airline_code.id = cur_legs.airline)
		INNER JOIN ref_airport_def AS origin_airport ON origin_airport.id = origin_airport_code
		INNER JOIN ref_airport_def AS destination_airport ON destination_airport.id = destination_airport_code
		LEFT JOIN cur_leg_resource_sharing ON cur_leg_resource_sharing.cur_legs_id = cur_legs.id
		LEFT JOIN cur_company ON (cur_company.id = cur_leg_resource_sharing.cur_company_id)
		LEFT JOIN cur_user_company_mapping ON (cur_user_company_mapping.company_ID = cur_company.id AND cur_user_company_mapping.user_ID = userID)
	WHERE ((departure_time < maxDate AND departure_time > minDate) 
		OR (arrival_time < maxDate AND arrival_time > minDate)
		OR flight_id IN (SELECT DISTINCT(flight_ID)
						FROM cur_legs
						WHERE (departure_time < maxDate AND departure_time > minDate) 
							OR (arrival_time < maxDate AND arrival_time > minDate)))
		AND (isAdmin = true OR cur_user_company_mapping.company_ID IS NOT NULL)
	GROUP BY cur_legs.id
	ORDER BY departure_time;
END$$
DELIMITER ;

