
DROP procedure IF EXISTS `FMS_FLIGHTS_GetCompanyResourceSharingByLegId`;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `FMS_FLIGHTS_GetCompanyResourceSharingByLegId`(IN legId INT(11))
BEGIN
	SELECT cur_leg_resource_sharing.id, cur_leg_resource_sharing.cur_legs_id, cur_leg_resource_sharing.cur_company_id, cur_leg_resource_sharing.seats
FROM cur_leg_resource_sharing
WHERE cur_legs_id = legId;
END$$
