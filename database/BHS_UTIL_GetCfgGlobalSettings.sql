DROP PROCEDURE if EXISTS `get_bhs_util_cfg_global_settings` ;
DELIMITER $$
CREATE PROCEDURE `get_bhs_util_cfg_global_settings`()
BEGIN
	SELECT * 
	FROM cfg_global_settings;
END $$
DELIMITER ;