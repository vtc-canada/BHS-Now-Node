
DROP procedure IF EXISTS `FMS_FLIGHTS_DeleteCompanyResourceSharing`;

DELIMITER $$
CREATE PROCEDURE `FMS_FLIGHTS_DeleteCompanyResourceSharing`(IN resourceId INT(11))
BEGIN
	DELETE FROM cur_leg_resource_sharing 
WHERE id = resourceId;
END$$
