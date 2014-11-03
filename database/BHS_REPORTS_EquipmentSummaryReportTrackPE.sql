DROP procedure IF EXISTS `BHS_REPORTS_EquipmentSummaryReportTrackPE`;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `BHS_REPORTS_EquipmentSummaryReportTrackPE`(IN `startTime` DATETIME, 
	IN `endTime` DATETIME, 
	IN `eqpID` INT(11), 
	IN `devID` INT(11), 
	OUT `locale` VARCHAR(4096)
)
BEGIN
####################################
######      Event Counts       #####
####################################
DROP TEMPORARY TABLE if EXISTS event_counts;
CREATE TEMPORARY TABLE event_counts (
	dev_ID  INT(11) UNSIGNED,
	device VARCHAR(64),
	missing_bags INT(11) UNSIGNED,
	unknown_bags INT(11) UNSIGNED,
	purged_bags INT(11) UNSIGNED,
	reject_bags INT(11) UNSIGNED,
	KEY(dev_ID)
);
INSERT INTO event_counts(dev_ID, device, missing_bags,unknown_bags,purged_bags, reject_bags)

SELECT cfg_dev_id.id AS dev_ID 
		,cfg_dev_id.name AS device	
		,(SUM(CASE WHEN cfg_event_count_id.event_type = 91  THEN cur_counts_history.value END)) AS 'missing_bags'
		,(SUM(CASE WHEN cfg_event_count_id.event_type = 2  THEN cur_counts_history.value END)) AS 'unknown_bags'
		,(SUM(CASE WHEN cfg_event_count_id.event_type = 92  THEN IF(cur_counts_history.value IS NULL,0,cur_counts_history.value) END)) AS 'purged_bags'
		,(SUM(CASE WHEN cfg_event_count_id.event_type = 15  THEN IF(cur_counts_history.value IS NULL,0,cur_counts_history.value) END)) AS 'reject_bags'
	FROM cfg_dev_id
	INNER JOIN cfg_event_count_id ON (cfg_event_count_id.dev_ID = cfg_dev_id.id)

	INNER JOIN cur_counts_history ON (cur_counts_history.count_ID = cfg_event_count_id.id
			AND cur_counts_history.timestamp > startTime AND cur_counts_history.timestamp < endTime)
	WHERE cfg_dev_id.type = 12
		AND (devID is NULL OR cfg_dev_id.id = devID )
		AND (eqpID IS NULL OR cfg_dev_id.eqp_ID = eqpID)
GROUP BY cfg_dev_id.id,cfg_event_count_id.event_type;


####################################
######      Alarm Counts       #####
####################################
DROP TEMPORARY TABLE if EXISTS alarm_counts;
CREATE TEMPORARY TABLE alarm_counts (
	dev_ID  INT(11) UNSIGNED,
	device VARCHAR(64),
	missing_bag_jams INT(11) UNSIGNED,
	jams INT(11) UNSIGNED,
	KEY(dev_ID)
);
INSERT INTO alarm_counts(dev_ID, device, missing_bag_jams,jams)

	SELECT cfg_dev_id.id AS dev_ID 
		,cfg_dev_id.name AS device	
		,(SUM(CASE WHEN cfg_tag_id.alarm_type = 12  THEN IF(cur_counts_history.value IS NULL,0,cur_counts_history.value) END)) AS 'missing_bag_jams'
		,(SUM(CASE WHEN cfg_tag_id.alarm_type = 11  THEN IF(cur_counts_history.value IS NULL,0,cur_counts_history.value) END)) AS 'jams'
	FROM cfg_dev_id
	INNER  JOIN cfg_tag_id ON (cfg_tag_id.dev_ID = cfg_dev_id.id)
	INNER JOIN cur_counts_history  ON (cfg_tag_id.count_ID = cur_counts_history.count_ID AND 
			cur_counts_history.timestamp > startTime AND cur_counts_history.timestamp < endTime)
	WHERE  (devID is NULL OR cfg_dev_id.id = devID )
		AND (eqpID IS NULL OR cfg_dev_id.eqp_ID = eqpID)
	GROUP BY cfg_dev_id.id,cfg_tag_id.alarm_type;

####################################
######    Register Counts      #####
####################################
DROP TEMPORARY TABLE if EXISTS register_counts;
CREATE TEMPORARY TABLE register_counts (
	dev_ID  INT(11) UNSIGNED,
	device VARCHAR(64),
	total_bags_counts INT(11) UNSIGNED,
	KEY(dev_ID)
);
INSERT INTO register_counts(dev_ID, device, total_bags_counts)

	SELECT cfg_dev_id.id AS dev_ID 
		,cfg_dev_id.name AS device	
		,(SUM(CASE WHEN cfg_count_id.counts_group = 2 THEN IF(cur_counts_history.value IS NULL,0,cur_counts_history.value) END)) AS 'total_bags_counts'
	FROM cfg_dev_id
	INNER  JOIN cfg_tag_id ON (cfg_tag_id.dev_ID = cfg_dev_id.id)
	INNER JOIN cfg_count_id ON (cfg_count_id.id = cfg_tag_id.count_ID)
	INNER JOIN cur_counts_history ON (cur_counts_history.count_ID = cfg_tag_id.count_ID 
			AND cur_counts_history.timestamp > startTime AND cur_counts_history.timestamp < endTime)
	WHERE  (devID is NULL OR cfg_dev_id.id = devID )
		AND (eqpID IS NULL OR cfg_dev_id.eqp_ID = eqpID)
	GROUP BY cfg_dev_id.id,cfg_tag_id.alarm_type;

SELECT cfg_dev_id.id as 'dev_ID'
	,cfg_dev_id.name as 'device'
	,IF(MAX(missing_bags)IS NULL, 0,MAX(missing_bags))  AS missing_bags
	,IF(MAX(unknown_bags)IS NULL, 0,MAX(unknown_bags)) AS unknown_bags
	,IF(MAX(purged_bags)IS NULL, 0,MAX(purged_bags))  AS purged_bags
	,IF(MAX(reject_bags)IS NULL, 0,MAX(reject_bags))  AS reject_bags
	,IF(MAX(missing_bag_jams)IS NULL, 0,MAX(missing_bag_jams))  AS missing_bag_jams
	,IF(MAX(jams)IS NULL, 0,MAX(jams))  AS jams
	,IF(MAX(total_bags_counts)IS NULL, 0,MAX(total_bags_counts))  AS total_bags_counts
FROM cfg_dev_id
LEFT JOIN event_counts ON (event_counts.dev_ID = cfg_dev_id.id)
LEFT JOIN alarm_counts ON (alarm_counts.dev_ID = cfg_dev_id.id)
LEFT JOIN register_counts ON (register_counts.dev_ID = cfg_dev_id.id)
WHERE cfg_dev_id.type = 12
	AND (devID is NULL OR cfg_dev_id.id = devID )
	AND (eqpID IS NULL OR cfg_dev_id.eqp_ID = eqpID)
GROUP BY cfg_dev_id.id;
	
SET locale = '{"columns":[
			{"locale":{"en":"device_ID","es":"device_ID"},"lastrow":{"type":"custom","value":"Total","bold":true,"bordertop":true}, "hidden":true},
			{"locale":{"en":"Device","es":"Dispositivo"},"lastrow":{"type":"custom","value":"Total","bold":true,"bordertop":true}},
			{"locale":{"en":"Missing Bags","es":"Desaparecidos Bolsas"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"Unknown Bags","es":"Desconocido Bolsas"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"Purged Bags","es":"Bolsas Purgados"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"BHS Reject Bags","es":"BHS Rechazar Bolsas"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"Missing Bag Jams","es":"Falta Jams Bolsa"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"Total Jams","es":"Jams Totales"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"Total Bags","es":"Total de Bolsas"},"lastrow":{"type":"max","bold":true,"bordertop":true,"decimalplaces":2}}
			]
		}';
END$$

DELIMITER ;

