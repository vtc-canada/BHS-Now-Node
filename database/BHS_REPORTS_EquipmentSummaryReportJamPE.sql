DROP PROCEDURE if EXISTS `BHS_REPORTS_EquipmentSummaryReportJamPE` ;

DELIMITER $$
CREATE PROCEDURE `BHS_REPORTS_EquipmentSummaryReportJamPE`(IN `startTime` DATETIME, 
	IN `endTime` DATETIME, 
	IN `eqpID` INT(11), 
	IN `devID` INT(11), 
	OUT `locale` VARCHAR(4096)
)
BEGIN
	SELECT cfg_dev_id.id AS dev_ID 
		,cfg_dev_id.name AS device	
		,IF(SUM(jam_counts.value) IS NULL,0,SUM(jam_counts.value)) AS jams
		,IF(SUM(total_bags_counts.value) IS NULL,0,SUM(total_bags_counts.value)) AS total_bags_counts
	FROM cfg_dev_id
	INNER JOIN cfg_tag_id ON (cfg_tag_id.dev_ID = cfg_dev_id.id)
	LEFT JOIN cur_counts_history AS jam_counts ON (jam_counts.count_ID = cfg_tag_id.count_ID AND cfg_tag_id.alarm_type = 11
			AND jam_counts.timestamp > startTime AND jam_counts.timestamp < endTime)
	INNER JOIN cfg_count_id ON cfg_count_id.id = cfg_tag_id.count_ID 
	LEFT JOIN cur_counts_history AS total_bags_counts ON (total_bags_counts.count_ID = cfg_tag_id.count_ID AND cfg_count_id.counts_group = 2
			AND total_bags_counts.timestamp > startTime AND total_bags_counts.timestamp < endTime)
	WHERE cfg_dev_id.type = 11 
		AND (devID is NULL OR cfg_dev_id.id = devID )
		AND (eqpID IS NULL OR cfg_dev_id.eqp_ID = eqpID)
	GROUP BY cfg_dev_id.id;

SET locale = '{"columns":[
			{"width":"0","locale":{"en":"device_ID","es":"device_ID"},"lastrow":{"type":"custom","value":"device","bold":true,"bordertop":false},"hidden":true},
			{"width":"50","locale":{"en":"Device","es":"Dispositivo"},"lastrow":{"type":"custom","value":"Total","bold":true,"bordertop":true}},
			{"width":"25","locale":{"en":"Jams","es":"Jams"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"width":"25","locale":{"en":"Total","es":"Total"},"lastrow":{"type":"max","bold":true,"bordertop":true,"decimalplaces":2}}
		]}';
END $$
DELIMITER ;