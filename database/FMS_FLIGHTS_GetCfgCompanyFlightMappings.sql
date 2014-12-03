DROP procedure IF EXISTS `FMS_FLIGHTS_GetCfgCompanyFlightMappings`;

DELIMITER $$
CREATE PROCEDURE `FMS_FLIGHTS_GetCfgCompanyFlightMappings` (IN paramFlightId INT)
BEGIN
	SELECT cur_company.name, cur_company.id, IF(cur_company_flight_mapping.id IS NULL,0,1) AS assigned
FROM cur_company
LEFT OUTER JOIN cur_company_flight_mapping ON ( cur_company_flight_mapping.company_ID = cur_company.id AND cur_company_flight_mapping.flight_ID = paramFlightId )
WHERE cur_company.is_deleted = 0
ORDER BY cur_company.name ASC;
END$$

DELIMITER ;