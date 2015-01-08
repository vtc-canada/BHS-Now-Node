DROP procedure IF EXISTS `BHS_UTIL_GetRefStatusDef`;

DELIMITER $$
USE `bhs_scada`$$
CREATE PROCEDURE `BHS_UTIL_GetRefStatusDef` ()
BEGIN
	SELECT ref_status_def.id
, name
, color_ID
, text_color_ID
, is_flashing
, flash_color_ID
, flash_text_color_ID 
,ref_main_color_def.color_code as 'background_color'
,ref_text_color_def.color_code as 'text_color'
,ref_flashing_main_color_def.color_code as 'flash_background_color'
,ref_flashing_text_color_def.color_code as 'flash_text_color'
FROM ref_status_def
	INNER JOIN ref_color_def AS ref_main_color_def ON (ref_main_color_def.id = ref_status_def.color_ID)
	INNER JOIN ref_color_def AS ref_text_color_def ON (ref_text_color_def.id = ref_status_def.text_color_ID)
	LEFT JOIN ref_color_def AS ref_flashing_main_color_def ON (ref_flashing_main_color_def.id = ref_status_def.flash_color_ID)
	LEFT JOIN ref_color_def AS ref_flashing_text_color_def ON (ref_flashing_text_color_def.id = ref_status_def.flash_text_color_ID);

END$$

DELIMITER ;

