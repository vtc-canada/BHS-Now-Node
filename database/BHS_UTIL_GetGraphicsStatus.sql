DROP PROCEDURE if EXISTS `BHS_UTIL_GetGraphicsStatus` ;
DELIMITER $$
CREATE PROCEDURE `BHS_UTIL_GetGraphicsStatus`()
BEGIN
	SELECT cfg_tag_id.id as 'tag_id'
		  ,cfg_tag_id.name as 'tag_name'
		  ,cur_tags.value 'status_value'
		  ,ref_status_def.name as 'status_name'
		  ,color.color_code 
		  ,color.color_name
		  ,color.id as 'color_id'
		  ,ref_status_def.is_flashing
		  ,flash_color.color_code 'flash_color_code'
		  ,flash_color.color_name 'flash_color_name'
		  ,flash_color.id AS 'flash_color_id'
		  ,flash_text_color.color_code 'flash_text_color_code'
		  ,flash_text_color.color_name 'flash_text_color_name'
		  ,flash_text_color.id AS 'flash_text_color_id'
		FROM cfg_tag_id 
		INNER JOIN cfg_plc_id ON (cfg_tag_id.plc_ID = cfg_plc_id.id) 
		LEFT JOIN cfg_count_id ON (cfg_tag_id.count_ID = cfg_count_id.id)
		LEFT JOIN cfg_dev_id ON (cfg_tag_id.dev_ID = cfg_dev_id.id)
		LEFT JOIN cfg_eqp_id ON (cfg_tag_id.eqp_ID = cfg_eqp_id.id)
		INNER JOIN cur_tags ON (cfg_tag_id.id = cur_tags.id)
		INNER JOIN ref_status_def ON (ref_status_def.id = cur_tags.value)
		LEFT JOIN ref_color_def AS color ON (color.id = ref_status_def.color_ID)
		LEFT JOIN ref_color_def AS flash_color ON (flash_color.id = ref_status_def.flash_color_ID)
		LEFT JOIN ref_color_def AS flash_text_color ON (flash_text_color.id = ref_status_def.flash_text_color_ID)
		WHERE cfg_tag_id.ctrl_type IS NULL
			AND cfg_tag_id.alarm_type IS NULL
			AND cfg_tag_id.count_ID IS NULL;

END $$