
DROP procedure IF EXISTS `FMS_FLIGHTS_UpdateCompanyResourceSharing`;

DELIMITER $$
CREATE PROCEDURE `FMS_FLIGHTS_UpdateCompanyResourceSharing`(IN curLegsId INT(11), IN curCompanyId INT(11), IN seats INT(11), IN resourceId INT(11))
BEGIN
	UPDATE cur_leg_resource_sharing 
	SET `cur_legs_id` = curLegsId
	,`cur_company_id` = curCompanyId
	,`seats` = seats
WHERE id = resourceId;
END$$
