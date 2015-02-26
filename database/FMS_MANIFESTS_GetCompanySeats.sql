DROP PROCEDURE if EXISTS `FMS_MANIFESTS_GetCompanySeats` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFESTS_GetCompanySeats`(IN paramLegId INT)
BEGIN
SELECT
	id,
	cur_legs_id,
	cur_company_id,
	seats
FROM cur_leg_resource_sharing
WHERE 
	cur_legs_id = paramLegId;
END$$
DELIMITER ;
