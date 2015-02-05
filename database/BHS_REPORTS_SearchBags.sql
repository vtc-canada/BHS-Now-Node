DROP PROCEDURE if EXISTS `BHS_REPORTS_SearchBags` ;
DELIMITER $$
CREATE PROCEDURE `BHS_REPORTS_SearchBags`(IN `start_time` DATETIME,
 IN `end_time` DATETIME,
 IN `search_field` INT(11)
)
BEGIN
  SELECT cur_bag_summary_history.id, act_bag_ID, IF(active = 1,'Active' ,'Inactive') AS active, IATA_tag, security_ID, ref_security_status_def.status AS security_status, ref_sort_destinations.destination AS sort_destination, EDS_DEV.name AS EDS_Machine,lvl1ref.status AS level_1_status,lvl2ref.status AS level_2_status,lvl3ref.status AS level_3_status,lvl4ref.status AS level_4_status,lvl5ref.status AS level_5_status,ATR_DEV.name AS ATR_name,DIV_DEV.name AS diverter_name, cur_bag_summary_history.lastmodified
  FROM cur_bag_summary_history
  LEFT OUTER JOIN ref_security_status_def ON cur_bag_summary_history.security_status = ref_security_status_def.id
  LEFT OUTER JOIN ref_sort_destinations ON cur_bag_summary_history.sort_destination = ref_sort_destinations.id
  LEFT OUTER JOIN cfg_dev_id AS EDS_DEV ON EDS_DEV.id = cur_bag_summary_history.EDS_Machine_ID
  LEFT OUTER JOIN ref_security_status_def AS lvl1ref ON lvl1ref.id = cur_bag_summary_history.level_1_status
  LEFT OUTER JOIN ref_security_status_def AS lvl2ref ON lvl2ref.id = cur_bag_summary_history.level_2_status
  LEFT OUTER JOIN ref_security_status_def AS lvl3ref ON lvl3ref.id = cur_bag_summary_history.level_3_status
  LEFT OUTER JOIN ref_security_status_def AS lvl4ref ON lvl4ref.id = cur_bag_summary_history.level_4_status
  LEFT OUTER JOIN ref_security_status_def AS lvl5ref ON lvl5ref.id = cur_bag_summary_history.level_5_status
  LEFT OUTER JOIN cfg_dev_id AS ATR_DEV ON ATR_DEV.id = cur_bag_summary_history.ATR_ID
  LEFT OUTER JOIN cfg_dev_id AS DIV_DEV ON DIV_DEV.id = cur_bag_summary_history.diverter_ID
  WHERE lastmodified > start_time AND lastmodified < end_time AND ((search_field IS NULL) OR (IATA_tag = search_field OR security_ID = search_field));

END $$
DELIMITER ;