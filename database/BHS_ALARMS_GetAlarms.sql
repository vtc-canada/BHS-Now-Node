DROP PROCEDURE if EXISTS `BHS_ALARMS_GetAlarms` ;
DELIMITER $$
CREATE PROCEDURE  `BHS_ALARMS_GetAlarms` () 
BEGIN
	SELECT cur_alarms.id
		,cfg_tag_id.id AS tag_ID
		,cur_alarms.timestamp
		,cfg_eqp_id.name AS equipment
		,cfg_dev_id.name AS device
		,ref_alarms_def.text
		,ref_alarms_def.severity
		,ref_main_color_def.color_code as 'background_color'
		,ref_text_color_def.color_code as 'text_color'
	FROM cur_alarms 
	INNER JOIN cfg_tag_id ON cur_alarms.tag_ID = cfg_tag_id.id 
	INNER JOIN ref_alarms_def ON ref_alarms_def.id = cfg_tag_id.alarm_type
	INNER JOIN ref_status_def ON ref_status_def.id = ref_alarms_def.status
	INNER JOIN ref_color_def AS ref_main_color_def ON ref_main_color_def.id = ref_status_def.color_ID
	INNER JOIN ref_color_def AS ref_text_color_def ON ref_text_color_def.id = ref_status_def.text_color_ID
	LEFT OUTER JOIN cfg_dev_id ON cfg_dev_id.id = cfg_tag_id.dev_ID 
	LEFT OUTER JOIN cfg_eqp_id ON cfg_eqp_id.id = cfg_tag_id.eqp_ID;
END $$
DELIMITER ;