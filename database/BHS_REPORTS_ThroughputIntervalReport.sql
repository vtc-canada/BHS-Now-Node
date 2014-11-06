
DROP procedure IF EXISTS `BHS_REPORTS_ThroughputIntervalReport`;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `BHS_REPORTS_ThroughputIntervalReport`(IN `startTime` DATETIME, 
	IN `endTime` DATETIME, 
		IN `intervalTime` INT(11),
	OUT `locale` VARCHAR(4096)
)
BEGIN
#CREATE TEMP Time Interval Table
CALL `BHS_UTIL_CreateTimeInterval`(startTime,endTime, intervalTime);

#Creat a temporary table to contain all devices and a record per every time range value
DROP TEMPORARY TABLE if EXISTS counts;
CREATE TEMPORARY TABLE counts (
		count VARCHAR(64),
	`interval` timestamp,
	KEY(count)
);
INSERT INTO counts(count, `interval`)
	SELECT name as 'count'
		,time_range.interval
	FROM cfg_count_id
	CROSS JOIN time_range
	WHERE counts_group = 1;
#Create temporary table to contain the throughput count for the time range
DROP TEMPORARY TABLE if EXISTS throughput;
CREATE TEMPORARY TABLE throughput (
	count VARCHAR(64),
	`value` INT(11) UNSIGNED,
	`interval` DATETIME,
	KEY(count), 
	KEY(`interval`)
);
INSERT INTO throughput(count, `value`, `interval`)
	SELECT
		cfg_count_id.name AS 'count'
		,cur_counts_history.value 
		,FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(cur_counts_history.timestamp)/intervalTime)*intervalTime) as 'Interval'
	FROM cfg_count_id	
	INNER JOIN cur_counts_history ON (cfg_count_id.id = cur_counts_history.count_ID 
			AND cur_counts_history.timestamp > startTime AND cur_counts_history.timestamp < endTime)
	CROSS JOIN time_range
	WHERE cfg_count_id.counts_group = 1
	GROUP BY FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(cur_counts_history.timestamp)/intervalTime)*intervalTime),cfg_count_id.name
	ORDER BY cfg_count_id.name;

#Joining results with entire time range
SELECT DISTINCT  counts.count
	,counts.interval
	,(IF (throughput.value IS NULL, 0 , throughput.value)) AS 'value'
FROM counts
LEFT JOIN throughput ON (throughput.interval = counts.interval AND throughput.count = counts.count)
ORDER BY counts.count, counts.interval;

#select * from throughput order by throughput.interval;

SET locale = '{"columns":[
			{"width":"0","locale":{"en":"device_ID","es":"device_ID"},"lastrow":{"type":"custom","value":"device","bold":true,"bordertop":false},"hidden":true},
			{"width":"50","locale":{"en":"Device","es":"Dispositivo"},"lastrow":{"type":"custom","value":"Total","bold":true,"bordertop":true},"modifier":"norepeat"},
			{"width":"50","locale":{"en":"Interval","es":"Interval"},"lastrow":{"type":"custom","value":"","bold":true,"bordertop":true},"modifier":"localdatetime"},
			{"width":"25","locale":{"en":"Jams","es":"Jams"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"width":"25","locale":{"en":"Total","es":"Total"},"lastrow":{"type":"max","bold":true,"bordertop":true}}
		]}';
END$$

DELIMITER ;

