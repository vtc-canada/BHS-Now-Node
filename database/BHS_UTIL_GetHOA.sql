DROP PROCEDURE if EXISTS `BHS_UTIL_GetHOA` ;

DELIMITER $$
CREATE PROCEDURE `BHS_UTIL_GetHOA`()
BEGIN
	SELECT oos.eqp_ID
		,oos.id AS 'oos_id'
		,oos.name
		,hmioverride.name
		,oos.value AS 'oos_value'
		,hmioverride.id AS 'hmioverride_id'
		,hmioverride.value AS 'hmioverride_value'
		,handreq.id AS 'handreq_id'
		,handreq.tag_address AS 'handreq_tag_address'
		,handreq.opc_path AS 'handreq_opc_path'
		,handreq.opc_url AS 'handreq_opc_url'
		,offreq.id AS 'offreq_id'
		,offreq.tag_address AS 'offreq_tag_address'
		,offreq.opc_path AS 'offreq_opc_path'
		,offreq.opc_url AS 'offreq_opc_url'
		,autoreq.id AS 'autoreq_id'
		,autoreq.tag_address AS 'autoreq_tag_address'
		,autoreq.opc_path AS 'autoreq_opc_path'
		,autoreq.opc_url AS 'autoreq_opc_url'
	FROM 
		(Select cfg_tag_id.id
			,cur_tags.value
			,cfg_tag_id.name AS tag_name	
			,cfg_tag_id.eqp_ID
			,cfg_tag_id.name
		FROM cur_tags 
		INNER JOIN	cfg_tag_id ON (cur_tags.id = cfg_tag_id.id AND cfg_tag_id.alarm_type = 6)) AS oos
	INNER JOIN 
		(Select cfg_tag_id.id
			,cur_tags.value
			,cfg_tag_id.name AS tag_name	
			,cfg_tag_id.eqp_ID
			,cfg_tag_id.name
		FROM cur_tags 
		INNER JOIN	cfg_tag_id ON (cur_tags.id = cfg_tag_id.id AND cfg_tag_id.alarm_type = 7))  AS hmioverride
	ON oos.eqp_ID = hmioverride.eqp_ID
	INNER JOIN
		(SELECT cfg_tag_id.id
			,cfg_tag_id.name AS tag_name
			,cfg_tag_id.tag_address
			,cfg_tag_id.eqp_ID
			,cfg_plc_id.opc_path
			,cfg_plc_id.opc_url
			,cfg_plc_id.name AS plc_name
			,cfg_plc_id.id AS plc_id
		FROM cfg_tag_id 
		INNER JOIN cfg_plc_id ON (cfg_tag_id.plc_ID = cfg_plc_id.id)
		WHERE cfg_tag_id.ctrl_type = 11) AS handreq
	ON oos.eqp_ID = handreq.eqp_ID
	INNER JOIN
		(SELECT cfg_tag_id.id
			,cfg_tag_id.name AS tag_name
			,cfg_tag_id.tag_address
			,cfg_tag_id.eqp_ID
			,cfg_plc_id.opc_path
			,cfg_plc_id.opc_url
			,cfg_plc_id.name AS plc_name
			,cfg_plc_id.id AS plc_id
		FROM cfg_tag_id 
		INNER JOIN cfg_plc_id ON (cfg_tag_id.plc_ID = cfg_plc_id.id)
		WHERE cfg_tag_id.ctrl_type = 12) AS offreq
	ON oos.eqp_ID = offreq.eqp_ID
	INNER JOIN
		(SELECT cfg_tag_id.id
			,cfg_tag_id.name as tag_name
			,cfg_tag_id.tag_address
			,cfg_tag_id.eqp_ID
			,cfg_plc_id.opc_path
			,cfg_plc_id.opc_url
			,cfg_plc_id.name AS plc_name
			,cfg_plc_id.id AS plc_id
		FROM cfg_tag_id 
		INNER JOIN cfg_plc_id ON (cfg_tag_id.plc_ID = cfg_plc_id.id)
		WHERE cfg_tag_id.ctrl_type = 13 ) AS autoreq
	ON oos.eqp_ID = autoreq.eqp_ID;
END$$
DELIMITER ;