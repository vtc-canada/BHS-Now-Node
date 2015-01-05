DROP procedure IF EXISTS `BHS_REPORTS_ExecutiveSummaryThroughput`;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `BHS_REPORTS_ExecutiveSummaryThroughput`(IN `startTime` DATETIME,
		IN `endTime` DATETIME, 
		OUT `locale` VARCHAR(512)
	)
BEGIN
	SELECT
		cfg_count_id.name AS 'count'
		,SUM(cur_counts_history.value) AS 'throughput' 
	FROM cfg_count_id	
	INNER JOIN cur_counts_history ON (cfg_count_id.id = cur_counts_history.count_ID 
			AND cur_counts_history.timestamp > startTime  AND cur_counts_history.timestamp < endTime )
	WHERE cfg_count_id.counts_group = 1 
	GROUP BY cfg_count_id.name;
	SET locale = '{"columns":[
			{"locale":{"en":"Area","es":"Area"}},
			{"locale":{"en":"Throughput","es":"Throughput"}}
			]}';

END$$

DELIMITER ;

