DROP PROCEDURE if EXISTS `FMS_MANIFESTS_GetCompanySeats` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFESTS_GetCompanySeats`(IN paramLegId INT)
BEGIN
SELECT
	cur_leg_resource_sharing.id,
	cur_legs_id,
	cur_company_id,
	seats,
	cur_company.name
FROM cur_leg_resource_sharing
	INNER JOIN cur_company ON cur_company.id = cur_leg_resource_sharing.cur_company_id
WHERE 
	cur_legs_id = paramLegId;
END$$
DELIMITER ;
