
DROP procedure IF EXISTS `FMS_FLIGHTS_GetCompanyResourceSharingByLegId`;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `FMS_FLIGHTS_GetCompanyResourceSharingByLegId`(IN legId INT(11))
BEGIN
	SELECT cur_leg_resource_sharing.id, cur_leg_resource_sharing.cur_legs_id, cur_leg_resource_sharing.cur_company_id, cur_leg_resource_sharing.seats, cur_company.name
FROM cur_leg_resource_sharing
	INNER JOIN cur_company ON cur_company.id = cur_leg_resource_sharing.cur_company_id
WHERE cur_legs_id = legId;
END$$
