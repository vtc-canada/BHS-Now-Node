USE `bhs_scada`;
DROP procedure IF EXISTS `BHS_UTIL_UpdateLastResetTime`;

DELIMITER $$
USE `bhs_scada`$$
CREATE DEFINER=`root`@`%` PROCEDURE `BHS_UTIL_UpdateLastResetTime`()
BEGIN
	UPDATE cfg_global_settings SET datetime_val = NOW() WHERE description = 'last_reset_time';
END$$

DELIMITER ;

