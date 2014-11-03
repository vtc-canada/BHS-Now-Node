DROP PROCEDURE if EXISTS `BHS_UTIL_GetTotalSortedBags` ;
DELIMITER $$
CREATE PROCEDURE `BHS_UTIL_GetTotalSortedBags`()
BEGIN
SET @startTime = (SELECT datetime_val FROM cfg_global_settings WHERE id = 1002);
	SELECT  
		cfg_dev_id.name AS 'device'
		,CASE WHEN SUM(value) IS NOT NULL THEN SUM(value) ELSE 0 END AS 'total_bag'
	FROM cfg_dev_id
	LEFT JOIN cfg_event_count_id ON (cfg_dev_id.id = cfg_event_count_id.dev_ID AND event_type = 99 )
	LEFT JOIN cur_counts_history ON (cur_counts_history.count_ID = cfg_event_count_id.id AND timestamp > @startTime)
	WHERE cfg_dev_id.id IN (110041, 110051, 110061, 110071, 110081, 110091) 	
	GROUP BY cfg_dev_id.id;
END $$