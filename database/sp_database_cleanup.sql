DROP procedure IF EXISTS `sp_database_cleanup`;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_database_cleanup`()
BEGIN

DELETE FROM cur_alarm_history where timeoff < DATE_SUB(NOW(), INTERVAL 30 DAY);
DELETE FROM cur_bag_summary_history where lastmodified < DATE_SUB(NOW(), INTERVAL 30 DAY);
DELETE FROM cur_bag_event_history where timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY);
DELETE FROM cur_counts_history where  timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY);
DELETE FROM cur_bag_time_active where time_out < DATE_SUB(NOW(), INTERVAL 30 DAY);

END$$

DELIMITER ;

