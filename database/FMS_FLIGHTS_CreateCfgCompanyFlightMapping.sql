
DROP procedure IF EXISTS `FMS_FLIGHTS_CreateCfgCompanyFlightMapping`;

DELIMITER $$
CREATE PROCEDURE `FMS_FLIGHTS_CreateCfgCompanyFlightMapping` (IN paramCompany_ID INT,IN paramFlight_ID INT)
BEGIN

INSERT INTO cur_company_flight_mapping (flight_ID, company_ID)
VALUES
(paramFlight_ID,paramCompany_ID);
END$$
DELIMITER ;
