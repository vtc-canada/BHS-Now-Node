DROP PROCEDURE if EXISTS `BHS_UTIL_GetThroughput` ;
DELIMITER $$
CREATE PROCEDURE `BHS_UTIL_GetThroughput`()
BEGIN
	SELECT
		cfg_count_id.id AS 'count_id'
		,cfg_count_id.name AS 'count'
		,cur_counts.value 
	FROM cfg_count_id
	INNER JOIN cur_counts ON (cfg_count_id.id = cur_counts.id)
	WHERE cfg_count_id.counts_group = 1;
END $$
DELIMITER ;