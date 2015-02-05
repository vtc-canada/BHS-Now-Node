DROP procedure IF EXISTS `BHS_UTIL_UpdateLastResetTime`;

DELIMITER $$

CREATE PROCEDURE `BHS_UTIL_UpdateLastResetTime`()
BEGIN
	UPDATE cfg_global_settings SET datetime_val = UTC_TIMESTAMP() WHERE description = 'last_reset_time';
END $$
DELIMITER ;

