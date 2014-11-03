DROP PROCEDURE if EXISTS `BHS_REPORTS_EquipmentIntervalSummaryReportJamPE` ;

DELIMITER $$
CREATE PROCEDURE `BHS_REPORTS_EquipmentIntervalSummaryReportJamPE`(IN `startTime` DATETIME, 
	IN `endTime` DATETIME, 
	IN `eqpID` INT(11), 
	IN `devID` INT(11), 
	IN `intervalTime` INT(11),
	OUT `locale` VARCHAR(4096)
)
BEGIN
#CREATE TEMP Time Interval Table
CALL `BHS_UTIL_CreateTimeInterval`(startTime,endTime, intervalTime);

#Creat a temporary table to contain all devices and a record per every time range value
DROP TEMPORARY TABLE if EXISTS devices;
CREATE TEMPORARY TABLE devices (
	dev_ID  INT(11) UNSIGNED,
	device VARCHAR(64),
	`interval` timestamp,
	KEY(dev_ID)
);
INSERT INTO devices(dev_ID, device, `interval`)
SELECT cfg_dev_id.id AS dev_ID 
		,cfg_dev_id.name AS device	
		,`interval`
	FROM cfg_dev_id
	INNER JOIN cfg_tag_id ON (cfg_tag_id.dev_ID = cfg_dev_id.id)
	CROSS JOIN time_range
	WHERE cfg_dev_id.type = 11 		
		AND (devID is NULL OR cfg_dev_id.id = devID )
		AND (eqpID IS NULL OR cfg_dev_id.eqp_ID = eqpID);

#Create temporary table to contain the bags count for the time range
DROP TEMPORARY TABLE if EXISTS bags_count;
CREATE TEMPORARY TABLE bags_count (
	dev_ID  INT(11) UNSIGNED,
	device VARCHAR(64),
	total_bags_counts INT(11) UNSIGNED,
	`interval` DATETIME,
	KEY(dev_ID), 
	KEY(`interval`)
);
INSERT INTO bags_count(dev_ID, device, total_bags_counts, `interval`)
SELECT cfg_dev_id.id AS dev_ID 
		,cfg_dev_id.name AS device	
		,IF(SUM(cur_counts_history.value) IS NULL,0,SUM(cur_counts_history.value)) AS total_bags_counts
		,FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(cur_counts_history.timestamp)/intervalTime)*intervalTime) as 'interval'
	FROM cfg_dev_id
	INNER JOIN cfg_tag_id ON (cfg_tag_id.dev_ID = cfg_dev_id.id)
	INNER JOIN cfg_count_id ON cfg_count_id.id = cfg_tag_id.count_ID 
	INNER JOIN cur_counts_history ON (cur_counts_history.count_ID = cfg_tag_id.count_ID AND cfg_count_id.counts_group = 2
			AND cur_counts_history.timestamp > startTime AND cur_counts_history.timestamp < endTime)
	WHERE cfg_dev_id.type = 11 
		AND (devID is NULL OR cfg_dev_id.id = devID )
		AND (eqpID IS NULL OR cfg_dev_id.eqp_ID = eqpID)
	GROUP BY FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(cur_counts_history.timestamp)/intervalTime)*intervalTime),cfg_dev_id.id;

#Create temporary table to contain the jam count for the time range
DROP TEMPORARY TABLE if EXISTS jam_counts;
CREATE TEMPORARY TABLE jam_counts (
	dev_ID  INT(11) UNSIGNED,
	device VARCHAR(64),
	jams INT(11) UNSIGNED,
	`interval` DATETIME,
	KEY(dev_ID), 
	KEY(`interval`)
);
INSERT INTO jam_counts(dev_ID, device, jams, `interval`)
SELECT cfg_dev_id.id AS dev_ID 
		,cfg_dev_id.name AS device	
		,IF(SUM(cur_counts_history.value) IS NULL,0,SUM(cur_counts_history.value)) AS jams
		,FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(cur_counts_history.timestamp)/intervalTime)*intervalTime) as 'Interval'
	FROM cfg_dev_id
	INNER JOIN cfg_tag_id ON (cfg_tag_id.dev_ID = cfg_dev_id.id)
	INNER JOIN cur_counts_history ON (cur_counts_history.count_ID = cfg_tag_id.count_ID AND cfg_tag_id.alarm_type = 11
			AND cur_counts_history.timestamp > startTime AND cur_counts_history.timestamp < endTime)
	WHERE cfg_dev_id.type = 11 
		AND (devID is NULL OR cfg_dev_id.id = devID )
		AND (eqpID IS NULL OR cfg_dev_id.eqp_ID = eqpID)
	GROUP BY FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(cur_counts_history.timestamp)/intervalTime)*intervalTime) ,cfg_dev_id.id;

#Joining results with entire time range
SELECT DISTINCT devices.dev_ID
	,devices.device
	,devices.interval
	,(IF (jam_counts.jams IS NULL, 0 , jam_counts.jams)) AS 'jams'
	,(IF (bags_count.total_bags_counts IS NULL, 0 , bags_count.total_bags_counts)) AS 'total_bags_counts'	
FROM devices	
LEFT JOIN bags_count ON (bags_count.interval = devices.interval AND bags_count.dev_ID = devices.dev_ID)
LEFT JOIN jam_counts ON (jam_counts.interval = devices.interval AND jam_counts.dev_ID = devices.dev_ID)
ORDER BY devices.dev_ID, devices.interval;

SET locale = '{"columns":[
			{"width":"0","locale":{"en":"device_ID","es":"device_ID"},"lastrow":{"type":"custom","value":"device","bold":true,"bordertop":false},"hidden":true},
			{"width":"50","locale":{"en":"Device","es":"Dispositivo"},"lastrow":{"type":"custom","value":"Total","bold":true,"bordertop":true},"modifier":"norepeat"},
			{"width":"50","locale":{"en":"Interval","es":"Interval"},"lastrow":{"type":"custom","value":"","bold":true,"bordertop":true},"modifier":"localdatetime"},
			{"width":"25","locale":{"en":"Jams","es":"Jams"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"width":"25","locale":{"en":"Total","es":"Total"},"lastrow":{"type":"max","bold":true,"bordertop":true,"decimalplaces":2}}
		]}';
END$$
DELIMITER ;