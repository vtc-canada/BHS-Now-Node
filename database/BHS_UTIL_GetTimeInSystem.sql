DROP PROCEDURE if EXISTS `BHS_UTIL_GetTimeInSystem` ;
DELIMITER $$
CREATE PROCEDURE `BHS_UTIL_GetTimeInSystem`()
BEGIN
SET @last_reset = (SELECT datetime_val FROM cfg_global_settings WHERE id = 1002);

SELECT  
TIME_FORMAT(SEC_TO_TIME(AVG(sec_active)),'%i:%s') AS 'time'
FROM cur_bag_time_active
WHERE cur_bag_time_active.time_out > @last_reset ; 
END $$
DELIMITER ;