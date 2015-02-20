
DROP procedure IF EXISTS `FMS_FLIGHTS_GetCompanyResourceSharingByFlightId`;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `FMS_FLIGHTS_GetCompanyResourceSharingByFlightId`(IN flightId INT(11))
BEGIN
	SELECT cur_leg_resource_sharing.id, cur_leg_resource_sharing.cur_legs_id, cur_leg_resource_sharing.cur_company_id, cur_leg_resource_sharing.seats
FROM cur_legs
INNER JOIN cur_leg_resource_sharing ON cur_leg_resource_sharing.cur_legs_id = cur_legs.id
WHERE cur_legs.flight_id = flightId; 
END$$
