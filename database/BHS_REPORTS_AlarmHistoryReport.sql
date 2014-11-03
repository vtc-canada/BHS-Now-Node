DROP PROCEDURE if EXISTS `BHS_REPORTS_AlarmHistoryReport` ;
DELIMITER $$
CREATE PROCEDURE `BHS_REPORTS_AlarmHistoryReport`(IN `startTime` DATETIME,
		IN `endTime` DATETIME, 
		IN `faultType` INT(11), 
		IN `eqpId` INT(11), 
		IN `devId` INT(11), 
		OUT `locale` VARCHAR(512)
	)
BEGIN
	SELECT cur_alarm_history.timeon
		,cfg_eqp_id.name AS eqp_name
		,IF(cfg_dev_id.name IS NULL,'',cfg_dev_id.name) AS dev_name
		,ref_alarms_def.text AS fault
		,(IF(cur_alarm_history.timeoff IS NULL, NOW(), cur_alarm_history.timeoff) - cur_alarm_history.timeon) AS duration 
	FROM cur_alarm_history 
	INNER JOIN cfg_tag_id ON (cur_alarm_history.tag_ID = cfg_tag_id.id) 
	LEFT OUTER JOIN cfg_dev_id ON (cfg_dev_id.id = cfg_tag_id.dev_ID)
	LEFT OUTER JOIN cfg_eqp_id ON (cfg_eqp_id.id = cfg_tag_id.eqp_ID)
	LEFT OUTER JOIN ref_alarms_def ON (ref_alarms_def.id = cfg_tag_id.alarm_type)
	WHERE (faultType IS NULL OR (cfg_tag_id.alarm_type = faultType))
		AND (eqpId IS NULL OR (cfg_tag_id.eqp_ID = eqpId))
		AND (devId IS NULL OR (cfg_tag_id.dev_ID = devId)) 
		AND (cur_alarm_history.timeon >= startTime)
		AND (cur_alarm_history.timeon <= endTime);

	SET locale = '{"columns":[
			{"locale":{"en":"Alarm Time","es":"Tipo de Alarma"},"modifier":"localdatetime"},
			{"locale":{"en":"Equipment","es":"Equipo"}},
			{"locale":{"en":"Device","es":"Dispositivo"}},
			{"locale":{"en":"Fault","es":"Criticar"}},
			{"locale":{"en":"Duration","es":"Duración"},"modifier":"secondsString"}
			]}';

END $$
DELIMITER ;
