DROP PROCEDURE if EXISTS `BHS_UTIL_GetTrackingRate` ;
DELIMITER $$
CREATE PROCEDURE `BHS_UTIL_GetTrackingRate`()
BEGIN
SET @startTime = (SELECT datetime_val FROM cfg_global_settings WHERE id = 1002);
SET @throughput = (SELECT cur_counts.value FROM cur_counts WHERE cur_counts.id = 1376); #This number is configured job to job

SELECT 	
		IF(SUM(cur_counts_history.value) IS NULL,0,SUM(cur_counts_history.value))/(CASE WHEN @throughput > 0 THEN @throughput ELSE -1 END) AS 'tracking_rate'
	FROM cfg_dev_id
	LEFT JOIN cfg_event_count_id ON (cfg_event_count_id.dev_ID = cfg_dev_id.id AND cfg_event_count_id.event_type = 91 )
	LEFT JOIN cur_counts_history ON (cur_counts_history.count_ID = cfg_event_count_id.id 
			AND cur_counts_history.timestamp > @startTime)
	WHERE cfg_dev_id.type = 12;
END $$