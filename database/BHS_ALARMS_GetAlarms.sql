DROP PROCEDURE if EXISTS `BHS_ALARMS_GetAlarms` ;

CREATE PROCEDURE  `BHS_ALARMS_GetAlarms` () 
BEGIN
	SELECT cur_alarms.id
		,cfg_tag_id.id AS tag_ID
		,cur_alarms.timestamp
		,cfg_eqp_id.name AS equipment
		,cfg_dev_id.name AS device
		,ref_alarms_def.text
		,ref_alarms_def.severity
	FROM cur_alarms 
	INNER JOIN cfg_tag_id ON cur_alarms.tag_ID = cfg_tag_id.id 
	INNER JOIN ref_alarms_def ON ref_alarms_def.id = cfg_tag_id.alarm_type 
	LEFT OUTER JOIN cfg_dev_id ON cfg_dev_id.id = cfg_tag_id.dev_ID 
	LEFT OUTER JOIN cfg_eqp_id ON cfg_eqp_id.id = cfg_tag_id.eqp_ID;
END