DROP PROCEDURE if EXISTS `FMS_MANIFESTS_GetCompanies` ;

DELIMITER $$

CREATE PROCEDURE `FMS_MANIFESTS_GetCompanies`()
BEGIN
SELECT
	id,
	`name`,
	phone_number
FROM cur_company
WHERE 
	is_deleted = 0;
END$$
DELIMITER ;
