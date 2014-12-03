
DROP procedure IF EXISTS `FMS_FLIGHTS_ClearCfgCompanyFlightMappings`;

DELIMITER $$
CREATE PROCEDURE `FMS_FLIGHTS_ClearCfgCompanyFlightMappings` (IN paramCompany_ID INT,IN paramFlight_ID INT)
BEGIN
	DELETE FROM cur_company_flight_mapping 
WHERE 
(paramCompany_ID IS NOT NULL OR paramFlight_ID IS NOT NULL)
AND (paramFlight_ID IS NULL OR cur_company_flight_mapping.flight_ID = paramFlight_ID)
AND (paramCompany_ID IS NULL OR cur_company_flight_mapping.company_ID = paramCompany_ID);
END$$
DELIMITER ;
