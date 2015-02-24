DROP PROCEDURE if EXISTS `GetWingTypeByResource` ;

DELIMITER $$
CREATE PROCEDURE `GetWingTypeByResource`(IN resourceID INT, IN searchCategory VARCHAR(128))
BEGIN
	SELECT ref_wing_types.id
		,ref_wing_types.`type`
	FROM ref_wing_types
	INNER JOIN ref_resource_category ON (ref_resource_category.id = ref_wing_types.ref_resource_category_id)
	WHERE  (resourceID IS NULL OR ref_resource_category.id = resourceID)
		AND (searchCategory IS NULL OR ref_resource_category.category = searchCategory);
END$$
DELIMITER ; 
