USE `bhs_scada_mhk`;
DROP procedure IF EXISTS `BHS_UTIL_CreateTimeInterval`;

DELIMITER $$
USE `bhs_scada_mhk`$$
CREATE DEFINER=`root`@`%` PROCEDURE `BHS_UTIL_CreateTimeInterval`(IN startDate DateTime,IN endDate DateTime, IN `intervalSeconds` INT)
BEGIN
	#Sproc creates temporary table 'time_range' which will contain a record for every interval in the time range
	DROP TEMPORARY TABLE if EXISTS time_range;
	CREATE TEMPORARY TABLE time_range (
		`interval` DATETIME
	);

   WHILE startDate <= endDate DO
	INSERT INTO time_range(`interval`)
		SELECT startDate as 'interval';
# FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(startDate)/intervalSeconds)*intervalSeconds) as 'interval';
		SET startDate = DATE_ADD(startDate, INTERVAL intervalSeconds/60 MINUTE);
     END WHILE;
END$$

DELIMITER ;

