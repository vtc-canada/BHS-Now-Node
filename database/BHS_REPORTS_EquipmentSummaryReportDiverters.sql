DROP PROCEDURE if EXISTS `BHS_REPORTS_EquipmentSummaryReportDiverters` ;
DELIMITER $$
CREATE PROCEDURE `BHS_REPORTS_EquipmentSummaryReportDiverters`(IN `start_time` DATETIME, 
	IN `end_time` DATETIME, 
	IN `eqp_ID` INT(11), 
	OUT `locale` VARCHAR(4096)
)

BEGIN
SELECT divert_counts_wrapper.eqp_ID
			,divert_counts_wrapper.equipment
			,divert_counts_wrapper.divert_counts
			,cycle_counts_wrapper.cycle_counts
			,divert_counts_wrapper.too_close
			,divert_counts_wrapper.lane_full
			,divert_counts_wrapper.lane_estopped
			,divert_counts_wrapper.lane_faulted
			,divert_counts_wrapper.diverter_faulted
			,divert_counts_wrapper.diverter_out_of_service
			,divert_counts_wrapper.no_reason
			,fault_counts_wrapper.fail_to_extend 
			,fault_counts_wrapper.fail_to_retract 
			,fault_counts_wrapper.position_fault
		FROM (SELECT cfg_dev_id.eqp_ID AS eqp_ID
				,cfg_eqp_id.name AS equipment
				,IF(SUM(divert_counts_table.value) IS NULL,0,SUM(divert_counts_table.value)) AS divert_counts
				,IF(SUM(too_close_table.value) IS NULL,0,SUM(too_close_table.value)) AS too_close
				,IF(SUM(lane_full_table.value) IS NULL,0,SUM(lane_full_table.value)) AS lane_full
				,IF(SUM(lane_estopped_table.value) IS NULL,0,SUM(lane_estopped_table.value)) AS lane_estopped
				,IF(SUM(lane_faulted_table.value) IS NULL,0,SUM(lane_faulted_table.value)) AS lane_faulted
				,IF(SUM(diverter_faulted_table.value) IS NULL,0,SUM(diverter_faulted_table.value)) AS diverter_faulted
				,IF(SUM(diverter_out_of_service_table.value) IS NULL,0,SUM(diverter_out_of_service_table.value)) AS diverter_out_of_service
				,IF(SUM(no_reason_table.value) IS NULL,0,SUM(no_reason_table.value)) AS no_reason
			FROM cfg_dev_id
			INNER JOIN cfg_eqp_id ON cfg_dev_id.eqp_ID = cfg_eqp_id.id
			LEFT OUTER JOIN (SELECT cur_counts_history.value
								,cfg_event_count_id.dev_ID 
							FROM cfg_event_count_id 
							INNER JOIN cur_counts_history ON cur_counts_history.count_ID = cfg_event_count_id.id 
							WHERE (cfg_event_count_id.event_type = 99 
									OR cfg_event_count_id.event_type = 41) 
								 AND cur_counts_history.timestamp > start_time 
								 AND cur_counts_history.timestamp < end_time) AS divert_counts_table
			ON divert_counts_table.dev_ID = cfg_dev_id.id
			LEFT OUTER JOIN (SELECT cur_counts_history.value
								,cfg_event_count_id.dev_ID 
							FROM cfg_event_count_id 
							INNER JOIN cur_counts_history ON cur_counts_history.count_ID = cfg_event_count_id.id 
							WHERE (cfg_event_count_id.event_type = 52) 
								AND cur_counts_history.timestamp > start_time 
								AND cur_counts_history.timestamp < end_time) AS too_close_table
				ON too_close_table.dev_ID = cfg_dev_id.id
			LEFT OUTER JOIN (SELECT cur_counts_history.value
								,cfg_event_count_id.dev_ID 
							FROM cfg_event_count_id 
							INNER JOIN cur_counts_history ON cur_counts_history.count_ID = cfg_event_count_id.id 
							WHERE (cfg_event_count_id.event_type = 53) 
										AND cur_counts_history.timestamp > start_time 
										AND cur_counts_history.timestamp < end_time) AS lane_full_table
				ON lane_full_table.dev_ID = cfg_dev_id.id
			LEFT OUTER JOIN (SELECT cur_counts_history.value
								,cfg_event_count_id.dev_ID 
							FROM cfg_event_count_id 
							INNER JOIN cur_counts_history ON cur_counts_history.count_ID = cfg_event_count_id.id 
							WHERE (cfg_event_count_id.event_type = 54) 
								AND cur_counts_history.timestamp > start_time 
								AND cur_counts_history.timestamp < end_time) AS lane_estopped_table
				ON lane_estopped_table.dev_ID = cfg_dev_id.id
			LEFT OUTER JOIN (SELECT cur_counts_history.value
								, cfg_event_count_id.dev_ID 
							FROM cfg_event_count_id 
							INNER JOIN cur_counts_history ON cur_counts_history.count_ID = cfg_event_count_id.id 
							WHERE (cfg_event_count_id.event_type = 55) 
								AND cur_counts_history.timestamp > start_time 
								AND cur_counts_history.timestamp < end_time) AS lane_faulted_table
				ON lane_faulted_table.dev_ID = cfg_dev_id.id
			LEFT OUTER JOIN (SELECT cur_counts_history.value
								,cfg_event_count_id.dev_ID 
							FROM cfg_event_count_id 
							INNER JOIN cur_counts_history ON cur_counts_history.count_ID = cfg_event_count_id.id 
							WHERE (cfg_event_count_id.event_type = 56) 
								AND cur_counts_history.timestamp > start_time 
								AND cur_counts_history.timestamp < end_time) AS diverter_faulted_table
				ON diverter_faulted_table.dev_ID = cfg_dev_id.id
			LEFT OUTER JOIN (SELECT cur_counts_history.value
								,cfg_event_count_id.dev_ID 
							FROM cfg_event_count_id 
							INNER JOIN cur_counts_history ON cur_counts_history.count_ID = cfg_event_count_id.id 
							WHERE (cfg_event_count_id.event_type = 57) 
								AND cur_counts_history.timestamp > start_time 
								AND cur_counts_history.timestamp < end_time) AS diverter_out_of_service_table
				ON diverter_out_of_service_table.dev_ID = cfg_dev_id.id
			LEFT OUTER JOIN (SELECT cur_counts_history.value
								,cfg_event_count_id.dev_ID 
							FROM cfg_event_count_id 
							INNER JOIN cur_counts_history ON cur_counts_history.count_ID = cfg_event_count_id.id 
							WHERE (cfg_event_count_id.event_type = 51) 
								AND cur_counts_history.timestamp > start_time 
								AND cur_counts_history.timestamp < end_time) AS no_reason_table
				ON no_reason_table.dev_ID = cfg_dev_id.id
			WHERE cfg_eqp_id.type = 11 
					AND (eqp_ID IS NULL OR cfg_eqp_id.id = eqp_ID)
			GROUP BY cfg_dev_id.eqp_ID) AS divert_counts_wrapper
		INNER JOIN (SELECT cfg_eqp_id.id AS eqp_ID
						,IF(SUM(cycle_counts_table.value) IS NULL,0,SUM(cycle_counts_table.value)) AS cycle_counts
					FROM cfg_eqp_id
					LEFT OUTER JOIN (SELECT cur_counts_history.value
										,cfg_tag_id.eqp_ID 
									FROM cfg_count_id 
									INNER JOIN cur_counts_history ON cur_counts_history.count_ID = cfg_count_id.id 
									INNER JOIN cfg_tag_id ON cfg_tag_id.count_ID = cfg_count_id.id 
									WHERE cfg_count_id.type = 3 
										AND cfg_count_id.counts_group = 11 AND cur_counts_history.timestamp > start_time AND cur_counts_history.timestamp < end_time) AS cycle_counts_table
						ON cycle_counts_table.eqp_ID = cfg_eqp_id.id
					WHERE cfg_eqp_id.type = 11 
						AND (eqp_ID IS NULL OR cfg_eqp_id.id = eqp_ID)
					GROUP BY cfg_eqp_id.id) AS cycle_counts_wrapper
			ON divert_counts_wrapper.eqp_ID = cycle_counts_wrapper.eqp_ID
		INNER JOIN  (SELECT cfg_eqp_id.id AS eqp_ID
						,IF(SUM(fail_to_extend_table.value) IS NULL,0,SUM(fail_to_extend_table.value)) AS fail_to_extend
						,IF(SUM(fail_to_retract_table.value) IS NULL,0,SUM(fail_to_retract_table.value)) AS fail_to_retract
						,IF(SUM(position_fault_table.value) IS NULL,0,SUM(position_fault_table.value)) AS position_fault
					FROM cfg_eqp_id
					LEFT OUTER JOIN (SELECT cur_counts_history.value
										,cfg_tag_id.eqp_ID 
									FROM cfg_count_id 
									INNER JOIN cur_counts_history ON cur_counts_history.count_ID = cfg_count_id.id 
									INNER JOIN cfg_tag_id ON cfg_tag_id.count_ID = cfg_count_id.id 
									WHERE cfg_count_id.type = 1 
										AND cfg_tag_id.alarm_type = 20 
										AND cur_counts_history.timestamp > start_time 
										AND cur_counts_history.timestamp < end_time) AS fail_to_extend_table
						ON fail_to_extend_table.eqp_ID = cfg_eqp_id.id
					LEFT OUTER JOIN (SELECT cur_counts_history.value
										,cfg_tag_id.eqp_ID 
									FROM cfg_count_id 
									INNER JOIN cur_counts_history ON cur_counts_history.count_ID = cfg_count_id.id 
									INNER JOIN cfg_tag_id ON cfg_tag_id.count_ID = cfg_count_id.id 
									WHERE cfg_count_id.type = 1 
										AND cfg_tag_id.alarm_type = 21 
										AND cur_counts_history.timestamp > start_time 
										AND cur_counts_history.timestamp < end_time) AS fail_to_retract_table
						ON fail_to_retract_table.eqp_ID = cfg_eqp_id.id
					LEFT OUTER JOIN (SELECT cur_counts_history.value
										,cfg_tag_id.eqp_ID 
									FROM cfg_count_id 
									INNER JOIN cur_counts_history ON cur_counts_history.count_ID = cfg_count_id.id 
									INNER JOIN cfg_tag_id ON cfg_tag_id.count_ID = cfg_count_id.id 
									WHERE cfg_count_id.type = 1 
										AND cfg_tag_id.alarm_type = 17 
										AND cur_counts_history.timestamp > start_time 
										AND cur_counts_history.timestamp < end_time) AS position_fault_table
						ON position_fault_table.eqp_ID = cfg_eqp_id.id
					WHERE cfg_eqp_id.type = 11 
						AND (eqp_ID IS NULL OR cfg_eqp_id.id = eqp_ID)
					GROUP BY cfg_eqp_id.id) AS fault_counts_wrapper
			ON divert_counts_wrapper.eqp_ID = fault_counts_wrapper.eqp_ID;

	SET locale = '{"columns":[
			{"locale":{"en":"equip_ID","es":"equip_ID"},"lastrow":{"type":"custom","value":"equip_ID","bold":true,"bordertop":false},"hidden":true},
			{"locale":{"en":"Equipment","es":"Equipo"},"lastrow":{"type":"custom","value":"Total","bold":true,"bordertop":true}},
			{"locale":{"en":"Divert Counts","es":"Desviar Condes"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"Cycle Counts","es":"Cuentas de Ciclo"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"Too Close","es":"Demasiado Cerca"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"Lane Full","es":"Carril Completo"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"Lane E-stopped","es":"Carril E-Parado"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"Lane Faulted","es":"Carril Faulted"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"Diverter Faulted","es":"Desviador Faulted"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"Diverter out of Service","es":"Desviador de Servicio"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"No Reason","es":"No Reason"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"Fail to Extend","es":"No se Pueden Extender"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"Fail to Retract","es":"Dejar de Retracción"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}},
			{"locale":{"en":"Position Fault","es":"Posición de Fallo"},"lastrow":{"type":"sum","bold":true,"bordertop":true,"decimalplaces":2}}
		]}';
END $$
DELIMITER ;
