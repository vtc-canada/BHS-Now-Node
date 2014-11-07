
DROP procedure IF EXISTS `BHS_REPORTS_ExecutiveSummaryFaults`;

DELIMITER $$
CREATE PROCEDURE `BHS_REPORTS_ExecutiveSummaryFaults`(IN `startTime` DATETIME,
		IN `endTime` DATETIME,
		OUT `locale` VARCHAR(512)
	)
BEGIN
	SELECT 
		COALESCE((SUM(CASE WHEN cfg_tag_id.alarm_type IN (11,12)  THEN IF (cur_counts_history.value IS NULL ,0,cur_counts_history.value) END)),0) AS 'jams'
		,COALESCE((SUM(CASE WHEN cfg_tag_id.alarm_type IN (13,14)  THEN IF (cur_counts_history.value IS NULL ,0,cur_counts_history.value) END)),0) AS 'e_stop'
		,COALESCE((SUM(CASE WHEN cfg_tag_id.alarm_type IN (1,2,3)  THEN IF (cur_counts_history.value IS NULL ,0,cur_counts_history.value) END)),0) AS 'motor_faults'
		,COALESCE((SUM(CASE WHEN cfg_tag_id.alarm_type IN (5)  THEN IF (cur_counts_history.value IS NULL ,0,cur_counts_history.value) END)),0) AS 'motor_disconnect'
	FROM cfg_tag_id 
	INNER JOIN cur_counts_history ON (cur_counts_history.count_ID = cfg_tag_id.count_ID 
			AND cur_counts_history.timestamp > startTime AND cur_counts_history.timestamp < endTime and value = 1)
	INNER JOIN cfg_count_id ON cfg_count_id.id = cfg_tag_id.count_ID ;

	SET locale = '{"columns":[
			{"locale":{"en":"Jams","es":"Jams"}},
			{"locale":{"en":"E-Stop","es":"E-Stop"}},
			{"locale":{"en":"Motor Faults","es":"Motor Faults"}},
			{"locale":{"en":"Motor Disconnect","es":"Motor Disconnect"}}
			]}';

END $$
DELIMITER ;
