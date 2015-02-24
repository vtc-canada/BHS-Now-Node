DROP PROCEDURE if EXISTS `GetResourceCategories` ;

DELIMITER $$
CREATE PROCEDURE `GetResourceCategories`()
BEGIN
	SELECT ref_resource_category.id
		,ref_resource_category.category
	FROM ref_resource_category;
END$$
DELIMITER ; 
