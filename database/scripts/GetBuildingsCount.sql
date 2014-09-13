USE cred;
DROP PROCEDURE if EXISTS `GetBuildingsCount` ;

DELIMITER $$

CREATE PROCEDURE `GetBuildingsCount`()
BEGIN
SELECT
	Count(cur_address.id) AS 'number_of_buildings' 
FROM 
	cur_address
	INNER JOIN ref_address_type ON (ref_address_type.id = cur_address.address_type_id AND ref_address_type.type = 'Asset')
WHERE 
	cur_building.is_deleted = 0;
END$$
DELIMITER ;