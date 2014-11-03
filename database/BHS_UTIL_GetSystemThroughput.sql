DROP PROCEDURE if EXISTS `BHS_UTIL_GetSystemThroughput` ;
DELIMITER $$
CREATE PROCEDURE `BHS_UTIL_GetSystemThroughput`()
BEGIN
SET @interval = (SELECT cfg_counts_groups.interval FROM cfg_counts_groups WHERE id = 1);
SET @interval = (CASE WHEN @interval IS NULL THEN -1 ELSE @interval END);
SELECT CAST((3600000/@interval)* delta_value AS SIGNED) AS 'system_throughput' FROM cur_reg_counts WHERE id = 1376;
END $$