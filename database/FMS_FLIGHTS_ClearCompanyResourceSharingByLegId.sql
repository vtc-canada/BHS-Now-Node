
DROP procedure IF EXISTS `FMS_FLIGHTS_ClearCompanyResourceSharingByLegId`;

DELIMITER $$
CREATE PROCEDURE `FMS_FLIGHTS_ClearCompanyResourceSharingByLegId`(IN legId INT(11))
BEGIN
	DELETE FROM cur_leg_resource_sharing 
WHERE cur_legs_id = legId;
END$$
