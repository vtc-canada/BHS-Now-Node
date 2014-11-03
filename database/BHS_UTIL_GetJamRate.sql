DROP PROCEDURE if EXISTS `BHS_UTIL_GetJamRate` ;
DELIMITER $$
CREATE PROCEDURE `BHS_UTIL_GetJamRate`()
BEGIN
SET @startTime = (SELECT datetime_val FROM cfg_global_settings WHERE id = 1002);
SET @throughput = (SELECT cur_counts.value FROM cur_counts WHERE cur_counts.id = 1376); #This number is configured job to job

SELECT IF(SUM(cur_counts_history.value)IS NULL,0,SUM(cur_counts_history.value))/(CASE WHEN @throughput > 0 THEN @throughput ELSE -1 END) AS 'jam_rate'
	FROM cfg_dev_id
	INNER JOIN cfg_tag_id ON (cfg_tag_id.dev_ID = cfg_dev_id.id)
	INNER JOIN cur_counts_history ON (cur_counts_history.count_ID = cfg_tag_id.count_ID AND cfg_tag_id.alarm_type = 11
			AND cur_counts_history.timestamp > @startTime);
		#WHERE cfg_dev_id.type = 11;
END $$